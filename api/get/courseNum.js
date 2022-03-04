var express = require("express");
var sql = require("../../db");
var api = express.Router();
api.get("/", (req, res, next) => {
  sql
    .query("SELECT count(*) FROM  selectcourse")
    .then(result => {
        res.json({err:0,msg:result[0]["count(*)"]})
    })
    .catch(error => {
        res.json({err:1,msg:error})
    })
    .finally(() => {
      next();
    });
});
module.exports=api
