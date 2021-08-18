/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 *
 * @param A string字符串
 * @param n int整型
 * @return int整型
 */
let isPal = (str) => str === str.split('').reverse().join('');

export function getLongestPalindrome(A) {
  // write code here
  let str = '',
    curStr = '';
  let len = A.length;

  // 类似冒泡 可行 循环出每一段是否是回文
  //     for (let i = 0; i < len; i++) {
  //         curStr = ''
  //         for (let j = i; j< len; j++) {
  //             curStr += A[j]
  //             if (isPal(curStr) && curStr.length > str.length) str = curStr
  //         }
  //     }

  // 动态规划？ 找每个索引idx 为中心得子串 是不是回文
  let i = 0;
  while (i < len) {
    let l = Math.min(i, len - i);
    let c = A[i];
    for (let j = 1; j < l; j++) {
      c = A[i - j] + c + A[i + j];
      if (!isPal(c)) {
        i++;
        break;
      }
      if (isPal(c) && c.length > str.length) {
        str = c;
        continue;
      }
    }
    i++;
    //         i += c.length / 2;
  }
  return str.length;
}

console.log(getLongestPalindrome());
