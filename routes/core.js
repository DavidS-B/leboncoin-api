var express = require("express");
var router = express.Router();

router.get("/home", function(req, res, next) {
  return res.json([]);
});

module.exports = router;
