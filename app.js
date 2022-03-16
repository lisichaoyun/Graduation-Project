//引入基本模块
var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var logger = require("morgan");

//引入与使用session与redis关联模块
var client=require('./RedisCache').Client
var session = require("express-session");
var RedisStore = require("connect-redis")(session);

var appstore=new RedisStore({
  client: client,
  port: 6379, //端口号
  host: "127.0.0.1",
  ttl: 24 * 60 * 60 * 1000 //保存时间1天
})
app.use(
  session({
    secret: "xxxx",
    name: "xxxxID",
    cookie: {
      // domain: 'xxx.xxx.xxx.xxx:xxxx', // 域名
      path: "/",//这里secure属性限制https访问权限
      httpOnly: false, // 开启后前端无法通过 JS 操作
      maxAge: 24 * 60 * 60 * 1000, // 这一条 是控制 sessionID 的过期时间的！！！
    }, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
    store: appstore
  })
);

//基本模块的使用
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); //这里可以设置cookie加密字符串

//接口变量声明
var SendEmailCode=require("./api/get/SendEmailCode")//特殊功能接口
var Selectcourse=require("./api/get/Selectcourse")//查询接口
var studentInfo=require("./api/get/studentInfo")//查询接口
var login=require("./api/post/login")//查询接口
var submitCourse=require('./api/get/submitCourse')//更新数据接口
var register=require("./api/post/register")//更新数据接口

//引用接口
app.use("/api/SendEmailCode", SendEmailCode);//注册时发送验证码
app.use("/api/Selectcourse", Selectcourse);//返回可选课程
app.use("/api/studentInfo", studentInfo);//返回学生信息
app.use("/api/login", login);//登录接口
app.use("/api/submitCourse", submitCourse);//提交选择课程接口
app.use("/api/register", register);//注册接口
//暴露主模块
module.exports = app;
