const {ObjectId} = require("mongodb");
const {mongoose} = require("./../server/db/mongoose.js");
const {Todo} = require("./../server/models/todo.js");
const {User} = require("./../server/models/user.js");


var userId = "5b28f7951999412d1f6f217f";

User.findById('5b28f7951999412d1f6f217f').then((user) => {
  if(!user){
    return console.log("User ID not found");
  }
  console.log("User", user);
}, (e) => console.log(e));


// var id = "5b2ad8d5f1f1dad921d90de6";
//
// if(!ObjectId.isValid(id)){
//   console.log("ID not valid");
// }
//
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log("Todos", todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log("Todo", todo);
// });
//
// Todo.findById(id).then((todo) => {
//   //if todo doesnt exist, print not found!
//   if(!todo){
//     return console.log("ID not found");
//   }
//   console.log("Todo", todo);
// }).catch(e) => console.log(e);
