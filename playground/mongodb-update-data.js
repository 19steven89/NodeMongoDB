//object destructuring. gets MongoClient name and ObjectId from mongoDb object
const {MongoClient, ObjectId} = require("mongodb");

//created MongoDB named TodoApp using port no: 27017
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if(err){
      return console.log("Unable to connect to the MongoDB server");
  }

  console.log("Connected to MongoDB server");

  //findOneAndUpdate
//   db.collection("Todos").findOneAndUpdate({
//     _id: new ObjectId("5b2820ca0424eea0ca6ace70")
//   }, {
//     $set: {
//       completed: true
//     }
//   }, {
//     returnOriginal: false
// }).then((result) => {
//   console.log(result);
// });
//   //db.close();
// });


db.collection("users").findOneAndUpdate({
  _id: new ObjectId("5b087f67a4647211e901ced1")
}, {
  $inc: {
    age: 1
  },
  $set: {
    name: "Steven"
  }
}, {
  returnOriginal: false
}).then((result) => {
console.log(result);
});
//db.close();
});
