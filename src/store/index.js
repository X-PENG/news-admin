import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  state: {
    loadingForAppMain: false//AppMain是否处于加载状态，默认为false
  },
  mutations: {
    SET_LOADING_FOR_APP_MAIN(state, loadingStatus){
      state.loadingForAppMain = loadingStatus
    }
  },
  getters
})

export default store
