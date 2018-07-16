//env proces.env.NODE_ENV set for poduction ans tests
var env = process.env.NODE_ENV || "development";

if(env === "development" || env === "test"){
  var config = require("./config.json");
  //access the environment fromn the config var declared above
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });

}
