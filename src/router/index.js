import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'menu-name'               如果这个路由是菜单，就会有name属性，作为菜单名
 * iconCls                        图标样式
 * parentId：{number}             数据库中的外键，如果有子路由的parentId不为null，则代表该路由要渲染成子菜单      
 * meta:{
 *    subMenu                     代表是否是子菜单，如果是子菜单则面包屑不可点击跳转
 * 
 * }
 */

/**
 * 为登录时，只有登录路由
 */
const loginRoute = {
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
}

/**
 * 登录用户的公用路由：不需要权限验证。
 * 当登录成功，才会挂载到路由表上
 */
const publicRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: '首页',
        component: () => import('@/views/dashboard/index'),
        iconCls: null,
        parentId: null
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    children: [
      {
        name: '个人中心',
        path: '/private',
        component: () => import('@/views/404'),//个人中心组件，出口必须是Layout组件
      },
      {
        name: '修改密码',
        path: '/updateKey',
        component: () => import('@/views/404'),//修改密码组件，出口必须是Layout组件
      }
    ]
  }
]

/**
* 没有匹配到的路由，就重定向到404页面。该路由必须放在路由表的最后！！！
*/
const notFoundRoute = { path: '*', redirect: '/404', hidden: true }

//创建初始路由
const createInitialRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  //一开始只有登录路由
  routes: [loginRoute].concat(publicRoutes)
})

const router = createInitialRouter()

//创建完整路由
const createCompleteRouer = (curUserPermittedRouters) => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  //新的路由具有完整的路由表，完整路由表=loginRoute + publicRoutes + curUserPermittedRouters + notFoundRoute
  routes: [].concat(loginRoute, publicRoutes, curUserPermittedRouters)
})


// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createInitialRouter()
  //测试：是否可以清空路由。测试结果：可以清空路由！！！
  // const newRouter = new Router({
  //   // mode: 'history', // require service support
  //   scrollBehavior: () => ({ y: 0 }),
  //   routes: []
  // })
  router.matcher = newRouter.matcher // reset router。替换现有router的routes

  //for debug
  // console.log('重置路由')
  // console.log(router)
}

//生成完整的路由表
export function generateCompleteRouter(curUserPermittedRouters) {
  //添加到动态加载的路由的末尾
  curUserPermittedRouters.push(notFoundRoute)
  const newRouter = createCompleteRouer(curUserPermittedRouters)
  router.matcher = newRouter.matcher // 替换完整的路由
  // router.addRoutes(newRouter.options.routes) // 和上条语句作用相同！
  // curUserPermittedRouters.forEach(r => router.addRoute(r))// 和上面作用相同

  console.log('生成完整的路由表')
  //for debug
  // console.log('打印旧router')
  // let oldRouter = {};
  // Object.assign(oldRouter, router);
  // console.log(oldRouter)
  // router.matcher = newRouter.matcher // 替换完整的路由表
  // // router.addRoutes(newRouter.options.routes)// 和上面作用相同
  // // curUserPermittedRouters.forEach(r => router.addRoute(r))// 和上面作用相同
  // console.log('打印赋值后的router')
  // console.log(router)
  // console.log(router.options.routes)
  // console.log('打印完整的路由表')
  // console.log(newRouter.options.routes)
  return newRouter.options.routes
}

export default router
