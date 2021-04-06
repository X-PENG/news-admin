import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getUserInfoFromSessionStorage } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  //for debug
  // console.log('beforeEach')
  // console.log(from)
  // console.log(to)
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()
  const loginUser =  getUserInfoFromSessionStorage()

  //判断用户是否登录
  if (loginUser) {
      if (to.path === '/login') {
        next({ path: '/' })
        NProgress.done()
      }else{
        //用户信息是否被初始化
        if(!store.getters.routesInitialized){
          //没有初始化，需要初始化用户信息以及用户可访问的路由

          await store.dispatch('user/getInfo')
          // for debug 证明了刷新时，会清空动态挂载的路由
          // let oldRouter = {}  
          // Object.assign(oldRouter, router)      
          // console.log(oldRouter)
          await store.dispatch('user/getPermittedRoutes')

          //注意：不能直接使用next()，否则会出现空白页面的bug
          next({...to,replace: true})
        }else{
          next()
        }
      }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
