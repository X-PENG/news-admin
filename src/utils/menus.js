/**
 * 之所以要格式化，是因为返回的路由表的component字段是字符串，要格式化成组件对象
 * 另外，约定：
 *      如果一级路由（parentId==null）的component不等于Layout，则把该路由作为如下 一级路由的子路由：
 *          {
 *              path:'/', 
 *              component: () => import('@/layout')
 *          }
 *      原因：因为一级路由组件的出口是<App/>组件的<router-view>
 * @param routes 后端返回的路由表（待格式化）
 * @returns 
 */
export const formatRoutes = (routes)=>{
    let result = [];

    if(!!!routes){
        return result
    }

    routes.forEach(routeRecord => {
        let { name, path, component, meta, children, iconCls, parentId } = routeRecord;
        
        //有孩子就先递归处理children
        if(children && children instanceof Array){
            children = formatRoutes(children);
        }

        //处理自己
        let afterFormat = {
            name: name,
            path: path,
            //  webpack4中动态import不支持变量方式，改为使用require
            // component: () => {
            //     let suffix = '';

            //     //若是一级子菜单，对应布局组件
            //     if(path === '/'){
            //         return import('../layout')//对应布局组件
            //     }

            //     suffix = path;//一般来说就是路径
                
            //     //若是审核组件
            //     if(path.indexOf('review') !== -1){
            //         suffix = '/news/review';
            //         //是新闻审核子菜单，则对应的是ReviewRouterView组件
            //         if(path === '/news/review'){
            //             suffix += '/ReviewRouterView'
            //         }
            //     }

            //     return import('../views' + suffix);
            // },
            component(resolve){
                let suffix = '';

                //若是一级子菜单，对应布局组件
                if(path === '/'){
                    require(['@/layout'], resolve)//对应布局组件
                    return;
                }

                suffix = path;//一般来说就是路径
                
                //若是审核组件
                if(path.indexOf('review') !== -1){
                    suffix = '/news/review';
                    //是新闻审核子菜单，则对应的是ReviewRouterView组件
                    if(path === '#review'){
                        suffix += '/ReviewRouterView'
                    }
                }

                require([`@/views${suffix}`], resolve)
            },
            meta: meta,
            children: children,
            iconCls: iconCls,
            parentId: parentId
        };

        //代表该路由是一级路由
        if(parentId == null){
            //且一级路由的组件不是Layout，就把该路由作为Layout组件路由的子路由
            if(component !== 'Layout'){
                afterFormat = {
                    path:'/',
                    component: () => import('@/layout'), 
                    children: [
                        afterFormat
                    ]
                }
            }
        }

        result.push(afterFormat);
    });

    return result;
};
