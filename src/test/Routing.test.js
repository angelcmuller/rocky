//npm install jest

//test for the routing method
const Routing = require('../Routing')

//tests to make sure testing is working
test('Testing Jest', () => {
    expect(Routing.testJest()).toBe(true);
});

//test for GeoJSON converter
const output = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-84.47426, 38.06673]
        },
        properties: {
          degree: "0"
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-84.47208, 38.06694]
        },
        properties: {
          degree: "1"
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-84.47184, 38.06694]
        },
        properties: {
          degree: "2"
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-84.60485, 38.12184]
        },
        properties: {
          degree: "3"
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-84.61905, 37.87504]
        },
        properties: {
          degree: "4"
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-84.55946, 38.30213]
        },
        properties: {
          degree: "5"
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-84.27235, 38.04954]
        },
        properties: {
          degree: "6"
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-84.27264, 37.82917]
        },
        properties: {
          degree: "7"
        }
      }
    ]
  };

async function temp(){
    const input = [
        {Lattitude: -84.47426, Longitude: 38.06673, Degree: 0},
        {Lattitude: -84.47208, Longitude: 38.06694, Degree: 1},
        {Lattitude: -84.47184, Longitude: 38.06694, Degree: 2},
        {Lattitude: -84.60485, Longitude: 38.12184, Degree: 3},
        {Lattitude: -84.61905, Longitude: 37.87504, Degree: 4},
        {Lattitude: -84.55946, Longitude: 38.30213, Degree: 5},
        {Lattitude: -84.47426, Longitude: 38.04954, Degree: 6},
        {Lattitude: -84.27264, Longitude: 37.82917, Degree: 7},
    ];
    return input;
}
function equalJSON(j1,j2) {
    return JSON.stringify(j1) === JSON.stringify(j2);
}
var some = temp(); 

test('Testing converting pin data to geoJSON', () => {
    expect(equalJSON(output,Routing.pinDataToGeoJSON(some)));
});