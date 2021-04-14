/**
 * 传稿人相关API
 */

import request from '@/utils/request'

/**
 * 创建新闻或保存新闻，状态设为草稿或完成上传的状态
 * @param {*} tag 1-草稿；2-完成上传
 * @param {*} newsInfo 
 * @returns 
 */
export function createOrSaveNewsAsDraftOrCompleted(tag, newsInfo){
    return request({
        url: `/management/news/upload/${tag}`,
        method: 'post',
        data: newsInfo
    })    
}

/**
 * 分页条件查询用户的草稿列表
 * @param page 
 * @param pageSize 
 * @param queryParam 
 */
export function draftList(queryParam){
    return request({
        url: '/management/news/upload/',
        method: 'get',
        params: queryParam
    })
}

/**
 * 查询一个草稿
 * @param id 
 * @returns 
 */
export function selectDraft(id){
    return request({
        url: `/management/news/upload/${id}`,
        method: 'get'
    })    
}

/**
 * 删除一个草稿
 * @param id 
 * @returns 
 */
export function deleteDraft(id){
    return request({
        url: `/management/news/upload/${id}`,
        method: 'delete'
    })    
}

export function uploadDraft(id) {
    return request({
        url: `/management/news/upload/${id}`,
        method: 'put'
    })    
}