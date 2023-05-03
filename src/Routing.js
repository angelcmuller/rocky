/*
File for Web Routing Feature and Supporting Functions
*/

import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import * as turf from '@turf/turf';
import * as polyline from '@mapbox/polyline';

import JsonListReturn from "./components/recordList";
import { markers, appendMarkers, displayMarkers, removeMarkers  } from "./Map.js";
import { object_filter, count_classifications, calculateLikesDislikesRatio, mergeCounts, filterObjectsByPriority } from './Object_Filter';
import { ScoringSystem } from './Score';
import { displayPanel } from './Route_Panel';

async function MongoRecords(link) {
    const pinInfo = await JsonListReturn(link);
    return pinInfo
}


function getDirectionsUrl(origin, destination, params) {
    const baseUrl = 'https://api.mapbox.com/directions/v5/mapbox';
    const profile = params.profile;
    const waypoints = params.waypoints ? params.waypoints.map(wp => `${wp[0]},${wp[1]}`).join(';') : '';
    const alternatives = params.alternatives ? 'true' : 'false';
    const accessToken = mapboxgl.accessToken;
    const queryParams = new URLSearchParams({
      geometries: 'polyline',
      overview: 'full',
      steps: 'false',
      alternatives: alternatives,
      access_token: accessToken
    });
  
    let url = `${baseUrl}/${profile}/${waypoints}/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?${queryParams.toString()}`;
  
    return url;
  }

function checkIntersection(routeLine, specialGeoJSONList) {
    for (const specialGeoJSON of specialGeoJSONList) {
        console.log("stuff")
        console.log('routeLine:', routeLine);
        console.log('specialGeoJSON:', specialGeoJSON);
        const intersection = turf.lineIntersect(routeLine, specialGeoJSON);
        if (intersection.features.length > 0) {
            return true;
        }
    }
    return false;
}
        


function calculateRouteScore(route, waypoints) {
    const routeLine = polyline.toGeoJSON(route.geometry);
    const bufferedWaypoints = turf.buffer(waypoints, 0.01, { units: 'kilometers' });
  
    let intersections = 0;
  
    for (const waypointFeature of bufferedWaypoints.features) {
      if (turf.booleanIntersects(routeLine, waypointFeature)) {
        intersections++;
      }
    }
  
    return intersections;
  }
  
async function rerouteIfNecessary(route, directions, map, lastPanelTop, pinInformation, setPinInformation, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked, selectedPriority, isCommentChecked) {
    //get route distances
    const distanceMeters = route.distance;
    const distanceMiles = distanceMeters / 1609.34;
    
    //convert each route to a geojson
    const routeLine = polyline.toGeoJSON(route.geometry);
    var [pins, commentData] = await geobox_pins(routeLine);
    pins = object_filter(pins, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked);
    commentData = object_filter(commentData, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked);
    
    const priority_objs = mergeGeoJSONObjects(pinDataToGeoJSON(filterObjectsByPriority(pins, selectedPriority)), pinDataToGeoJSON(filterObjectsByPriority(commentData, selectedPriority)))
    // Calculate the centroids of the buffered special GeoJSON objects
    const waypoints = calculateCentroids(priority_objs);

    const intersections = checkIntersection(route, waypoints);
  
    if (intersections) {
        const origin = directions.getOrigin().geometry.coordinates;
        const destination = directions.getDestination().geometry.coordinates;
        const profile = directions.getProfile();

        const response = await fetch(getDirectionsUrl(origin, destination, { profile, alternatives: true }));
        const data = await response.json();
        const routes = data.routes;

        const bufferedWaypoints = turf.buffer(waypoints, 0.01, { units: 'kilometers' });

        const validRoutes = routes.filter(route => {
        const routeLine = polyline.toGeoJSON(route.geometry);
        return !turf.booleanIntersects(bufferedWaypoints, routeLine);
        });

        let bestRoute = validRoutes[0];
        let bestScore = calculateRouteScore(bestRoute); // Define your own function to calculate route score

        for (const route of validRoutes.slice(1)) {
        const score = calculateRouteScore(route, waypoints);
        if (score < bestScore) {
            bestScore = score;
            bestRoute = route;
        }
        }

        directions.setRoutes([bestRoute]);
        lastPanelTop = await displayRoute(bestRoute, map, lastPanelTop, pinInformation, setPinInformation, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked, selectedPriority, isCommentChecked);
        return [true, lastPanelTop];
    } else {
        return [false, lastPanelTop];
    }
  }
   

