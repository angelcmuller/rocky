const express = require('express');
const mongoose = require('express');
const { mongo } = require('mongoose');
const app = express(); 

var uri = "mongodb://tristanbailey:RockyRoadKey2022@ac-ap9bbel-shard-00-00.fpy1pqs.mongodb.net:27017,ac-ap9bbel-shard-00-01.fpy1pqs.mongodb.net:27017,ac-ap9bbel-shard-00-02.fpy1pqs.mongodb.net:27017/?ssl=true&replicaSet=atlas-zrbeo7-shard-0&authSource=admin&retryWrites=true&w=majority" 


var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var customDB = db.db("pinDatabase");
    customDB.collection("Pins").find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log("Longitude | Lattitude   | Classification");
        for (let i = 0, len = result.length; i < len; i++){
            console.log(result[i].Longitude + "  ,  " + result[i].Lattitude + "  ,  " + result[i].Classification);
        }
        db.close();
      });
  });


app.listen(8000, () => {
     console.log("Server started on port 8000");
});




