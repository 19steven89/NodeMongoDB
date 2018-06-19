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

app.listen(3000, () => {
  console.log("Started on Port 3000");
});
