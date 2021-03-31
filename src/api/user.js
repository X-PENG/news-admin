import request from '@/utils/request'

export function login(data) {
  /**
   * axios默认的content-type是application/json，不是application/x-www-form-urlencoded格式；
   * 只修改content-type还不行，
   * 默认情况下，axios将js对象序列化为JSON。
   * 要以application/x-www-form-urlencoded格式发送数据，必须自己序列化成key/value形式
   */
  return request({
    url: '/doLogin',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data,
    transformRequest: [
      //自己将js对象序列化成key/value形式
      function (data) {
        let result = '';
        for (let key in data) {
          result += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
        }
        return result;
      }
    ]
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

//得到用户可访问的路由表
export function getRoutes(){
  return request({
    url: '/management/private/menu',
    method: 'get'
  })
}