function mergeGeoJSONObjects(geojson1, geojson2) {
   if(geojson1 === [] && geojson2 === []){
    return []
   }
   else if(geojson2 === []){
    return geojson1
   }
   else if (geojson1 === []){
    return geojson2
   }
   
    // Concatenate the features arrays of the two GeoJSON objects
    const mergedFeatures = geojson1.features.concat(geojson2.features);
  
    // Create a new GeoJSON object with the merged features
    const mergedGeoJSON = {
      "type": "FeatureCollection",
      "features": mergedFeatures
    };
  
    return mergedGeoJSON;
  }
  
function calculateCentroids(specialGeoJSONList) {
    const centroids = [];
    for (const specialGeoJSON of specialGeoJSONList) {
        const buffered = turf.buffer(specialGeoJSON, 0.25, { units: 'kilometers' });
        const centroid = turf.centroid(buffered);
        centroids.push(turf.point(centroid.geometry.coordinates));
    }
    return centroids;
}



//Author: Tristan Bailey
async function getInBox(collection, minLongitude, maxLongitude, minLatitude, maxLatitude ){
    var url;
    if(collection == "Comments"){
        url = url = `http://localhost:3000/crecord?minLongitude=${minLongitude}&maxLongitude=${maxLongitude}&minLatitude=${minLatitude}&maxLatitude=${maxLatitude}`;
    }
    else {
        url = url = `http://localhost:3000/record?minLongitude=${minLongitude}&maxLongitude=${maxLongitude}&minLatitude=${minLatitude}&maxLatitude=${maxLatitude}`;
    }
    const pins = await MongoRecords(url);
    return pins
}

async function geobox_pins(routeLine){
    const bbox = turf.bbox(routeLine);
    // Extract the individual values from the bounding box array
    const [west, south, east, north] = bbox;

    // Calculate the max and min longitude and latitude values
    const max_longitude = east;
    const min_longitude = west;
    const max_latitude = north;
    const min_latitude = south;

    return await Promise.all([getInBox("Pins", min_longitude, max_longitude, min_latitude, max_latitude), getInBox("Comments", min_longitude, max_longitude, min_latitude, max_latitude)]);
}

