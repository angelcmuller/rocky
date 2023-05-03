/*
File for Web Routing Feature and Supporting Functions
*/

import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import * as turf from '@turf/turf';
import * as polyline from '@mapbox/polyline';

import JsonListReturn from "./components/recordList";
import { markers, appendMarkers, displayMarkers, removeMarkers  } from "./Map.js";
import { object_filter } from './Object_Filter';

async function MongoRecords(link) {
    const pinInfo = await JsonListReturn(link);
    return pinInfo
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
  

//developed by Tristan Bailey
export async function Route(map, directions, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked, isCommentChecked, pinInformation, setPinInformation, routeCount=3){
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
        for(const route of routes){
            map.setLayoutProperty(`route${route.id}`, 'visibility', 'visible');
            //convert each route to a geojson
            const routeLine = polyline.toGeoJSON(route.geometry);
            var [pins, commentData] = await geobox_pins(routeLine);
            pins = object_filter(pins, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked);
            commentData = object_filter(commentData, isOtherChecked, isPotholeChecked, isCrackChecked, isSpeedBumpChecked, isBumpChecked);
            var comment_objects_length;
            var comment_objects;
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
            }

            const geoJSON_pins = pinDataToGeoJSON(pins);
            //scale hazards naively assuming they are 30 sqft, as this is the minimum buffer supports
            const obstructions_pins = turf.buffer(geoJSON_pins, 0.01, { units: 'kilometers'});
            const pin_objects = getPinsByIds(pins,
                compile_intersection_id_list(obstructions_pins, routeLine)
            );

            console.log("Lengths");
            console.log(comment_objects_length);
            console.log(pin_objects.length);
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
        }
    });
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
      
        // Add event listener for changes to the profile property of the Mapbox Directions object
        directions.on('profile', async (event) => {
            removeMarkers(map);
            const profile = event.profile;
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