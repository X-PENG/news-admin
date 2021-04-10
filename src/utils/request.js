import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import router from '@/router'
import { afterLogout } from '@/utils/logout'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

//创建axios对象，并自定义默认配置
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken()
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    //首先，通过http响应状态码判断请求成功
    if (response.status && response.status == 200) {

      //再通过自定义状态码，判断是否出现业务错误
      if(res.code != 200){
        //出现业务错误
        res.msg = '[statusCode:'+ res.code +'] ' + res.msg//把业务状态码拼接上
        Message.error({ message: res.msg });
        //出现错误，就跳转到catch异常执行序列上进行处理
        return Promise.reject(new Error(res.msg || 'Error'))
      }

      //业务执行成功
      
      //有msg就显示msg
      if(res.msg){
        //如果有消息就提示
        Message.success({message: res.msg});
      }

      return res.data;//返回数据
      
    } else {
      res.msg = '[statusCode:'+ res.code +'] ' + res.msg//把业务状态码拼接上
      Message.error({ message: res.msg });
      //请求失败，就跳转到catch异常执行序列上进行处理
      return Promise.reject(new Error(res.msg || 'Error'))
    }
  },
  error => {
    //从响应体中得到自定义消息
    let customizeMsg = error.response.data && error.response.data.msg
    console.log('err: ' + error) // for debug
    Message({
      message: customizeMsg || error.message,
      type: 'error',
      duration: 3 * 1000
    })
    let reLogin = false;//是否重新登录
    if(error.response.status && error.response.status === 403){
      MessageBox.confirm('禁止操作，是否重新登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        afterLogout()//清除用户状态
        router.replace('/login')
      })
    }else if( error.response.data && (error.response.data.code === '401' || error.response.data.code === '403') ){
      reLogin = true
    }
    if(reLogin){
      afterLogout()//清除用户状态
      router.replace(`/login?redirect=${router.currentRoute.path}`)
    }
    return Promise.reject(error)
  }
)

export default service
