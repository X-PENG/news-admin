import request from '@/utils/request'
import qs from 'qs'

/**
 * 发布人员的api
 */

/**
 * 分页、条件查询待发布新闻列表
 * @param queryParam 
 * @returns 
 */
export function unpublishedNewsList(queryParam) {
    return request({
        url: '/management/news/pub/unpublished',
        method: 'get',
        params: queryParam
    })
}

/**
 * 查询待发布状态列表，用于下拉选择器数据
 * @returns 
 */
export function toBeReleasedStatusList() {
    return request({
        url: '/management/news/pub/toBeReleasedStatusList',
        method: 'get'
    })
}

/**
 * 将新闻打回修改
 * @param newsId 
 * @param suggestion 
 * @returns 
 */
export function remodification(newsId, suggestion) {
    return request({
        url: `/management/news/pub/remodification/${newsId}`,
        method: 'put',
        //把参数放到请求体中，请求体使用application/x-www-form-urlencoded 格式（也就是key-value 键值对格式）
        data: qs.stringify({
            suggestion
        })        
    })
}


/**
 * 发布一个新闻
 * @param newsId 
 * @param pubInfo 
 */
export function publishOneNews(newsId, pubInfo) {
    return request({
        url: `/management/news/pub/${newsId}`,
        method: 'put',
        data: pubInfo
    })
}

/**
 * 获得新闻栏目级联选择器数据
 */
export function allNewsColumn() {
    return request({
        url: '/management/news/pub/allNewsColumn',
        method: 'get'
    })
}
