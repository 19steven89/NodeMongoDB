const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    //verify that the email is unique within MongoDB
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{value} is not a valid email"
    }
  },
  password: {
    type: String,
    minlength: 1,
    require: true
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  //send back the id and email from the users http request, so that not every
  //part of the data is sent back like passwords etc.
  return _.pick(userObject, ["_id", "email"])
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = "auth";
  //2 params, 1st is the objet with the data we want to sign, 2nd param is the
  //secret value
  var token = jwt.sign({_id: user._id.toHexString(), access}, "abc123").toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};

var User = mongoose.model("User", UserSchema);

module.exports = {User};


// var newUser = new User({
//   email: "stevenbarry8910@gmail.com"
// });

// newUser.save().then((doc) => {
//   console.log("Saved new User");
// }, (e) => {
//   console.log("Unable to save New User Data: ", doc);
// });
