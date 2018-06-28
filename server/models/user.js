const validator = require("validator");
const mongoose = require("mongoose");

var User = mongoose.model("User", {
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

module.exports = {User};


// var newUser = new User({
//   email: "stevenbarry8910@gmail.com"
// });

// newUser.save().then((doc) => {
//   console.log("Saved new User");
// }, (e) => {
//   console.log("Unable to save New User Data: ", doc);
// });
