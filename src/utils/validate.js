/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * 验证字符串是否是数字
 * @param {*} str 
 */
export function isNumber(str){
  if(typeof(str) === 'number'){
    return true
  }

  if(typeof(str) === 'string'){
    let reg = /^[1-9]\d*$/
    return reg.test(str)
  }

  return false
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
 export function validURL(url) {
  const reg = /^(https?|ftp):\/\//
  return reg.test(url)
}
