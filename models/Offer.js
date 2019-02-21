var mongoose = require("mongoose");

// Valider champs pour création Titre required 1, 50 Description max 500 price
// positif

var OfferSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 1,
    maxlength: 50,
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  price: {
    type: Number,
    min: 0,
    maxlength: 100000
  },
  pictures: Array,
  created: {
    type: Date,
    default: Date.now
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Offer", OfferSchema);
