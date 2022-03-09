var express = require("express");
var api = express.Router();
var sql = require("../../db");
api.get("/", (req, res, next) => {
  if (req.session.username === undefined) {
    res.json({ err: 1, msg: "请先登录" });
    next();
  }
  let username = req.session.username;
  let course = req.query.course;
  /*关于promiss嵌套问题
      使用多个then下一个then返回的是上一个then返回的promiss值（箭头函数指向promiss）
      也可以使用await逐步执行promiss
    */
  sql
    .query("SELECT selectedCourse FROM userinfo WHERE username = ?", [username])
    .then((result) => {//查询原来加入内容
      let resultArr = result[0].selectedCourse.split(" ");
      resultArr.push(course);
      return sql.query(
        "UPDATE userinfo SET selectedCourse = ? WHERE username = ?",
        [resultArr.join(" ").trim(), username]
      );
    })
    .then((result) => {
      //返回结果
      res.json({ err: 0, msg: result });
    })
    .catch((e) => {
      res.json({ err: 1, msg: e });
    })
    .finally(() => {
      next();
    });
});

module.exports = api;
