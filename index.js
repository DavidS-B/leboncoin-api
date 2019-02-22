require("dotenv").config();
var mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGODB_URI,
  { useCreateIndex: true, useNewUrlParser: true },
  function(err) {
    if (err) console.error("Could not connect to mongodb.");
  }
);
var express = require("express");
var app = express();
var helmet = require("helmet");
app.use(helmet());
var compression = require("compression");
app.use(compression());
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
var User = require("./models/User");

app.get("/", function(req, res) {
  res.send("Welcome to the my API.");
});

var cors = require("cors");
app.use("/api", cors());

var coreRoutes = require("./routes/core.js");
var userRoutes = require("./routes/user.js");
var offerRoutes = require("./routes/offer.js");

app.use("/api", coreRoutes);
app.use("/api/user", userRoutes);
app.use("/api/offer", offerRoutes);

app.all("*", function(req, res) {
  res.status(404).json({ error: "Not Found" });
});

app.use(function(err, req, res, next) {
  if (res.statusCode === 200) res.status(400);
  console.error(err);
  res.json({ error: err });
});

app.listen(process.env.PORT, function() {
  console.log(`leboncoin API running on port ${process.env.PORT}`);
  console.log(`Current environment is ${process.env.NODE_ENV}`);
});
