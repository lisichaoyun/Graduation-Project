var express = require("express");
var sql = require("../../db");
let api = express.Router();
api.post("/", (req, res, next) => {
  sql
    .query("SELECT password FROM userinfo where username=?", [req.body.username])
    .then((result) => {
        if(result[0].password==req.body.password){
            req.session.username=req.body.username
            req.session.save()
            res.json({err:0,msg:'成功'})
        }else{
            res.json({err:1,msg:'密码错误'})
        }
    }).catch(e=>{
        res.json({err:1,msg:e})
    }).finally(()=>{
        next()
    })
});
module.exports=api
