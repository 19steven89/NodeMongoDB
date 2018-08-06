require("./config/config.js")

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");
const { mongoose } = require("./db/mongoose.js");
const { Todo } = require("./models/todo.js");
const { User } = require("./models/user.js");
const { authenticate } = require("./middleware/authenticate.js")
    //get function defined in the authenticate.js file

var app = express();
//use port available from heroku, else use port 3000
const port = process.env.PORT;


//middleware
app.use(bodyParser.json());

//3 args: the URL, the callback function and authenticate to make the todos private
app.post("/todos", authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        //creator keeps todos private to the user that created it
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });

    //console.log(req.body);
});

//GET /Todos.   :id creates id variable on request object.
//request and response params
app.get("/todos/:id", authenticate, (req, res) => {
    var id = req.params.id;

    //ObjectId references the var declared above = to require(mongodb)
    if (!ObjectId.isValid(id)) {
        console.log("ID not valid");
        //http 404: Not Found
        return res.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            console.log("ID not found");
            return res.status(404).send();
        }
        //send back the Todo from mongodb with the correponding ObjectId sent by the user
        // in the http request
        res.send({ todo });
    }, (e) => {
        //http 400: Bad Request
        return res.status(400).send();
    });
    //res.send(req.params);
});

//get request to get all of the todos
app.get("/todos", authenticate, (req, res) => {
    Todo.find({
        //the get request will only return todos for that user, not every todo in the system
        //this is done using the creator var below
        _creator: req.user._id
    }).then((todos) => {
        res.send({ todos })
    }, (e) => {
        res.status(400).send(e);
    });
});

app.delete("/todos/:id", authenticate, async(req, res) => {
    //get the id
    const id = req.params.id;

    //validate the ID
    if (!ObjectId.isValid(id)) {
        console.log("ID for deletion is not found");
        return res.status(404).send();
    }

    try {
        const todo = await Todo.findOneAndRemove({
            //user can delete a todo from their own todo list, but cant access any unaouthorized
            _creator: req.user._id,
            _id: id
        });
        if (!todo) {
            console.log("ID not found, cannot delete");
            return res.status(404).send();
        }
        //used ES6 syntax which is the equivalent to todo: todo
        res.send({ todo });
    } catch (e) {
        res.status(400).send();
    };
});

//used to update a todo text or completed field in the MongoDB collection
app.patch("/todos/:id", authenticate, (req, res) => {
    var id = req.params.id;
    //_.pick is a lodash method. text and completed are the properties
    //the user should be able to update
    var body = _.pick(req.body, ['text', 'completed']);

    //validate the ID
    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        //if its a boolean and completed
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    //$set is a mongodb operator. new is part of the mongoose npm
    Todo.findOneAndUpdate({ _creator: req.user._id, _id: id }, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            //if no todo send 404 status
            return res.status(404).send();
        }
        //if successful send back todo using ES6 syntax
        return res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    });

});

//POST /users
app.post("/users", async(req, res) => {
    try {
        var body = _.pick(req.body, ['email', 'password']);
        //Alternative shorter version for Object below: var user = new User(body);
        var user = new User({
            email: body.email,
            password: body.password
        });

        await user.save();
        const token = user.generateAuthToken();
        //Params: header name: "x-auth", value you want to set the header to: token
        res.header("x-auth", token).send(user);
    } catch (e) {
        res.status(400).send(e);
    };
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

//use the authenticate function defined for the route in the authenticate.js function
app.get("/users/me", authenticate, (req, res) => {
    res.send(req.user);
});

app.post("/users/login", async(req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        //call method from user.js for identifying existing users that are logging in again
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header("x-auth", token).send(user);
    } catch (e) {
        res.status(400).send();
    }
});

//Route used to log a user out of their account, by deleting the x-auth token for that user logged in
app.delete("/users/me/token", authenticate, async(req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        //if unsuccessful send 400 back
        res.status(400).send();
    };
});

app.listen(port, () => {
    console.log(`Started on Port ${port}`);
});
//ES6 object syntax
module.exports = { app };