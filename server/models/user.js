var mongoose = require("mongoose");

var User = mongoose.model("User", {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
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
