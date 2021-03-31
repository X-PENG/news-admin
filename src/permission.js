import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getUserInfoFromSessionStorage } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { initMenus } from '@/utils/menus'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()
  const loginUser =  getUserInfoFromSessionStorage()

  //判断用户是否登录
  if (loginUser) {
      // initMenus(router, store)
      /**
       * 判断用户可访问的路由表是否初始化了（是一个全局共享状态），
       * 没有初始化，就获取当前用户可访问的路由表，动态挂载路由，并且生成菜单
       * 初始化了，直接next()完成路由跳转
       */

      //用户信息是否被初始化
      if(!store.getters.routesInitialized){
        //没有初始化，需要初始化用户信息以及用户可访问的路由
        store.dispatch('user/getInfo')
        console.log('路由没有初始化，需要初始化路由')
        
        // for debug 证明了刷新时，会清空动态挂载的路由
        // let oldRouter = {}  
        // Object.assign(oldRouter, router)      
        // console.log(oldRouter)
        await store.dispatch('user/getPermittedRoutes')
        console.log('初始化完毕')
      }

      console.log('继续导航')
      if (to.path === '/login') {
        next({ path: '/' })//此时，不会触发全局前置守卫
        NProgress.done()
      }else{
        next()
      }

  } else {
    console.log('没有登录')
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
