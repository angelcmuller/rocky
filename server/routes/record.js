const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");

recordRoutes.route("/record").get(function(req, res) {
  let db_connect = dbo.getDb("pinDatabase");
  let query = {};
  if (req.query.minLongitude && req.query.maxLongitude && req.query.minLatitude && req.query.maxLatitude) {
    query = {
      longitude: {
        $gte: Number(req.query.minLongitude),
        $lte: Number(req.query.maxLongitude)
      },
      latitude: {
        $gte: Number(req.query.minLatitude),
        $lte: Number(req.query.maxLatitude)
      }
    };
  }
  db_connect.collection("Pins").find(query, { Img_Byte_String: 0 }).toArray(function(err, result) {
    if (err) throw err;
    let output = JSON.stringify(result);
    console.log("Getting Pins")
    console.log(output);
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

recordRoutes.route("/imageForPins").post(function(req, res) {
  let db_connect = dbo.getDb("pinDatabase");
  let { id } = req.body;

  const { ObjectId } = require('mongodb');
  const idString = '6447537b76e733d35af16d4b';
  const objectId = new ObjectId(idString);

  db_connect.collection("Images").findOne({'_id': objectId}, function(err, result) {
    if (err) throw err;
    if (!result) {
      res.status(404).send('Image not found using id ' + objectId);
    } else {
      let output = result.data;
      console.log('id:', objectId, ' _id:', result._id);
      res.send(output);
    }
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