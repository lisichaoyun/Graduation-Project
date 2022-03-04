var express = require("express");
var sql = require("../../db");
var api = express.Router();

api.get("/", (req, res, next) => {
  sql
    .query("SELECT * FROM selectcourse LIMIT ?,?", [
      parseInt(req.query.offet),
      parseInt(req.query.number),
    ])
    .then((result) => {
      res.json({ err: 0, msg: result });
    })
    .catch((error) => {
      res.json({ err: 1, meg: error });
    })
    .finally(() => {
      next();
    });
});
module.exports = api;