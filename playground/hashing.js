const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var password = "123abc!";

//10 is the No.of rounds. which prevents a large number of pwords being
//generated by a hacker
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashedPassword = "$2a$10$LjHkzE7A8sU9iqyOQcWiYujJ0Pjy15EzrT/H.yM8zkTc6OStmIGba";

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});

//
// var data = {
//   id: 10
// };
//             //method takes object and the secret i.e. the salt added to the pword hashing
// var token = jwt.sign(data, "123abc");
// console.log(token);
//
// var decoded = jwt.verify(token, "123abc");
// console.log("Decoded: ", decoded);


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
