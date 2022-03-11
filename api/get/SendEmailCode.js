var express = require("express");
var mail = require("../mail");
var api = express.Router();
api.get("/", function (req, res, next) {
  //接收邮箱地址
  let email = req.query.email;
  //发送验证码
  let code = String(parseInt(Math.random() * 10000));
  mail
    .sendMail(email, code)
    .then(() => {
      res.json({
        err: 0,
        msg: "邮件发送成功请查看",
      });
    })
    .catch(err => {
      res.json({ err: 1, msg: err.message });
    })
    .finally(() => {
      next();
    });
});

module.exports = api;
