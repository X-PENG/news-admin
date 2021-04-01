import { login, logout, getRoutes } from '@/api/user'
import { getToken, setToken, removeToken, saveUserInfoInSessionStorage, removeUserInfoFromSessionStorage, getUserInfoFromSessionStorage } from '@/utils/auth'
import { resetRouter, generateCompleteRouter } from '@/router'
import { formatRoutes } from '@/utils/menus'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
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
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        // const { data } = response
        // commit('SET_TOKEN', data.token)
        // setToken(data.token)

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
  getInfo({ commit, state }) {
    //登录之后用户信息会保存在sessionStorage中
    let { realName } = getUserInfoFromSessionStorage()
    const avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    commit('SET_NAME', realName)
    commit('SET_AVATAR', avatar)
    // return new Promise((resolve, reject) => {
    //   getInfo(state.token).then(response => {
    //     const { data } = response

    //     if (!data) {
    //       return reject('Verification failed, please Login again.')
    //     }

    //     const { name, avatar } = data

    //     commit('SET_NAME', name)
    //     commit('SET_AVATAR', avatar)
    //     resolve(data)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  //从后端查询当前登录用户可访问的路由表
  getPermittedRoutes({ commit }) {
    console.log('查询用户可访问的路由表')
    return new Promise((resolve, reject) => {
      getRoutes().then((response) => {
          //格式化路由表
          let formattedRoutes = formatRoutes(response)
          let completeRoutes = generateCompleteRouter(formattedRoutes)
          commit('SET_ROUTES_INITIALIZED', true) 
          commit('SET_COMPLETE_ROUTES', completeRoutes)
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

