const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
app.use(require("./routes/LogMongo"));
// get driver connection
const dbo = require("./db/conn");
 
// This method was implemented by Gabriel and uses a modified version from the MongoDB Mern tutorial (https://www.mongodb.com/languages/mern-stack-tutorial)

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});