let express = require("express");
let api = express.Router();
let sql = require("../../db");
api.post("/", (req, res, next) => {
  let info = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
    class: req.body.class,
    realname: req.body.realname,
    studyCode: req.body.studyCode,
  };
  sql
    .query(
      "INSERT INTO userinfo(username,password,email,phone,class,realname,studyCode) VALUES(?,?,?,?,?,?,?)",
      [info.username,info.password,info.email,info.phone,info.class,info.realname,info.studyCode]
    )
    .then((result) => {
      req.session.username=req.body.username
      req.session.save()
      res.json({ err: 0, msg: "注册成功" });
    })
    .catch((e) => {
      res.json({ err: 1, msg: "账号或者邮箱已被占用" });
    })
    .finally(() => {
      next();
    });
});
module.exports=api
