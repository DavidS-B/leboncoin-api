var express = require("express");
var router = express.Router();
var uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

var isAuthenticated = require("../middlewares/isAuthenticated");

var User = require("../models/User.js");

router.post("/sign_up", function(req, res, next) {
  const token = uid2(64);
  const salt = uid2(64);
  const hash = SHA256(req.body.password + salt).toString(encBase64);

  const user = new User({
    email: req.body.email,
    token: token,
    salt: salt,
    hash: hash,
    account: {
      pseudo: req.body.pseudo,
      phone: req.body.phone
    }
  });
  console.log(user.account);
  user.save(function(err) {
    if (err) {
      return next(err.message);
    } else {
      return res.json({
        _id: user._id,
        token: user.token,
        account: user.account
      });
    }
  });
});

router.post("/log_in", function(req, res, next) {
  User.findOne({ email: req.body.email }).exec(function(err, user) {
    if (err) return next(err.message);
    if (user) {
      if (
        SHA256(req.body.password + user.salt).toString(encBase64) === user.hash
      ) {
        return res.json({
          _id: user._id,
          token: user.token,
          account: user.account
        });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      return next("User not found");
    }
  });
});

// L'authentification est obligatoire pour cette route
router.get("/:id", isAuthenticated, function(req, res, next) {
  User.findById(req.params.id)
    .select("account")
    // .populate("account.rooms")
    // .populate("account.favorites")
    .exec()
    .then(function(user) {
      if (!user) {
        res.status(404);
        return next("User not found");
      }

      return res.json({
        _id: user._id,
        account: user.account
      });
    })
    .catch(function(err) {
      res.status(400);
      return next(err.message);
    });
});

module.exports = router;
