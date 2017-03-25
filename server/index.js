"use strict";

require('dotenv').config();

// Basic express setup:

const PORT          = process.env.PORT || 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// The in-memory database of tweets. It's a basic object with an array in it.
//const Mongo_URI = "mongodb://localhost:27017/tweeter";
const MONGODB_URI = process.env.MONGODB_URI;
const {MongoClient} = require("mongodb");
//console.log(MONGODB_URI);
//const db = require("./lib/in-memory-db");

// The `data-helpers` module provides an interface to the database of tweets.
// This simple interface layer has a big benefit: we could switch out the
// actual database it uses and see little to no changes elsewhere in the code
// (hint hint).
//
// Because it exports a function that expects the `db` as a parameter, we can
// require it and pass the `db` parameter immediately:


MongoClient.connect(MONGODB_URI, (err,db) => {
  if (err){
    console.error(`Connection failed to DB : ${MONGODB_URI}`);
    throw err;
  }
  console.log(`Connection successful at  ${MONGODB_URI}`);
  const DataHelpers = require("./lib/data-helpers.js")(db);

// The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
// so it can define routes that use it to interact with the data layer.
const tweetsRoutes = require("./routes/tweets")(DataHelpers);

// Mount the tweets routes at the "/tweets" path prefix:
app.use("/tweets", tweetsRoutes);

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
});


