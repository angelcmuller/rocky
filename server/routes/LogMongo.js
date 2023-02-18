const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");

recordRoutes.route("/request").post(function(req, res) {
  let db_connect = dbo.getDb("pinDatabase");
  let { stringVariable1, stringVariable2, floatVariable1, floatVariable2 } = req.body;
  db_connect.collection("RequestLog").insertOne({
    User: stringVariable1,
    Reason: stringVariable2,
    Lat: floatVariable1,
    Lng: floatVariable2
  }, function(err, result) {
    if (err) throw err;
    console.log(`Inserted data into RequestLog collection`);
    res.send(`Successfully inserted data into RequestLog collection`);
  });
});

module.exports = recordRoutes;
