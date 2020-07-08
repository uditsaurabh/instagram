const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { jwt_sceret } = require("../keys");
const jwt = require("jsonwebtoken");
const jwtAuthMiddleware = require("../middleware/requiredLoginMiddleware");
router.get("/", (req, res) => {
  res.send("hey how are you");
});

router.post("/signup", (req, res) => {
  let { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ err: "Please fill all the details" });
  } else {
    User.findOne({ email })
      .then(user => {
        if (user) {
          return res.status(422).json({ err: "user already exists" });
        } else {
          bcrypt.hash(password, 12).then(hashpassword => {
            let user = new User({ name, email, password: hashpassword });
            user.save().then(user => {
              return res.json({ success: "data correctly stored" });
            });
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
});
router.post("/signin", (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ err: "Please fill all the details" });
  } else {
    User.findOne({ email })
      .then(user => {
        if (user) {
          bcrypt.compare(password, user.password).then(result => {
            console.log("result will be", result);
            console.log(user);
            if (result) {
              // return res
              //   .status(200)
              //   .json({ message: "User Successfully signed in" });
              let token = jwt.sign({ id: user._id }, jwt_sceret);
              res.send({ token });
            } else {
              return res
                .status(401)
                .json({ err: "User not sucessfully signed in" });
            }
          });
        } else {
          return res.status(401).json({ err: "User does not exists" });
        }
      })
      .catch(err => {
        console.log("error from find one", err);
      });
  }
});

router.get("/protected", jwtAuthMiddleware, (req, res) => {
  console.log("req user", req.user);
  return res.send(req.user);
});

module.exports = router;
