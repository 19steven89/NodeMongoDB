//object destructuring. gets MongoClient name and ObjectId from mongoDb object
const {MongoClient, ObjectId} = require("mongodb");

//created MongoDB named TodoApp using port no: 27017
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if(err){
      return console.log("Unable to connect to the MongoDB server");
  }

  console.log("Connected to MongoDB server");

  //deleteMany
  // db.collection("Todos").deleteMany({text: "eat lunch"}).then((result) => {
  //   console.log(result);
  // });

  //deleteOne
  // db.collection("Todos").deleteOne({text: "eat lunch"}).then((result) => {
  //   console.log(result);
  // });

  //findOneAndDelete
  // db.collection("Todos").findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });

  // db.collection("users").deleteMany({name: "Steven"}).then((result) => {
  //   console.log(result);
  // });

  db.collection("users").findOneAndDelete({_id: ObjectId("5b0dadeaac25dc0d6ccb130a")}).then((result) => {
    console.log(result);
  });



  //db.close();
});
