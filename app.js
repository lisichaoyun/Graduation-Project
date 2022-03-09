//引入基本模块
var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var logger = require("morgan");

//引入与使用session与redis关联模块
var redis = require("redis");//请安装老版本的redis@3.1.2
var session = require("express-session");
var RedisStore = require("connect-redis")(session);
var client = redis.createClient(); //这里可以填写redis密码
var appstore=new RedisStore({
  client: client,
  port: 6379, //端口号
  host: "127.0.0.1",
  ttl: 60 * 60 * 60 * 1000 //主机
})
app.use(
  session({
    secret: "xxxx",
    name: "xxxxID",
    cookie: {
      // domain: 'xxx.xxx.xxx.xxx:xxxx', // 域名
      path: "/",//这里secure属性限制https访问权限
      httpOnly: false, // 开启后前端无法通过 JS 操作
      maxAge: 60 * 60 * 60 * 1000, // 这一条 是控制 sessionID 的过期时间的！！！
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
var SendEmailCode=require("./api/get/SendEmailCode")
var Selectcourse=require("./api/get/Selectcourse")
var courseNum=require("./api/get/courseNum")
var studentInfo=require("./api/get/studentInfo")
var login=require("./api/post/login")
var submitCourse=require('./api/get/submitCourse')
var register=require("./api/post/register")

//引用接口
app.use("/api/SendEmailCode", SendEmailCode);//注册时发送验证码
app.use("/api/Selectcourse", Selectcourse);//返回可选课程
app.use("/api/courseNum", courseNum);//返回课程数目
app.use("/api/studentInfo", studentInfo);//返回学生信息
app.use("/api/login", login);//登录接口
app.use("/api/submitCourse", submitCourse);//提交选择课程接口
app.use("/api/register", register);//注册接口
//暴露主模块
module.exports = app;
