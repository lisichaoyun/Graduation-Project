var mysql = require("mysql")
var pool=mysql.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'lisichaoyun@163.com',
  database: 'library',
  // multipleStatements: true//允许多条查询语句默认关闭
})

module.exports.query=(sqlStatement,sqlParameter)=>{
//增'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)'
//删'DELETE FROM websites where id=6'
//改'UPDATE websites SET name = ?,url = ? WHERE Id = ?'
//查'SELECT * FROM websites'
//关闭连接connection.end()有回调
//这里可以写同步代码，如果连接池写在这里可能会阻塞IO
  return new Promise((resolve,reject)=>{
    pool.getConnection((err,connection)=>{
      if(err){
        reject(new Error('数据库连接池进行连接错误'))
        return
      }
      connection.query(sqlStatement,sqlParameter,(err,result)=>{
        if(err){
          reject(new Error('sql语句错误'))
          return
        }
        resolve(result)//如何选择数据第一个键填行索引第二个填列索引
        connection.release()//释放到连接池
      })
    })
  })
}