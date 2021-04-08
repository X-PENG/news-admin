import request from '@/utils/request'

export function roleList(){
    return request({
        url: '/management/role/',
        method: 'get'
    })
}

export function menuTree() { 
    return request({
        url: '/management/role/resources',
        method: 'get'
    })
 }

 export function addRole(roleInfo){
    return request({
        url: '/management/role/',
        method: 'post',
        data: roleInfo
    })    
 }

 export function delRole(roleId){
    return request({
        url: `/management/role/${roleId}`,
        method: 'delete',
    })    
 }

 export function setResourceForRole(roleId, resourceIdList){
    return request({
        url: `/management/role/${roleId}`,
        method: 'put',
        data: resourceIdList
    })    
 }

 export function getAllResourceOfRole(roleId){
    return request({
        url: `/management/role/${roleId}`,
        method: 'get',
    })       
 }