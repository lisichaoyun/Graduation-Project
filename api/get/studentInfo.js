var express = require("express");
var sql = require("../../db");
var api = express.Router();
api.get("/", (req, res, next) => {
  if (req.session.username===undefined) {
    res.json({err:1,msg:'请先登录'})
    next();
  }
  sql
    .query(
      "SELECT realname,phone,class,studyCode,selectedCourse FROM userinfo where username=?",
      [req.session.username]
    )
    .then(result => {
      res.json({ err: 0, msg: result });
    })
    .catch(error => {
      res.json({ err: 1, msg: error });
    })
    .finally(() => {
      next();
    });
});
module.exports = api;
