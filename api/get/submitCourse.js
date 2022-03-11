var express = require("express");
var api = express.Router();
var sql = require("../../db");
api.get("/", (req, res, next) => {
  //验证登录状态
  if (req.session.username === undefined) {
    res.json({ err: 1, msg: "请先登录" });
    next()
  }
  //初始化所需数据
  let username = req.session.username;
  let course = req.query.course;
  let SELECTlimited=3//限制选多少门课
  async function insert() {
    //验证数据库里是否存在前端提交的课程
    let result = await sql
      .query("SELECT count(*) FROM  selectcourse WHERE course = ?", [course])
    await new Promise((resovle,reject) => {
      if (result[0]["count(*)"] == 0) {
        reject(new Error("没有选课数据，恶意篡改前端数据"))
      }
      resovle()
    })
    let selectedNumResult=await sql.query('SELECT selectedCourse FROM userinfo WHERE username=?',[username])
    let courseArr=String(selectedNumResult[0].selectedCourse).trim().split(' ')
    //验证是否重复提交课程
    await new Promise((resovle,reject)=>{
      if(courseArr.indexOf(course)!=-1){
        reject(new Error('已经选了该课程，不能选一样的课程'))
      }
      resovle()
    })
    //这里验证限制选课数量
    await new Promise((resolve,reject)=>{
        if(courseArr.length>=SELECTlimited){
          reject(new Error('您已经选了'+SELECTlimited+'门课了，不能再选了！'))
        }
        resolve()
    })
    //提交选课信息到数据库
    await sql
      .query(
        "UPDATE userinfo SET selectedCourse=concat(selectedCourse,' ',?) WHERE username=?",
        [course, username]
      )
    await sql.query('UPDATE selectcourse SET SelectNumer=SelectNumer+1 WHERE course= ?',[course])
  }
  insert().then(()=>{
    res.json({err:0,msg:'选课成功'})
  }).catch(err=>{
    res.json({err:1,msg:err.message})
  }).finally(()=>{
    next()
  })
});

module.exports = api;
