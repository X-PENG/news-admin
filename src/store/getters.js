const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  routesInitialized: state => state.user.routesInitialized,
  completeRoutes: state => state.user.completeRoutes
}
export default getters
