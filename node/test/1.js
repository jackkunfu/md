/* module.exports / exports */
// console.log(require('./exoprt'))

/* Buffer */
// var a = Buffer.from('abc')
// console.log(a) // <Buffer 61 62 63>  // 61|62|63 字符对应的 Unicode 码的 16 进制
// a[1] = '100' // 字母 d 对应的 Unicode 码
// console.log(a.toString()) // 'adc'
// console.log(a)

var a = Buffer.from('abc')
var b = Buffer.alloc(20)
var c = Buffer.alloc(2)
a.copy(b)
a.copy(c)
console.log(a) // <Buffer 61 64 63>
console.log(a.toString()) // abc
console.log(b) // <Buffer 61 64 63 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>
console.log(b.toString()) // abc
console.log(c) // <Buffer 61 62>
console.log(c.toString()) // ab

