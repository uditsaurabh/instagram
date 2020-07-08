const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const bcrypt = require("bcrypt");
const { jwt_sceret } = require("../keys");
const jwt = require("jsonwebtoken");
const jwtAuthMiddleware = require("../middleware/requiredLoginMiddleware");

router.post("/addPost", jwtAuthMiddleware, (req, res) => {
  console.log("add Post hit");
  let { title, body } = req.body;
  if (!title || !body) {
    return res.status(422).json({ err: "Please fill all the details" });
  } else {
    req.user.password = null;
    let post = new Post({ title, body, postedBy: req.user });

    post.save().then(newPost => {
      console.log(newPost);
      return res.json({ success: "data correctly stored" });
    });
  }
});
router.get("/getAllPost", (req, res) => {
  Post.find()
    .populate("postedBy", ["_id", "name"])
    .then(posts => {
      return res.send(posts);
    });
});
router.get("/myPost", jwtAuthMiddleware, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", ["_id", "name"])
    .then(posts => {
      return res.send(posts);
    });
});
router.delete("/removePost", (req, res) => {
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
