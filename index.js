require("dotenv").config();
const encBase64 = require("crypto-js/enc-base64");
const SHA256 = require("crypto-js/sha256");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const uid2 = require("uid2");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/leboncoin-api",
  {
    useNewUrlParser: true
  }
);

const User = mongoose.model("User", {
  pseudo: String,
  email: String,
  hash: String,
  salt: String,
  token: String
});

// Sign Up
app.post("/direct/sign_up", async (req, res) => {
  try {
    const pseudo = req.body.pseudo;
    const email = req.body.email;
    const password = req.body.password;
    const token = uid2(16);
    const salt = uid2(16);
    const saltedPassword = password + salt;
    const hash = SHA256(saltedPassword).toString(encBase64);

    const newUser = await new User({
      pseudo: pseudo,
      email: email,
      hash: hash,
      salt: salt,
      token: token
    });

    await newUser.save();

    res.json({
      token: token,
      id: newUser._id,
      pseudo: newUser.pseudo,
      email: newUser.email
    });
  } catch (error) {
    res.status(400).json({ message: "An error occurred" });
  }
});

// Log In
app.post("/direct/log_in", async (req, res) => {
  const pseudo = req.body.pseudo;
  const password = req.body.password;

  const userFound = await User.findOne({ pseudo: pseudo });
  if (userFound) {
    const hash = SHA256(password + userFound.salt).toString(encBase64);
    if (userFound.hash === hash) {
      return res.json({
        token: userFound.token,
        id: userFound._id,
        pseudo: userFound.pseudo
      });
    }
  } else {
    return res.status(400).json({ message: "Unauthorized" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
