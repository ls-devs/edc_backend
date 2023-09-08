import * as bcrypt from "bcrypt";

const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";

let myhash: string = "";
bcrypt.genSalt(saltRounds, function (err, salt) {
  bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
    myhash = hash;
    console.log(myhash);
  });
});

bcrypt.compare(myPlaintextPassword, myhash, function (err, result) {
  // result == true
  console.log(result);
});
