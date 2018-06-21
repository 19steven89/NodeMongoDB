var express = require("express");
var bodyParser = require("body-parser");
var {ObjectId} = require("mongodb");
var {mongoose} = require("./db/mongoose.js");
var {Todo} = require("./models/todo.js");
var {User} = require("./models/user.js");

var app = express();

//middleware
app.use(bodyParser.json());

//2 args: the URL and the callback function
app.post("/todos", (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });

  //console.log(req.body);
});

//GET /Todos.   :id creates id variable on request object.
//request and response params
app.get("/todos/:id", (req, res) => {
  var id = req.params.id;

  //ObjectId references the var declared above = to require(mongodb)
  if(!ObjectId.isValid(id)){
    console.log("ID not valid");
    //http 404: Not Found
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo){
      console.log("ID not found");
      return res.status(404).send();
    }
    //send back the Todo from mongodb with the correponding ObjectId sent by the user
    // in the http request
    res.send({todo});
  }, (e) => {
    //http 400: Bad Request
    return res.status(400).send();
  });
  //res.send(req.params);
});


//get request to get all of the todos
app.get("/todos", (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log("Started on Port 3000");
});
                  //ES6 object syntax
module.exports = {app};
