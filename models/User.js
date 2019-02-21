var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  token: String, // Le token permettra d'authentifier l'utilisateur
  hash: String,
  salt: String,

  account: {
    pseudo: { type: String, unique: true, required: true },
    phone: { type: String }
  }
});

module.exports = mongoose.model("User", UserSchema, "users");
