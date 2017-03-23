"use strict";

const {MongoClient} = require("mongodb");
const MongoDB_URI = "mongodb://localhost:27017/tweeter";

MongoClient.connect(MongoDB_URI , (err, db) => {
  if (err){
    console.error(`Failed to connect ${MongoDB_URI}`);
    throw err;
  }
  console.log(`Connected to mongodb ${MongoDB_URI}`);

  function getTweets(callback){
    db.collection("tweets").find().toArray(callback);
  }

  getTweets((err,tweets) => {
      if (err) throw err;

      for(let tweet of tweets)
        console.log(tweet);
    });
  db.close();
});
