const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017'; // Replace with your MongoDB URL
const dbName = 'yourDBName'; // Replace with your database name

//Author: Tristan Bailey
recordRoutes.route("/inradius").get(function(req, res) {
  let db_connect = dbo.getDb("pinDatabase");
  let query = {};
  let pin_collection = "";

  function haversine(lat1, lon1, lat2, lon2) {
    function toRad(x) {
      return x * Math.PI / 180;
    }
  
    var R = 6371; // km
    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
  
    return d;
  }

  if (req.query.longitude && req.query.latitude && req.query.radius && req.query.collection) {
    if(req.query.collection === "1"){
      pin_collection = "Comments"
    }
    else{
      pin_collection = "Pins"
    }
    console.log(pin_collection)
    const longitude = Number(req.query.longitude);
    const latitude = Number(req.query.latitude);
    const radiusInMiles = Number(req.query.radius);
    const radiusInKm = radiusInMiles * 1.60934;

    query = {
      $and: [
        { Longitude: { $gte: longitude - (radiusInMiles / 69) } },
        { Longitude: { $lte: longitude + (radiusInMiles / 69) } },
        { Lattitude: { $gte: latitude - (radiusInMiles / 69) } },
        { Lattitude: { $lte: latitude + (radiusInMiles / 69) } },
      ]
    };

    db_connect.collection(pin_collection).find(query, { Img_Byte_String: 0 }).toArray(function(err, result) {
      if (err) throw err;
      
      // Post-processing: filter pins within a circle using the haversine formula
      const filteredResult = result.filter(pin => {
        const pinLatitude = pin.Lattitude;
        const pinLongitude = pin.Longitude;
        const distance = haversine(latitude, longitude, pinLatitude, pinLongitude);
        return distance <= radiusInKm;
      });

      let output = JSON.stringify(filteredResult);
      console.log("Getting Pins")
      console.log(output);
      res.send(output);
    });
  }
});
//and author

recordRoutes.route("/record").get(function(req, res) {
  let db_connect = dbo.getDb("pinDatabase");
  let query = {};
  if (req.query.minLongitude && req.query.maxLongitude && req.query.minLatitude && req.query.maxLatitude) {
    query = {
      Longitude: {
        $gte: Number(req.query.minLongitude),
        $lte: Number(req.query.maxLongitude)
      },
      Lattitude: {
        $gte: Number(req.query.minLatitude),
        $lte: Number(req.query.maxLatitude)
      }
    };
  }
  db_connect.collection("Pins").find(query, { Img_Byte_String: 0 }).toArray(function(err, result) {
    if (err) throw err;
    let output = JSON.stringify(result);
    console.log("Getting Pins")
    //console.log(output);
    res.send(output);
  });
});


recordRoutes.route("/crecord").get(function(req, res) {
  let db_connect = dbo.getDb("pinDatabase");
  db_connect.collection("Comments").find({}).toArray(function(err, result) {
    if (err) throw err;
    let output = JSON.stringify(result);
    //console.log(output);
    res.send(output);
  });
});

recordRoutes.route("/conrecord").get(function(req, res) {
  let db_connect = dbo.getDb("pinDatabase");
  db_connect.collection("Cpins").find({}).toArray(function(err, result) {
    if (err) throw err;
    let output = JSON.stringify(result);
    //console.log(output);
    res.send(output);
  });
});

recordRoutes.route("/updateComment").post(function(req, res) {
  let db_connect = dbo.getDb("pinDatabase");
  let { lat, lng, update_value } = req.body;
  let updateQuery = {};

  if (update_value > 0) {
    // increment likes
    updateQuery = { $inc: { Likes: 1 } };
  } else if (update_value < 0) {
    // increment dislikes
    updateQuery = { $inc: { Dislikes: 1 } };
  }

  db_connect.collection("Comments").findOneAndUpdate(
    { Lattitude: lat, Longitude: lng }, 
    updateQuery,
    { returnOriginal: false },
    function(err, result) {
      if (err) throw err;
      console.log(`Updated data in Comments collection`);
      res.send(`Successfully updated data in Comments collection`);
    }
  );
});

module.exports = recordRoutes;
