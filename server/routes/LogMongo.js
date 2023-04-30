const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");

//Gabriel Mortensen
//This function takes inputs from Log.js and pushes them to the mongoDB database 
//ChatGPT was used to figure out the requestState functionality regrading switching collections
recordRoutes.route("/request").post(function(req, res) {
  let db_connect = dbo.getDb("pinDatabase");
  let { requestState, stringVariable1, stringVariable2, floatVariable1, floatVariable2, opt, cond} = req.body;

  if (requestState === false){
    db_connect.collection("Comments").insertOne({
      Source: stringVariable1,
      Comment: stringVariable2,
      Lattitude: floatVariable1,
      Longitude: floatVariable2,
      Classification: opt, 
      Option: cond,
      Likes: 0,
      Dislikes: 0
    }, function(err, result) {
      if (err) throw err;
      console.log(`Inserted data into Comments collection`);
      res.send(`Successfully inserted data into Comments collection`);
    });
  }
  else {
    db_connect.collection("RequestLog").insertOne({
      User: stringVariable1,
      Reason: stringVariable2,
      Lattitude: floatVariable1,
      Longitude: floatVariable2
    }, function(err, result) {
      if (err) throw err;
      console.log(`Inserted data into RequestLog collection`);
      res.send(`Successfully inserted data into RequestLog collection`);
    });
  } 
});



module.exports = recordRoutes;
