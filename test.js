// var test2 = require('./test2.js')
// console.log(test2)
// setTimeout(() => {
//     console.log(test2)
// },1000)
// console.log(d)
const qs = require('querystring')
let a = {
    b:'123',
    d: '你好',
    c:'外网'
}
let str = qs.stringify(a, null, null, {encodeURIComponent:(val) => val})
console.log(Buffer.from(str).toString('base64'))

let aaa = Buffer.from('dHlwZT1TRUNSRVQ=', 'base64').toString('utf8')

let obj = qs.parse(aaa)
console.log(aaa)
console.log(obj)