var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp");

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
  }
});

var User = mongoose.model("User", {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
})

// var newUser = new User({
//   email: "stevenbarry8910@gmail.com"
// });

// newUser.save().then((doc) => {
//   console.log("Saved new User");
// }, (e) => {
//   console.log("Unable to save New User Data: ", doc);
// });

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
