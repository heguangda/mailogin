let updateSql = []
let dbversion = 0






var mysql = require('mysql')
var util = require('util')

const DBconfig = require('../config/dbconfig')

  
const mysqlPool = mysql.createPool({
    host: DBconfig.host,
    port: DBconfig.port,
    user: DBconfig.user,
    password: DBconfig.password,
    database: DBconfig.database
    })
  
  
async function checkDB(){
    try {
        var result = await testDBExist()
        if (result.needCreate && result.needCreate == 1) {
          await createDB()
          await initDB()
        } else {
          await updateDatabase()
        }
    } catch (error) {
        mysqlPool.end()
        throw(error)
    }
}
  
  function testDBExist(){
    return new Promise((res,rej) => {
        console.log('进入testDBExist')
        mysqlPool.getConnection(function(err) {
            if (err) {
                if(err.message.indexOf('Unknown database') > -1){
                  res({
                      needCreate: 1
                    })
                } else {
                    rej(err)
                }
            }
            else res({
              needCreate: 0
            })
        })
    })
  }
  async function createDB(){
    con = mysql.createConnection({
      host: DBconfig.host,
      port: DBconfig.port,
      user: DBconfig.user,
      password: DBconfig.password
    })
    var query = util.promisify(con.query.bind(con))
    try {
    await query("CREATE DATABASE IF NOT EXISTS " + DBconfig.database + " DEFAULT CHARSET utf8 COLLATE utf8_general_ci")   
    } catch (error) {
        con.end()
        throw(error)
    }
    return
  }
  
async function initDB(){
    var query = util.promisify(mysqlPool.query.bind(mysqlPool))
    for(const i in info) {
      await query(info[i])
    }
    return query
}
async function updateDatabase(){
    var query = util.promisify(mysqlPool.query.bind(mysqlPool))
    let result = await query('select * from g')
    let version = result[0].version
    if(version < dbversion) {
        console.log('需要更新数据库版本')
    } else {
        console.log('不需要更新数据库版本')
        return
    }
    for (let i = version + 1; i <= dbversion;i++){
        console.log(updateSql[i].msg)
        await query(updateSql[i].sql)
        await query('update g set version = ?', [i])
    }
}
 
0

  
  module.exports = checkDB

  var info  = [
    "CREATE TABLE `account` (\
      `id` int(32) NOT NULL AUTO_INCREMENT,\
      `mail_address` varchar(64) NOT NULL,\
      `password` varchar(64) NOT NULL,\
      `is_check` int(2) NOT NULL DEFAULT '0',\
      `activetime` timestamp NULL DEFAULT null,\
      PRIMARY KEY (`id`),\
      UNIQUE KEY `mail_address` (`mail_address`) USING BTREE\
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
    "CREATE TABLE `g` (\
      `version` int(16) NOT NULL DEFAULT 0\
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
    "insert g set version = 0"
  ]
  
  