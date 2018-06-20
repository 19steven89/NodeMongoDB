const expect = require("expect");
const request = require("supertest");

var {app} = require("./../server.js");
var {Todo} = require("./../models/todo.js")

//ensures that the DBis empty by removing everything from the Todos collection before
// each test is ran. this way the test below should pass by ensuring the
// length is now 1, using this line below: expect(todos.length).toBe(1);

beforeEach((done) => {
  Todo.remove({}).then(() => done());
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
      Todo.find().then((todos) => {
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
        expect(todos.length).toBe(0);
        done();
        //catch error and pass it in to done
      }).catch((e) => done(e));
    });
  });
});
