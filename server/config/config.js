//env proces.env.NODE_ENV set for poduction ans tests
var env = process.env.NODE_ENV || "development";

//console.log("env *** ", env);

if(env === "development"){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
}else if(env === "test"){
  process.env.PORT = 3000;
  //set environment for unit tests so that the data deleted will not delete the
  //actual todos data, just testing data
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
}
