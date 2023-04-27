const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");

recordRoutes.route("/record").get(function(req, res) {
  let db_connect = dbo.getDb("pinDatabase");
  db_connect.collection("Pins").find({}, { Img_Byte_String: 1 }).toArray(function(err, result) {
    if (err) throw err;
    result.forEach((record) => {
      console.log(record.Img_Byte_String);
    });
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