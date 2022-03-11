var express = require("express");
var api = express.Router();
var sql = require("../../db");
api.get("/", (req, res, next) => {
  if (req.session.username === undefined) {
    res.json({ err: 1, msg: "请先登录" });
    next();
    return
  }
  let username = req.session.username;
  let course = req.query.course;
  let SELECTlimited=3
  async function insert() {
    //验证是否存在提交的课程
    let result = await sql
      .query("SELECT count(*) FROM  selectcourse WHERE course = ?", [course])
    await new Promise((resovle,reject) => {
      if (result[0]["count(*)"] == 0) {
        reject()
      }
      resovle()
    }).catch(()=>{
      res.json({ err: 1, msg: "没有选课数据，恶意篡改前端数据" })
      next()
      return
    })
    //这里验证限制选课数量
    let selectedNumResult=await sql.query('SELECT selectedCourse FROM userinfo WHERE username=?',[username])
    let courseArr=String(selectedNumResult[0].selectedCourse).trim().split(' ')
    //验证是否为提交过的课程
    await new Promise((resovle,reject)=>{
      if(courseArr.indexOf(course)==-1){
        resovle()
      }
      reject()
    }).catch(()=>{
      res.json({err:1,msg:'已经选了该课程，不能选一样的课程'})
      next()
      return
    })
    await new Promise((resolve,reject)=>{
        if(courseArr.length>=SELECTlimited){
          reject()
        }
        resolve()
    }).catch(()=>{
      res.json({err:1,msg:'您已经选了'+SELECTlimited+'门课了，不能再选了！'})
      next()
      return
    })
    //提交选课信息到数据库
    await sql
      .query(
        "UPDATE userinfo SET selectedCourse=concat(selectedCourse,' ',?) WHERE username=?",
        [course, username]
      )
    await sql.query('UPDATE selectcourse SET SelectNumer=SelectNumer+1 WHERE course= ?',[course]).
    then(()=>{
      res.json({err:0,msg:'成功'})
    }).catch(e=>{
      res.json({err:1,msg:'该课程已经被选满了不能再选了！'+e})
    }).finally(()=>{
      next()
    })
  }
  insert();
});

module.exports = api;
