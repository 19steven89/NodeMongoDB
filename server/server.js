require("./config/config.js")

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const {ObjectId} = require("mongodb");
const {mongoose} = require("./db/mongoose.js");
const {Todo} = require("./models/todo.js");
const {User} = require("./models/user.js");

var app = express();
//use port available from heroku, else use port 3000
const port = process.env.PORT;


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

app.delete("/todos/:id", (req, res) => {
  //get the id
  var id = req.params.id;

  //validate the ID
  if(!ObjectId.isValid(id)){
    console.log("ID for deletion is not found");
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      console.log("ID not found, cannot delete");
      return res.status(404).send();
    }

    //used ES6 syntax which is the equivalent to todo: todo
    //i.e. the todo is equal to the todo to be deleted
    res.send({todo});

  }, (e) => {
    return res.status(400).send();
  });
});

//used to update a todo text or completed field in the MongoDB collection
app.patch("/todos/:id", (req, res) => {
  var id = req.params.id;
  //_.pick is a lodash method. text and completed are the properties
  //the user should be able to update
  var body = _.pick(req.body, ['text', 'completed']);

  //validate the ID
  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    //if its a boolean and completed
    body.completedAt = new Date().getTime();
  } else{
    body.completed = false;
    body.completedAt = null;
  }

  //$set is a mongodb operator. new is part of the mongoose npm
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      //if no todo send 404 status
      return  res.status(404).send();
    }
      //if successful send back todo using ES6 syntax
      return res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });

});

//POST /users
app.post("/users", (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  //var user = new User(body);

  var user = new User({
    email: body.email,
    password: body.password
  });

  user.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(port, () => {
  console.log(`Started on Port ${port}`);
});
                  //ES6 object syntax
module.exports = {app};
