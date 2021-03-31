import request from '@/utils/request'
import curUserPermittedRouters from '@/router/mockData'

export const initMenus = (router, store)=>{
    if(store.getters.completeRoutes.length > 0){
        //说明是正常的跳转：用户在界面点击各种菜单。
        console.log('store.state.routes.length > 0');
        return;
    }
    router.addRoutes(curUserPermittedRouters)
    // curUserPermittedRouters.forEach(e=>router.addRoute(e)) 
    // getRequest("/system/config/menu").then(function(response) {
    //     if(response){
    //         let routes = response.data;
    //         if(routes && routes.length > 0){
    //             //对routes进行递归处理，将每个路由记录的component字段值转成组件对象。
    //             let routesFormated = formatRoutes(routes);
    //             //动态添加路由配置到router中
    //             routesFormated.forEach(e=>router.addRoute(e));
    //             //改变vuex的routes（只能提交mutation）
    //             store.commit('initRoutes', routesFormated);
    //         }
    //     }
    // });
};

//动态添加路由
export const initRouter = (router)=>{
    getRequest("/system/config/menu").then(function(response) {
        console.log('动态添加路由请求成功');
        let routes = response.data;
        if(routes && routes.length > 0){
            //对routes进行递归处理，将每个路由记录的component字段值转成组件对象。
            let routesFormated = formatRoutes(routes);
            //动态添加路由配置到router中
            routesFormated.forEach(e=>router.addRoute(e));
        }
    });
};

const formatRoutes = (routes)=>{
    let result = [];
    routes.forEach(routeRecord => {
        //参数解构
        let { path, name, component, meta, children, iconCls } = routeRecord;
        
        //先递归处理children
        if(children && children instanceof Array){
            children = formatRoutes(children);
        }
        let afterFormat = {
            path: path,
            name: name,
            component: () => {
                let prefix = '';
                if(component.startsWith('Emp') || component.startsWith('Per') || component.startsWith('Sal') || component.startsWith('Sta') || component.startsWith('Sys')){
                    prefix = component.substring(0,3).toLowerCase() + '/';
                }
                return import('../views/' + prefix + component + '.vue');
            },
            // component(resolve){
            //     let prefix = '';
            //     if(component.startsWith('Emp') || component.startsWith('Per') || component.startsWith('Sal') || component.startsWith('Sta') || component.startsWith('Sys')){
            //         prefix = component.substring(0,3).toLowerCase() + '/';
            //     }
            //     console.log('prefix = ' + prefix);
            //     let componentPath = prefix + component + '.vue';
            //     console.log('componentPath = ' + componentPath);
            //     require(['../views/' + componentPath], resolve);
            // },
            children: children,
            meta: meta,
            iconCls: iconCls
        };

        result.push(afterFormat);
    });

    return result;
};
