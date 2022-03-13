var redis = require("redis");//请安装老版本的redis@3.1.2
var client = redis.createClient(); //这里可以填写redis密码
module.exports={//由于redis是单线程的，而且读取速度比js解释器还快,所以这里异步编程没有用
    Client:client,
    hmset:(key,value)=>{
        return new Promise((resovle,reject)=>{//注意不能嵌套对象
            client.hmset(key,value,err=>{//value必须为对象
                if(err){
                    reject(new Error('缓存失败'))
                    return
                }
                resovle()
            })
        })
    },
    hgetall:(key)=>{
        return new Promise((resovle,reject)=>{
            client.hgetall(key,(err,object)=>{
                if(err){
                    reject(new Error('读取redis缓存错误'))
                    return
                }
                resovle(object)
            })
        })
    },
    Key:(keys)=>{
        return new Promise((resovle,reject)=>{
            client.keys(keys,(err,keys)=>{
               if(err){
                reject(new Error('模糊匹配缓存键错误'))
                return
               }
               resovle(keys)//返回字符串数组
            })
        })
    },
    Del:(tokenKeys)=>{
        return new Promise((resovle,reject)=>{
            client.del(tokenKeys,(err,count)=>{
                if(err){
                    reject(new Error('删除缓存发生错误'))
                    return
                }
                resovle(count)
            })
        })
    }
}