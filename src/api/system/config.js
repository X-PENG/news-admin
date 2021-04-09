import request from '@/utils/request'

export function setReviewLevel(level){
    return request({
        url: '/management/system/config/review',
        method: 'put',
        params: {
            reviewLevel: level
        }
    })
}

/**
 * 得到当前系统配置
 * @returns 
 */
export function getCurSystemConfig(){
    return new Promise((resolve, reject) => {
        request({
            url: '/management/system/config/',
            method: 'get',
        }).then(resp => {
            resolve(resp)
        })
    })
}
