const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  routesInitialized: state => state.user.routesInitialized,
  completeRoutes: state => state.user.completeRoutes,
  userInfo: state => state.user.userInfo,
  hasNewsDraftsRoute: state => {//当前用户是否具有草稿箱路由
    //首先过滤出下拉菜单路由
    let filterDropDownMenu = state.user.completeRoutes.filter(item => item.name === '下拉菜单' && item.path === '/')
    //匹配到了，并且下拉菜单还有孩子
    if(filterDropDownMenu.length == 1 && filterDropDownMenu[0].children){
      //过滤孩子是否有草稿箱路由
      let filterNewsDrafts = filterDropDownMenu[0].children.filter(e => e.name === '草稿箱' && e.path === '/dropDownMenu/newsDrafts')
      if(filterNewsDrafts.length == 1){
        return true
      }
      return false
    }
    return false
  }
}
export default getters
