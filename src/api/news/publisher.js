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

/**
 * 分页、条件查询已发布新闻列表
 * @param queryParam 
 */
export function publishedNewsList(queryParam) {
    return request({
        url: '/management/news/pub/published',
        method: 'get',
        params: queryParam
    })
}

/**
 * 查询用户下拉框数据
 * @returns 
 */
export function userSelectData() {
    return request({
        url: '/management/news/pub/userSelectData',
        method: 'get'
    })
}

/**
 * 撤销发布新闻
 * @param newsId 
 * @returns 
 */
export function revokePub(newsId) {
    return request({
        url: `/management/news/pub/revoke/${newsId}`,
        method: 'put'
    })
}

/**
 * 新闻是否轮播
 * @param newsId 
 * @param paramInfo 轮播设置信息
 * @returns 
 */
 export function carouselManage(newsId, paramInfo) {
    return request({
        url: `/management/news/pub/carousel/${newsId}`,
        method: 'put',
        data: paramInfo
    })
}

/**
 * 新闻是否设为头条
 * @param newsId 
 * @param tag  1:是 2：否 3：非法参数
 * @returns 
 */
 export function headlinesManage(newsId, tag) {
    return request({
        url: `/management/news/pub/headlines/${newsId}`,
        method: 'put',
        params: {
            tag
        }
    })
}

/**
 * 新闻是否置顶
 * @param newsId 
 * @param tag  1:是 2：否 3：非法参数
 * @returns 
 */
 export function topManage(newsId, tag) {
    return request({
        url: `/management/news/pub/top/${newsId}`,
        method: 'put',
        params: {
            tag
        }
    })
}