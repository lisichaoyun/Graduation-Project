var mysql = require("mysql")
var connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'lisichaoyun@163.com',
  database: 'library',
})
connection.connect()
console.log('数据库已连接')
module.exports.query=(sqlStatement,sqlParameter)=>{
//增'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)'
//删'DELETE FROM websites where id=6'
//改'UPDATE websites SET name = ?,url = ? WHERE Id = ?'
//查'SELECT * FROM websites'
//关闭连接connection.end()
return new Promise((resolve,reject)=>{
  connection.query(sqlStatement,sqlParameter,(err,result)=>{
      if(err){
        reject('sql语句错误')
        return
      }
      resolve(result)//如何选择数据第一个键填行索引第二个填列索引
  })
})
}