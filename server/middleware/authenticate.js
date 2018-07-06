//get the user objext from the required file
var {User} = require("./../models/user.js");

//middleware function used for user authentication
var authenticate = (req, res, next) => {
  var token = req.header("x-auth");

  //call method from user.js
  User.findByToken(token).then((user) => {
    if(!user){
      //if 401 unauth found then return
      return Promise.reject();
    }

    //define the request.user to be equal to the user value defined above
    req.user = user;
    req.token = token;
    //need to call next otherwise the function below will never execute
    next();
  }).catch((e) => {
    //401 catches unauthorized access
    res.status(401).send();
  });
};

module.exports = {authenticate};
