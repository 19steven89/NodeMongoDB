const MongoClient = require("mongodb").MongoClient;

//created MongoDB named TodoApp using port no: 27017
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if(err){
      return console.log("Unable to connect to the MongoDB server");
  }

  console.log("Connected to MongoDB server");

  //inserts a document, into the collection named Todos
  // db.collection("Todos").insertOne({
  //   text: "Something to do",
  //   completed: false
  // }, (err, result) => {
  //   if(err){
  //     return console.log("Unable to insert todo");
  //   }
  //
  //   //ops attribute stores all of the docs that were inserted
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  //
  // });

  db.collection("users").insertOne({
    name: "Steven",
    age: 29,
    location: "Glasgow"
  }, (err, result) => {
    if(err){
      return console.log("Unable to insert into Users");
    }

    //ops attribute stores all of the docs that were inserted
    console.log(JSON.stringify(result.ops, undefined, 2));

  });


  db.close();
});
