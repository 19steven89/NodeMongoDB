const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

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
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

//statics is an object similar to UserSchema.methods used above, but everything
//added onto statics is a model method, as oposed to instamce methods which UserSchema.methods uses

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  }catch(e){
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    //quotes are required when there is a dot in the value
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

UserSchema.statics.findByCredentials = function(email, password){
  var User = this;

  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res){
          resolve(user);
        }else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre("save", function (next) {
  var user = this;

  if(user.isModified("password")){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  }else{
    next();
  }

});

//method used to log a user out of their account, its used in server.js
UserSchema.methods.removeToken = function (token){
  var user = this;

  //$pull is a MongoDB Operator. return the token value when this function is called in server.js
  return user.update({
      $pull: {
        //pull the token passed in from the token parameter passed in
        tokens: {token}
      }
  });
}

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
