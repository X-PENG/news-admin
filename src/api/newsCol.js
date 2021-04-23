import request from '@/utils/request'

export function newsColList(){
    return request({
        url: '/management/column/',
        method: 'get'
    })
}

/**
 * 得到子栏目列表
 */
export function childNewsColList(newsColId){
    return request({
        url: `/management/column/${newsColId}`,
        method: 'get'
    })
}

export function addNewsCol(newsColInfo){
    return request({
        url: '/management/column/',
        method: 'post',
        data: newsColInfo
    })
}

export function delNewsCol(newsColId){
    return request({
        url: `/management/column/${newsColId}`,
        method: 'delete'
    })
}

export function updateNewsCol(newsColInfo){
    return request({
        url: '/management/column/',
        method: 'put',
        data: newsColInfo
    })
}

export function enableOrDisableNewsCol(newsColId, status){
    return request({
        url: `/management/column/${newsColId}`,
        method: 'put',
        params:{
            status
        }
    })
}

/**
 * 改图片显示位置
 * @param {*} newsColId 
 * @param {*} status 
 * @returns 
 */
export function changeNewsColShowImgStatus(newsColId, status){
    return request({
        url: `/management/column/showImgStatus/${newsColId}`,
        method: 'put',
        params:{
            status
        }
    })
}