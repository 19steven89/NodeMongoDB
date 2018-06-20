var express = require("express");
var bodyParser = require("body-parser");

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
