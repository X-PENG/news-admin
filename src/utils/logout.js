import { removeUserInfoFromSessionStorage } from '@/utils/auth'
import { resetRouter } from '@/router'
import store from '@/store'

export function afterLogout(){
    //清除sessionStorage中保存的用户信息
    removeUserInfoFromSessionStorage()
    //重置路由
    resetRouter()
    //重置用户的全局状态
    store.commit('user/RESET_STATE')
}