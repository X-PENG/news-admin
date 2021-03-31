import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const userKey = 'loginUser' 

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function saveUserInfoInSessionStorage(user){
  return window.sessionStorage.setItem(userKey, JSON.stringify(user))
}

export function getUserInfoFromSessionStorage(){
  let loginUser = window.sessionStorage.getItem(userKey)
  return loginUser && JSON.parse(loginUser)
}

export function removeUserInfoFromSessionStorage(){
  return window.sessionStorage.removeItem(userKey)
}
