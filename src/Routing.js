/*
File for Web Routing Feature
*/

//import mapboxgl from 'mapbox-gl';

//developed by Tristan Bailey
function Route(map, pins, startLat, startLong, endLat, endLong){
    geoJSON = pinDataToGeoJSON(pins);
    //scale hazards naively assuming they are 2 sqft
    var obstructions = turf.buffer(geoJSON, 1.86E-7, { units: 'kilometers'});

    //tutorial map code here, not necessary for routing however

};
function testJest(){
    return true;
}

/*Input: array of pins from database
  Output: GeoJSON object
  Ref: https://geojson.org/
  Desc: Converts the pins from the database array into a corresponding
        GeoJSON object. See reference for format guide. Assumes pre-groomed data.
*/
function pinDataToGeoJSON(pinData){
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

module.exports = {
    testJest,
    pinDataToGeoJSON,
    Route
};