/*
File for Web Routing Feature and Supporting Functions
*/

import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import * as turf from '@turf/turf';
import * as polyline from '@mapbox/polyline';

import JsonListReturn from "./components/recordList";

async function MongoRecords(link) {
    const pinInfo = await JsonListReturn(link);
    return pinInfo
  }

//developed by Tristan Bailey
export async function Route(map, directions, startLat=0, startLong=0, endLat=0, endLong=0, routeCount=3){
    const [pins, commentData] = await Promise.all([MongoRecords(`http://localhost:3000/record/`), MongoRecords(`http://localhost:3000/crecord/`)]);
    var geoJSON = pinDataToGeoJSON(pins);
    //scale hazards naively assuming they are 8 sqft
    var obstructions = turf.buffer(geoJSON, 0.25, { units: 'kilometers'});
    
    //add routes layers to map limiting to a maximum of 10
    for (let i =0; i <= routeCount && i < 10; ++i){
        map.addSource(`route${i}`, {
            type: 'geojson',
            data: {
                type: 'Feature'
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
    //call to directions api to handle future route computations
    //map.addControl(directions, 'top-left');

    directions.on('route', (event) => {
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
            console.log(JSON.stringify(routeLine));
            console.log(JSON.stringify(obstructions));
            
            map.getSource(`route${route.id}`).setData(routeLine);
            const isClear = turf.booleanDisjoint(obstructions, routeLine) === true;
            //console.log(turf.booleanDisjoint(obstructions, routeLine));
            if (isClear) {
                map.setPaintProperty(`route${route.id}`, 'line-color', '#31C4AF');
            } else {
                map.setPaintProperty(`route${route.id}`, 'line-color', '#9933ff');
            }
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
                degree: pinData[i].Degree
                //"classification": data[i].Classification
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