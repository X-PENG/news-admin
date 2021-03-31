/**
* 模拟用户可访问的路由表。根据用户的权限生成
*/
const curUserPermittedRouters = [
    {
        name: '系统管理',
        path: '/',
        component: () => import('@/layout'),
        iconCls: null,
        parentId: null,
        meta: {
            subMenu: true
        },
        children: [
            {
                name: '用户管理',
                path: '/system/user',
                component: () => import('@/views/404'),//用户管理组件，出口必须是Layout组件
                iconCls: null,
                parentId: 1
            },
            // {
            //   name: '权限管理',
            //   path: '/system/privilege',
            //   component: () => import('@/views/404'),//权限管理组件，出口必须是Layout组件
            //   iconCls: null,
            //   parentId: 1
            // }
        ]
    },
    {
        path: '/',
        component: () => import('@/layout'),
        children: [
            {
                name: '新闻栏目管理',
                path: '/newsCol',
                component: () => import('@/views/404'),//新闻栏目管理组件，出口必须是Layout组件
                iconCls: null,
                parentId: null//是一级菜单，且是菜单项不是子菜单
            }
        ]
    }
    ,
    {
        name: '新闻管理',
        path: '/',
        component: () => import('@/layout'),
        iconCls: null,
        parentId: null,
        meta: {
            subMenu: true
        },
        children: [
            {
                name: '撰写新闻',
                path: '/news/edit',
                component: () => import('@/views/404'),//新闻编辑组件
                iconCls: null,
                parentId: 3,
            },
            {
                name: '新闻审核',
                path: '/news/review',
                component: () => import('@/views/news/review/ReviewRouterView'),//新闻审核组件，仅仅包含<router-view>
                iconCls: null,
                parentId: 3,
                meta: {
                    subMenu: true
                },
                children: [
                    {
                        name: '一审',
                        path: '/news/review/1',
                        component: () => import('@/views/404'),
                        iconCls: null,
                        parentId: 12,
                    },
                    {
                        name: '二审',
                        path: '/news/review/2',
                        component: () => import('@/views/404'),
                        iconCls: null,
                        parentId: 12,
                    },
                    {
                        name: '三审',
                        path: '/news/review/3',
                        component: () => import('@/views/404'),
                        iconCls: null,
                        parentId: 12,
                    }
                ]
            }
        ]
    }
]

export default curUserPermittedRouters