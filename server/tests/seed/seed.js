const {ObjectId} = require("mongodb");
const {Todo} = require("./../../models/todo.js");
const {User} = require("./../../models/user.js")
const jwt = require("jsonwebtoken");

const user1Id = new ObjectId();
const user2Id = new ObjectId();

const users = [{
  _id: user1Id,
  email: "steven@example.com",
  password: "1pass",
  tokens: [{
    access: "auth",
    token: jwt.sign({_id: user1Id, access: "auth"}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: user2Id,
  email: "steven@ex2.com",
  password: "2pass",
  tokens: [{
    access: "auth",
    //process.env.JWT_SECRET is random secret coded in the config.json file
    token: jwt.sign({_id: user2Id, access: "auth"}, process.env.JWT_SECRET).toString()
  }]
}]

const todos = [{
  _id: new ObjectId(),
  text: "First test todo",
  //creator var used to associate todo with user, so that only the creator of the todo
  //can view their own todos
  _creator: user1Id
}, {
  _id: new ObjectId(),
  text: "Second test todo",
  completed: true,
  completedAt: 333,
  _creator: user2Id
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    //insert the todos array defined above to add the data to the MongoDB collection
    return Todo.insertMany(todos)
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
    }).then(() => done());
};


module.exports = {todos, populateTodos, users, populateUsers};
