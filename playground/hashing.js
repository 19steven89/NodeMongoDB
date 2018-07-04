const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");

var data = {
  id: 10
};
            //method takes object and the secret i.e. the salt added to the pword hashing
var token = jwt.sign(data, "123abc");
console.log(token);

var decoded = jwt.verify(token, "123abc");
console.log("Decoded: ", decoded);


// var message = "I am user #3";
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data: data,
//   hash: SHA256(JSON.stringify(data) + "SomeSecret").toString()
// };
//
// var resultHash = SHA256(JSON.stringify(token.data) + "SomeSecret").toString();
//
// token.hash.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// if(resultHash === token.hash){
//   console.log("Data was not changed");
// }else{
//   console.log("data was changed, don't trust");
// }
