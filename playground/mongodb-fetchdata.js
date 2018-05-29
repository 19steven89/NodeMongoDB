//object destructuring. gets MongoClient name and ObjectId from mongoDb object
const {MongoClient, ObjectId} = require("mongodb");

//created MongoDB named TodoApp using port no: 27017
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if(err){
      return console.log("Unable to connect to the MongoDB server");
  }

  console.log("Connected to MongoDB server");

  //get all data from the Todos collection and convert to array data type
  // db.collection("Todos").find({_id: new ObjectId("5b087cc05bff2610a9c5922a")}).toArray().then((docs) => {
  //   console.log("Todos");
  //   //undefined param is the filter function, 2 is the spacing for the output
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log("Unable to fetch from collection: Todos", err);
  // });

  // db.collection("Todos").find().count().then((count) => {
  //   console.log(`Todos Count: ${count}`);
  // }, (err) => {
  //   console.log("Unable to fetch from collection: Todos", err);
  // });

  db.collection("users").find({name: "Steven"}).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log("Unable to fetch from collection: Todos", err);
  });



  //db.close();
});
