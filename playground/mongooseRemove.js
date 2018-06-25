const {ObjectId} = require("mongodb");
const {mongoose} = require("./../server/db/mongoose.js");
const {Todo} = require("./../server/models/todo.js");
const {User} = require("./../server/models/user.js");


//removes all of the todos from the MongoDB collection
// Todo.remove({}).then((result) => {
//   console.log(result);
// });
//
// Todo.findOneAndRemove().then()

//works simililar to the findByIdAndRemove, but by using the query Object
// Todo.findByOneAndRemove(_id: "5b30cb69cfc679372e62adae").then(() => {
//
// });

Todo.findByIdAndRemove("5b30cb69cfc679372e62adae").then((todo) => {
  console.log(todo);
});