function compile_intersection_id_list(obstructions_pins, routeLine){
    // Initialize an array to store the intersected feature IDs
    let intersectedFeatureIds = [];

    // Iterate over the features in obstructions_pins GeoJSON
    turf.featureEach(obstructions_pins, (currentFeature) => {
    // Check if the current feature intersects with the routeLine
    if (turf.booleanIntersects(currentFeature, routeLine)) {
        // If the intersection is found, store the intersected feature ID in the array
        intersectedFeatureIds.push(currentFeature.properties.id);
    }
    });
    return intersectedFeatureIds;
}
function getPinsByIds(pins, pin_ids) {
    const result = [];
    for (let i = 0; i < pin_ids.length; i++) {
      const index = pin_ids[i];
      if (index >= 0 && index < pins.length) {
        result.push(pins[index]);
      }
    }
    return result;
  }
  async function displayRoute(route, map, lastPanelTop, pinInformation, setPinInformation, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked, selectedPriority, isCommentChecked) {
    //get route distances
    const distanceMeters = route.distance;
    const distanceMiles = distanceMeters / 1609.34;
    console.log(distanceMeters)
    console.log(distanceMiles)
    
    map.setLayoutProperty(`route${route.id}`, 'visibility', 'visible');
    //convert each route to a geojson
    const routeLine = polyline.toGeoJSON(route.geometry);
    var [pins, commentData] = await geobox_pins(routeLine);
    pins = object_filter(pins, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked);
    commentData = object_filter(commentData, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked);
    var comment_objects_length;
    var comment_objects;
    var count_comment = {};
    if(isCommentChecked){
        commentData = [];
        comment_objects_length = 0;
        comment_objects = [];
    }
    else{
        const geoJSON_comments = pinDataToGeoJSON(commentData);
        const obstructions_comments = turf.buffer(geoJSON_comments, 0.01, { units: 'kilometers'});
        comment_objects = getPinsByIds(commentData, 
            compile_intersection_id_list(obstructions_comments, routeLine)
        );
        comment_objects_length = comment_objects.length;
        count_comment = count_classifications(comment_objects, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked);
    }

    const geoJSON_pins = pinDataToGeoJSON(pins);
    //scale hazards naively assuming they are 30 sqft, as this is the minimum buffer supports
    const obstructions_pins = turf.buffer(geoJSON_pins, 0.01, { units: 'kilometers'});
    const pin_objects = getPinsByIds(pins,
        compile_intersection_id_list(obstructions_pins, routeLine)
    );

    const count_pins = count_classifications(pin_objects, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked);
    console.log(JSON.stringify(count_comment))
    console.log(JSON.stringify(count_pins))
    
    console.log("Lengths");
    console.log(comment_objects_length);
    console.log(pin_objects.length);

    
    const approval_rating = calculateLikesDislikesRatio(comment_objects);
    
    console.log("Rating " + approval_rating)

    const [score, hazard_ratio] = ScoringSystem(distanceMeters, pin_objects, comment_objects)

    const json_data = mergeCounts(count_comment, count_pins)
        json_data.score = score;
        json_data.hazard_ratio = hazard_ratio;
        json_data.approval_rating = approval_rating;
        json_data.route_id = route.id;
    //alert(JSON.stringify(json_data))
    const offset = displayPanel(json_data, map, lastPanelTop);

    // Update the vertical position of the last panel displayed
    lastPanelTop += offset + 10; // Add an offset to create some space between panels

    await appendMarkers(pin_objects, comment_objects, map, pinInformation, setPinInformation);
    map.getSource(`route${route.id}`).setData(routeLine);
    if (comment_objects_length === 0 && pin_objects.length === 0){
    map.setPaintProperty(`route${route.id}`, 'line-color', '#31C4AF');
        console.log("clear");
    } else {
        map.setPaintProperty(`route${route.id}`, 'line-color', '#9933ff');
        console.log("not clear");
    }
    displayMarkers(map, markers)
    return lastPanelTop;
}  

