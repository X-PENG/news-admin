import { login, logout, getRoutes, getInfo, updateInfo } from '@/api/user'
import { getToken, setToken, removeToken, saveUserInfoInSessionStorage, removeUserInfoFromSessionStorage, getUserInfoFromSessionStorage } from '@/utils/auth'
import { resetRouter, mountAndGetCompleteRouter } from '@/router'
import { formatRoutes } from '@/utils/menus'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    userInfo: {},//获取到的用户基本信息
    completeRoutes: [],//保存当前用户完整的路由表，用于生成菜单栏
    routesInitialized: false//默认没有初始化当前用户的路由表
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTES_INITIALIZED: (state, initialized) => {
    state.routesInitialized = initialized
  },
  SET_COMPLETE_ROUTES: (state, routes) => {
    state.completeRoutes = routes
  },
  SET_USER: (state, user) => {
    state.userInfo = user
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        //登录成功，保存用户信息，修改vuex管理的全局状态
        saveUserInfoInSessionStorage(response)
        //不需要改变state，直接resolve，继续执行正常执行序列
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      //异步请求用户信息
      getInfo().then(response => {
          //塞一个头像
          response.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
          let { realName, avatar } = response
          commit('SET_NAME', realName)
          commit('SET_AVATAR', avatar)
          commit('SET_USER', response)
          resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  //修改用户信息
  updateInfo({ commit }, newUserInfo){
      return new Promise((resolve, reject) => {
          updateInfo(undefined, newUserInfo).then(() => {
            resolve()
          }).catch(error => {
            reject(error)
          })
      })
  },

  //从后端查询当前登录用户可访问的路由表
  getPermittedRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      getRoutes().then((response) => {
          //格式化路由表
          let formattedRoutes = formatRoutes(response)
          let completeRoutes = mountAndGetCompleteRouter(formattedRoutes)
          commit('SET_COMPLETE_ROUTES', completeRoutes)
          commit('SET_ROUTES_INITIALIZED', true) 
          resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        // removeToken() // must remove  token  first
        console.log('注销成功')
        //清除sessionStorage中保存的用户信息
        removeUserInfoFromSessionStorage()
        //重置路由
        resetRouter()
        //重置用户的全局状态
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

