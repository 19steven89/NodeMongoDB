const expect = require("expect");
const request = require("supertest");
const {ObjectId} = require("mongodb");
const _ = require("lodash");

var {app} = require("./../server.js");
var {Todo} = require("./../models/todo.js")


const todos = [{
  _id: new ObjectId(),
  text: "First test todo",
}, {
  _id: new ObjectId(),
  text: "Second test todo",
  completed: true,
  completedAt: 333
}];


//ensures that the DBis empty by removing everything from the Todos collection before
// each test is ran. this way the test below should pass by ensuring the
// length is now 1, using this line below: expect(todos.length).toBe(1);

beforeEach((done) => {
  Todo.remove({}).then(() => {
    //insert the todos array defined above to add the data to the MongoDB collection
    return Todo.insertMany(todos)
  }).then(() => done());
});

describe("POST /todos", () => {
  it("should create a new todo", (done) => {
    var text = "Test todo text";

    request(app)
    .post("/todos")
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }
      //find the todo where the text is equal to the text variable defined above
      //i.e. var text = "Test todo text";

      Todo.find({text}).then((todos) => {
        //toBe(1) as 1 todo item should be added to the DB
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });
  });

  it("should not create todo with invalid body data", (done) => {
    request(app)
    .post("/todos")
    //send data with empty text to DB to ensure that it does not get sent empty
    .send({})
    //expect error code 400 as data will not be added
    .expect(400)
    .end((err, res) => {
      if(err){
        return done(err);
      }
      Todo.find().then((todos) => {
        //toBe(0) as the data should not be added with empty text field, as above in
        expect(todos.length).toBe(2);
        done();
        //catch error and pass it in to done
      }).catch((e) => done(e));
    });
  });
});

describe("GET /todos", () => {
  it("Should get all todos", (done) => {
    //request data from the express application
    request(app)
    .get("/todos")
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    }).end(done);
  });
});

describe("GET /todos/:id", () => {
  it("Should return todo doc", (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      //expect the todo body text to be the text in the first index of the todos
      //array, from the doc in mongodb
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it("Should return a 404 if todo not found", (done) => {
    var hexId = new ObjectId().toHexString();
    request(app)
    .get(`/todos/${hexId}`)
    .expect(404)
    .end(done);
  });

  it("Should return a 404 for non ObjectId's", (done) => {
    request(app)
    .get("/todos/123")
    .expect(404)
    .end(done);
  });
});

describe("DELETE /todos:id", () => {
  it("Should remove a todo", (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }

      Todo.findById(hexId).then((todo) => {
        expect(todo).toNotExist();
        done();
      }).catch((e) => done(e));
    });
  });

  it("Should return 404 if todo not found", (done) => {
    var hexId = new ObjectId().toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
    .end(done);
  });

  it("Should return a 404 if the todo ID doesn't exist", (done) => {
    request(app)
    .delete("/todos/123")
    .expect(404)
    .end(done);
  });
});

describe("PATCH /todos/:id", () => {
  it("should update the todo", (done) => {
    var text = "Test todo Update text";
    var hexId = todos[0]._id.toHexString();

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed: true,
      text: text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA("number");
    })
    .end(done);
  });

  it("should clear completedAt when todo is not completed", (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = "Test todo Update text of 2nd todo item";

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      text: text,
      completed: false
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false)
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done);
  });
});
