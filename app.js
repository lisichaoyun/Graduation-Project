var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var redis = require("redis");//请安装老版本的redis@3.1.2
var session = require("express-session");
var RedisStore = require("connect-redis")(session);
var client = redis.createClient(); //这里可以填写redis密码
var storet=new RedisStore({
  client: client,
  port: 6379, //端口号
  host: "127.0.0.1",
  ttl: 1 * 60 * 60 * 1000 //主机
})
app.use(
  session({
    secret: "xxxx",
    name: "xxxxID",
    cookie: {
      // domain: 'xxx.xxx.xxx.xxx:xxxx', // 域名
      path: "/",//这里secure属性限制https访问权限
      httpOnly: false, // 开启后前端无法通过 JS 操作
      maxAge: 1 * 60 * 60 * 1000, // 这一条 是控制 sessionID 的过期时间的！！！
    }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
    store: storet
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); //这里可以设置cookie加密字符串
app.use("/api/SendEmailCode", require("./api/get/SendEmailCode"));
app.use("/api/Selectcourse", require("./api/get/Selectcourse"));
app.use("/api/courseNum", require("./api/get/courseNum"));
app.use("/api/studentInfo", require("./api/get/studentInfo"));
app.use("/api/login", require("./api/post/login"));
app.use("/api/submitCourse", require("./api/get/submitCourse"));
app.use("/api/register", require("./api/post/register"));
module.exports = app;
