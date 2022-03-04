var express=require('express')
var api=express.Router()
var sql=require('../../db')
api.get('/',(req,res,next)=>{
    if(req.session.username===undefined){
      res.json({err:1,msg:'请先登录'})
      next()
    }
    sql.query('SELECT selectedCourse FROM userinfo',[req.session.username])
    .then(r=>{
      res.json({err:0,msg:r})
    })
    .catch(e=>{
      res.json({err:1,msg:'账号查询错误'})
    })
})
module.exports=api