//developed by Tristan Bailey
export async function Route(map, directions, selectedPriority, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked, isCommentChecked, pinInformation, setPinInformation, routeCount=3){
    //option1 bump, option2 isPotholeChecked, option3 speedbump
    //hard limit to three routes
    if (routeCount > 3){routeCount = 3}
    function addAdditionalSourceAndLayer(map, routeCount) {
        //add routes layers to map limiting to a maximum of 10
        for (let i =0; i <= routeCount && i < 10; ++i){
            map.addSource(`route${i}`, {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: '{}',
                }
            });
            map.addLayer({
                id: `route${i}`,
                type: 'line',
                source: `route${i}`,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#5cb2b2',
                    'line-opacity': 0.5,
                    'line-width': 12,
                    'line-blur': 0.25
                }
            });
        }
    }
    function removeAdditionalSourceAndLayer(map, routeCount) {
        // remove routes layers from map
        for (let i =0; i <= routeCount && i < 10; ++i){
            if (map.getLayer(`route${i}`)) {
                map.removeLayer(`route${i}`);
            }
            if (map.getSource(`route${i}`)) {
                map.removeSource(`route${i}`);
            }
        }
    }    

    //call to directions api to handle future route computations
    //map.addControl(directions, 'top-left');
    //deactivateRadius(map);
    var profile = 'mapbox/driving';
    directions.on('route', async (event) => {

        removeMarkers(map);
        //markers.forEach(marker => marker.remove());
        //markers = [];
        removeAdditionalSourceAndLayer(map, routeCount);
        addAdditionalSourceAndLayer(map, routeCount);
        //const [pins, commentData] = await Promise.all([getInBox(), getInBox()]);
        //const [pins, commentData] = await Promise.all([MongoRecords(`http://localhost:3000/record/`), MongoRecords(`http://localhost:3000/crecord/`)]);
        //const reports = document.getElementById('reports');
        //reports.innerHTML = '';
        //const report = reports.appendChild(document.createElement('div'));

        //give routs IDs
        const routes = event.route.map((route, index) =>({
            ...route,
            id: index
        }));

        //hide routes temporarily
        for(let i = 0; i < routeCount && i < 10; ++i){
            map.setLayoutProperty(`route${i}`, 'visibility', 'none');
        }
        let lastPanelTop = 10;
        for(const route of routes){
            let reroute = false;
            //alert(profile)
            if (false) {
                [reroute, lastPanelTop] = rerouteIfNecessary(route, directions, map, lastPanelTop, pinInformation, setPinInformation, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked, selectedPriority, isCommentChecked)
            }
            if(!reroute){
                lastPanelTop = await displayRoute(route, map, lastPanelTop, pinInformation, setPinInformation, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked, selectedPriority, isCommentChecked);
            }
        }
    });
      
        // Add event listener for changes to the profile property of the Mapbox Directions object
        directions.on('profile', async (event) => {
            removeMarkers(map);
            profile = event.profile;
            if (profile === 'mapbox/walking' || profile === 'mapbox/cycling') {
                // Change the profile-specific settings here
                directions.setOptions({
                    profile: profile,
                    walkingOptions: {
                        exclude: 'motorway,tollway,steps'
                    },
                    cyclingOptions: {
                        exclude: 'motorway,tollway'
                    }
                });
    
                // Rerun route calculation with the new profile
                const origin = directions.getOrigin().geometry.coordinates;
                const destination = directions.getDestination().geometry.coordinates;
                const waypoints = directions.getWaypoints().map(wp => wp.geometry.coordinates);
                const params = {
                    profile: profile,
                    waypoints: waypoints,
                    alternatives: true
                };
                const response = await fetch(getDirectionsUrl(origin, destination, params));
                const data = await response.json();
                directions.setRoutes(data.routes);
            } else {
                // Revert to the default settings
                directions.setOptions({
                    profile: 'mapbox/driving',
                    walkingOptions: {},
                    cyclingOptions: {}
                });
    
                // Rerun route calculation with the default profile
                directions.setOrigin(directions.getOrigin());
                directions.setDestination(directions.getDestination());
            }
        });
}
export function testJest(){
    return true;
}

/*Input: array of pins from database
  Output: GeoJSON object
  Ref: https://geojson.org/
  Desc: Converts the pins from the database array into a corresponding
        GeoJSON object. See reference for format guide. Assumes pre-groomed data.
*/
export function pinDataToGeoJSON(pinData){
    var geoJson = {
        type: "FeatureCollection",
        features: []
    };
    for (var i = 0; i < pinData.length; i++) {
        var feature = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [pinData[i].Longitude, pinData[i].Lattitude]
            },
            properties: {
                //id to use to re reference later when we want to add markers to map
                id: i,
                classification: pinData[i].Classification,
                severity: pinData[i].Option,
                likes: pinData[i].Likes,
                dislikes: pinData[i].Dislikes
            }
        };
        geoJson.features.push(feature);
    }

    return geoJson;
}

//module.exports = {
//    testJest,
//    pinDataToGeoJSON,
//     Route
// };