const expect = require("expect");
const request = require("supertest");
const {ObjectId} = require("mongodb");
const _ = require("lodash");


const {app} = require("./../server.js");
const {Todo} = require("./../models/todo.js")
const {todos, populateTodos, users, populateUsers} = require("./seed/seed.js");
const {User} = require("./../models/user.js");

//ensures that the DBis empty by removing everything from the Todos collection before
// each test is ran. this way the test below should pass by ensuring the
// length is now 1, using this line below: expect(todos.length).toBe(1);

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
  it("should create a new todo", (done) => {
    var text = "Test todo text";

    request(app)
    .post("/todos")
    //set x-auth to the users token value. This makes sure the user is authorized to view their
    //appropriate todos
    .set("x-auth", users[0].tokens[0].token)
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
    .set("x-auth", users[0].tokens[0].token)
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
    .set("x-auth", users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      //should get one todo for this user ID as coded above
      expect(res.body.todos.length).toBe(1);
    }).end(done);
  });
});

describe("GET /todos/:id", () => {
  it("Should return todo doc", (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set("x-auth", users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      //expect the todo body text to be the text in the first index of the todos
      //array, from the doc in mongodb
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it("Should NOT return a todo doc created by another user", (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set("x-auth", users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it("Should return a 404 if todo not found", (done) => {
    var hexId = new ObjectId().toHexString();
    request(app)
    .get(`/todos/${hexId}`)
    .set("x-auth", users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it("Should return a 404 for non ObjectId's", (done) => {
    request(app)
    .get("/todos/123")
    .set("x-auth", users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });
});

describe("DELETE /todos:id", () => {
  it("Should remove a todo", (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .set("x-auth", users[1].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }

      Todo.findById(hexId).then((todo) => {
        expect(todo).toBeFalsy();
        done();
      }).catch((e) => done(e));
    });
  });

  it("Should NOT remove a todo from another users todos list", (done) => {
    var hexId = todos[0]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .set("x-auth", users[1].tokens[0].token)
    .expect(404)
    .end((err, res) => {
      if(err){
        return done(err);
      }

      Todo.findById(hexId).then((todo) => {
        expect(todo).toBeTruthy();
        done();
      }).catch((e) => done(e));
    });
  });

  it("Should return 404 if todo not found", (done) => {
    var hexId = new ObjectId().toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set("x-auth", users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it("Should return a 404 if the todo ID doesn't exist", (done) => {
    request(app)
    .delete("/todos/123")
    .set("x-auth", users[1].tokens[0].token)
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
    .set("x-auth", users[0].tokens[0].token)
    .send({
      completed: true,
      text: text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(true);
      expect(typeof res.body.todo.completedAt).toBe("number");
    })
    .end(done);
  });

  it("should NOT update the todo created by another user", (done) => {
    var text = "Test todo Update text";
    var hexId = todos[0]._id.toHexString();

    request(app)
    .patch(`/todos/${hexId}`)
    .set("x-auth", users[1].tokens[0].token)
    .send({
      completed: true,
      text: text
    })
    .expect(404)
    .end(done);
  });

  it("should clear completedAt when todo is not completed", (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = "Test todo Update text of 2nd todo item";

    request(app)
    .patch(`/todos/${hexId}`)
    .set("x-auth", users[1].tokens[0].token)
    .send({
      text: text,
      completed: false
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false)
      expect(res.body.todo.completedAt).toBeFalsy();
    })
    .end(done);
  });
});

describe("GET /users/me", () => {
  it("should return a user if authenticated", (done) => {
    request(app)
    .get("/users/me")
    .set("x-auth", users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      //expected value from the result.body should be equal to the users array
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    }).end(done);
  });

  it("should return a 401 if not authenticated", (done) => {
    request(app)
    .get("/users/me")
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe("POST /users", () => {
  it("Should create a user", (done) => {
    var email = "example@example.com";
    var pword = "1234abcd";

    request(app)
    .post("/users")
    .send({email, pword})
    .expect(200)
    .expect((res) => {
      expect(res.headers["x-auth"]).toBeTruthy()
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email);
    })
    .end((err) => {
      if(err){
        return done(err);
      }
      User.findOne({email}).then((user) => {
        expect(user).toBeTruthy();
        //should not be pword above as the user.password should be a hashed value
        expect(user.password).not.toBe(pword);
        done();
      }).catch((e) => done(e));
    });
  });

  it("Should return  validation error if request invalid", (done) => {
    request(app)
    .post("/users")
    .send({
      email: "ste",
      pword: "123"
    })
    .expect(400)
    .end(done);
  });

  it("It should not create a user if the email is alreafy in use", (done) => {
    var email = "steven@example.com";
    var pword = "def123";

    request(app)
    .post("/users")
    .send({email, pword})
    //made email invalid as its already in the DB in the seed.js file so 400 expected
    .expect(400)
    .end(done);
  });
});

describe("/users/login", () => {
  it("should login user and return auth token", (done) => {
      request(app)
      .post("/users/login")
      .send({
        //set email and pword equal to the users array index 1 in the seed.js file
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers["x-auth"]).toBeTruthy();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.toObject().tokens[1]).toMatchObject({
            access: "auth",
            token: res.headers["x-auth"]
          });
          done();
        }).catch((e) => done(e));

      });
  });

  it("should reject invalid password login", (done) => {
    request(app)
    .post("/users/login")
    .send({
      //set email and pword equal to the users array index 1 in the seed.js file
      email: users[1].email,
      password: "561"
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers["x-auth"]).toBeFalsy();
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe("DELETE /users/me/token", () => {
  it("should remove auth token when user logs out", (done) => {
    request(app)
    .delete("/users/me/token")
    //set x-auth equal to token
    .set("x-auth", users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if(err){
        return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        //verify that the tokens array has a length of 0, as it should have been deleted using
        //the http request to log the user out
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((e) => done(e));
    });
  });
});
