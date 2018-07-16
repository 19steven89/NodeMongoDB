var mongoose = require("mongoose");

var Todo = mongoose.model("Todo", {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  //the underscore is used to show it is an ObjectID
  //store the ID of the user in MongoDB to the type field listed below
  _creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
});


module.exports = {Todo};

// var newTodo = new Todo({
//   text: "    Edit video    "
// });
//
// newTodo.save().then((doc) => {
//   console.log("Saved Todo: ",  doc);
// }, (e) => {
//   console.log("Unable to save Todo");
// });

// var newTodo2 = new Todo({
//   text: "Go to the gym",
//   completed: true,
//   completedAt: 19/6/18
// });
//
// newTodo2.save().then((doc) => {
//   console.log("Saved Todo #2: ", doc);
// }, (e) => {
//   console.log("Unable to save Todo#2");
// });
