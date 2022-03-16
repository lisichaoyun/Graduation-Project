var express = require("express");
var sql = require("../../db");
var api = express.Router();
let RedisCacheSet = require("../../RedisCache").hmset; //存缓存函数返回promis
let RedisCacheGet = require("../../RedisCache").hgetall; //取缓存函数返回promiss
api.get("/", (req, res, next) => {
  if (req.session.username === undefined) {
    res.json({ err: 1, msg: "请先登录" });
    next();
  }
  let offet = parseInt(req.query.offet); //数据数间隔多少
  let number = parseInt(req.query.number); //数据查多少量
  async function select() {
    //数据量特别大的时候缓存才有明显效果
    let Num= await sql.query("SELECT count(*) FROM  selectcourse")//返回信息数量
    let selectedCourse = await sql.query("SELECT selectedCourse FROM userinfo");//每个用户都不一样
    let selectcourse = await RedisCacheGet(
      "selectcourse_" + number + "_" + offet
    );//查询缓存
    await new Promise((resovle, reject) => {
      if (selectcourse == null) {
        resovle();
      } else {
        reject(selectcourse);
      }
    }).catch(value => {
      res.json({
        err: 0,
        msg: JSON.parse(value.msg),
        state: "缓存提供的结果",
        userinfo: selectedCourse[0].selectedCourse.trim().split(' '),
        Num:value.Num
      });
      return new Promise(() => {}); //中断执行下面的await
    });

    //数据库查询并返回数据
    let result = await sql.query("SELECT * FROM selectcourse LIMIT ?,?", [
      offet,
      number,
    ]);
    //存至缓存
    await RedisCacheSet("selectcourse_" + number + "_" + offet, {
      msg: JSON.stringify(result),
      Num:Num[0]["count(*)"]
    }).then((value) => {//响应请求
      res.json({
        err: 0,
        msg: JSON.parse(value.msg),
        state: "数据库提供的结果",
        userinfo: selectedCourse[0].selectedCourse.trim().split(' '),
        Num:value.Num
      });
    });
  }

  select().finally(() => {
    next();
  });
});
module.exports = api;
