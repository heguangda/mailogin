const mysql = require('mysql')
const util = require('util')
const dbconfig = require('../config/dbconfig')
const DB = mysql.createPool(dbconfig)
const query = util.promisify(DB.query.bind(DB))
module.exports = query