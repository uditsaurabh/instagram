const jwt = require("jsonwebtoken");
const { jwt_sceret } = require("../keys");
const User = require("../models/user");

const requiredLogin = (req, res, next) => {
  const { authorization } = req.headers;
  console.log("auth", authorization);

  if (authorization) {
    const token = authorization.split(" ")[1];
    jwt.verify(token, jwt_sceret, (err, key) => {
      if (err) {
        res.status(401).send(err.message);
      } else {
        let { id } = key;
        User.findOne({ _id: id })
          .then(user => {
            console.log("user", user);
            req.user = user;
            next();
          })
          .catch(err => {
            res.status(401).send(err.message);
          });
      }
    });
  } else {
    res.status(401).send("Unauthorized asscess");
  }
};

module.exports = requiredLogin;
