const crypto = require('crypto')
const qs = require('querystring')
const jwtConfig = require('../config/jwtconfig')


const TWO_HOURS = 3600 * 1000 * 2
function checkMailaddressFormat(mailAddress){
    let myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/
    if(myReg.test(mailAddress)) {
        return true
    }
    return false
}


function getjwt(jwtdata){
    let header = jwtdata.header
    if (!header) {
        header = {
            type: 'CHECK_LINK_SECRET'
        }
    }
    let payload =jwtdata.payload
    if (!payload) {
        payload = {msg: 'no payload'}
    }
    if (!payload.timestamp) {
        payload.timestamp = new Date().getTime() + TWO_HOURS
    }
    let header_base64 = Buffer.from(AsciiSort(header)).toString('base64')
    let payload_base64 = Buffer.from(AsciiSort(payload)).toString('base64')
    let sign = createhash(header_base64 + payload_base64 + jwtConfig[header.type])
    let jwt =  header_base64 + '.' + payload_base64 + '.' + sign;
    console.log('jwt:', jwt)
    return jwt
}


function checkJwt(jwt){
    console.log(jwt)
    let data = jwt.split('.')
    let header_base64 = data[0]
    let payload_base64 = data[1]
    console.log(data)
    let orsign = data[2]
    let header = qs.parse(Buffer.from(header_base64, 'base64').toString('utf8'))
    let payload = qs.parse(Buffer.from(payload_base64, 'base64').toString('utf8'))
    if (payload.timestamp) {
        let timestamp = payload.timestamp
        let nowStamp = new Date().getTime()
        console.log('目前时间:', new Date(nowStamp))
        console.log('目前时间戳:',nowStamp)
        console.log('时间戳:',timestamp)
        console.log('到期时间:',new Date(Number(timestamp)))
        if (nowStamp > timestamp) //超时
        return {code: false}
    } else {
        return {code: false}
    }
    console.log(header)
    console.log(payload)
    console.log('密钥:', jwtConfig[header.type])
    let oursign = createhash(header_base64 + payload_base64 + jwtConfig[header.type])
    console.log("签名结果:",oursign)
    console.log("原签名:",orsign)
    if (orsign === oursign) {
        return {code: true, jwtData: {header, payload}}
    } else {
        console.log('验证失败')
        return {code: false}
    }
}
function AsciiSort(obj,notsign = {}){
    let keys = []
    for (const key in obj) {
        if (notsign[key]) continue
        keys.push(key)
    }
    let newKeys = keys.sort()
    let newObj = {}
    for (let i in newKeys) {
        newObj[newKeys[i]] = obj[newKeys[i]]
    }
    let str = qs.stringify(newObj, null, null, {encodeURIComponent:(val) => val}) 
    //使用新的encodeURIComponent函数，不进行url编码
    return str
}

function createhash (str){
    let hash = crypto.createHash('sha256')
    hash.update(str)
    return hash.digest('hex')
}

exports.checkMailaddressFormat = checkMailaddressFormat
exports.createhash = createhash
exports.AsciiSort = AsciiSort
exports.getjwt = getjwt
exports.checkJwt = checkJwt