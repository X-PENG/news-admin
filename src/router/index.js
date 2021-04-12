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
 * 登录路由
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
        component: () => import('@/views/dropDownMenu/profile'),//个人中心组件，出口必须是Layout组件
      }
    ]
  }
]


const staticRoutes = [].concat(loginRoute, publicRoutes)

/**
 * 预览新闻的路由
 */
const previewNewsRoute = { path: '/news/preview', component: () => import('@/components/Preview'), hidden: true }

/**
* 没有匹配到的路由，就重定向到404页面。该路由必须放在路由表的最后！！！
*/
const notFoundRoute = { path: '*', redirect: '/404', hidden: true }

//创建初始路由
const createInitialRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: staticRoutes
})

const router = createInitialRouter()

//创建完整路由
const createCompleteRouer = (curUserPermittedRoutes) => new Router({
  scrollBehavior: () => ({ y: 0 }),
  //新的路由具有完整的路由表，完整路由表=loginRoute + publicRoutes + curUserPermittedRoutes + notFoundRoute
  routes: staticRoutes.concat(curUserPermittedRoutes)
})


export function resetRouter() {
  const newRouter = createInitialRouter()
  //测试：是否可以清空路由。测试结果：可以清空路由！！！
  // const newRouter = new Router({
  //   // mode: 'history', // require service support
  //   scrollBehavior: () => ({ y: 0 }),
  //   routes: []
  // })
  router.matcher = newRouter.matcher // reset router

  //for debug
  // console.log('重置路由')
  // console.log(router)
}

//挂载并获取完整的路由表
export function mountAndGetCompleteRouter(curUserPermittedRoutes) {
  /**
   * 添加预览新闻的路由到路由表：如果路由表中有‘新闻管理路由’，就添加；
   */
  let tag = false
  for(let i = 0; i < curUserPermittedRoutes.length; i++){
    if(curUserPermittedRoutes[i].name === '新闻管理' && curUserPermittedRoutes[i].path === '/'){
      tag = true
      break
    }
  }
  if(tag){
    curUserPermittedRoutes.push(previewNewsRoute)
  }

  //添加not found路由到动态加载的路由的末尾
  curUserPermittedRoutes.push(notFoundRoute)

  const newRouter = createCompleteRouer(curUserPermittedRoutes)
  router.matcher = newRouter.matcher // 替换完整的路由
  // router.addRoutes(newRouter.options.routes) // 和上条语句作用相同！
  // curUserPermittedRoutes.forEach(r => router.addRoute(r))// 和上面作用相同
  //返回完整的路由表
  return newRouter.options.routes
}

export default router
