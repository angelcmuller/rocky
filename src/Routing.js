/*
File for Web Routing Feature and Supporting Functions
*/

import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

//developed by Tristan Bailey
export function Route(map, pins=0, startLat=0, startLong=0, endLat=0, endLong=0, routeCount=3){
    //geoJSON = pinDataToGeoJSON(pins);
    //scale hazards naively assuming they are 2 sqft
    //var obstructions = turf.buffer(geoJSON, 1.86E-7, { units: 'kilometers'});
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
    const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving',
        alternatives: 'false',
        geometries: 'geojson'
    });
    map.addControl(directions, 'top-right');
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
    pinData.then(data => {
        for (var i = 0; i < data.length; i++) {
            var feature = {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [data[i].Lattitude, data[i].Longitude]
                },
                properties: {
                    degree: data[i].Degree
                    //"classification": data[i].Classification
                }
            };
            geoJson.features.push(feature);
        }

    });
    return geoJson;
}