import request from '@/utils/request'
import qs from 'qs'

/**
 * 分页查询用户列表
 */
export function queryUserList(data){
    return request({
        url: '/management/user/',
        method: 'get',
        params: {
            page: data.page,
            pageSize: data.size,
            username: data.username,
            realName: data.realName,
            gender: data.gender,
            phone: data.phone,
            email: data.email,
            locked: data.locked,
            roleId: data.roleId
        }
    });
}

export function getAllRoles() {
    return new Promise((resolve,reject) => {
        request({
            url: '/management/user/roles',
            method: 'get'
        }).then(resp => {
            resolve(resp)
        })
    })
}

export function getRolesOfUser(userId){
    return new Promise((resolve,reject) => {
        request({
            url: `/management/user/roles/${userId}`,
            method: 'get'
        }).then(resp => {
            resolve(resp)
        })
    }) 
}

export function setRolesForUser(userId, roles){
    return new Promise((resolve,reject) => {
        request({
            url: `/management/user/roles/${userId}`,
            method: 'put',
            data: roles
        }).then(resp => {
            resolve(resp)
        })
    }) 
}

export function lockOrUnlockUser(userId, locked){
    return request({
        url: `/management/user/locked/${userId}`,
        method: 'put',
        data: qs.stringify({
            'locked': locked
        })
    })
}

export function delUser(userId){
    return request({
        url: `/management/user/${userId}`,
        method: 'delete',
    })
}

export function addUser(userInfo){
    return request({
        url: '/management/user/',
        method: 'post',
        data: userInfo
    })
}
