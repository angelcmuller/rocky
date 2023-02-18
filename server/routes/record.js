const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");

recordRoutes.route("/record").get(function(req, res) {
  let db_connect = dbo.getDb("pinDatabase");
  db_connect.collection("Pins").find({}).toArray(function(err, result) {
    if (err) throw err;
    let output = JSON.stringify(result);
    console.log(output);
    res.send(output);
  });
});

recordRoutes.route("/requestlog").post(function(req, res) {
  alert("HEY!")
  // let db_connect = dbo.getDb("pinDatabase");
  // let { stringVariable1, stringVariable2, floatVariable1, floatVariable2 } = req.body;
  // db_connect.collection("RequestLog").insertOne({
  //   User: stringVariable1,
  //   Reason: stringVariable2,
  //   Lat: floatVariable1,
  //   Lng: floatVariable2
  // }, function(err, result) {
  //   if (err) throw err;
  //   console.log(`Inserted data into RequestLog collection`);
  //   res.send(`Successfully inserted data into RequestLog collection`);
  // });
});

module.exports = recordRoutes;
