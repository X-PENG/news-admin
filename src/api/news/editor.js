import request from '@/utils/request'

/**
 * 编辑人员相关API
 */


export function transitNewsList(queryParam) {
    return request({
        url: '/management/news/transit/',
        method: 'get',
        params: queryParam
    })
}

/**
 * 查询所有中转状态，用于新闻状态下拉菜单
 * @returns
 */
export function transitStatusList() {
    return request({
        url: '/management/news/transit/transitStatusList',
        method: 'get'
    })
}

/**
 * 查询用户下拉菜单的数据
 * @returns 
 */
export function userSelectData() {
    return request({
        url: '/management/news/transit/userSelectData',
        method: 'get'
    })   
}

/**
 * 查询一个中转状态的新闻
 * @param id 
 * @returns 
 */
export function selectTransitNews(newsId) {
    return request({
        url: `/management/news/transit/${newsId}`,
        method: 'get'
    })   
}

/**
 * 删除一个中转状态的新闻
 * @param id 
 * @returns 
 */
 export function deleteTransitNews(newsId) {
    return request({
        url: `/management/news/transit/${newsId}`,
        method: 'delete'
    })   
}

/**
 * 提交审核一个中转状态的新闻
 * @param id 
 * @returns 
 */
 export function submitTransitNewsToReview(newsId) {
    return request({
        url: `/management/news/transit/${newsId}`,
        method: 'put'
    })   
}

/**
 * 保存修改 或 保存并提交审核中转状态的新闻
 * @param tag 
 * @param newsInfo
 * @returns 
 */
 export function saveOrSaveAndSubmitReview(tag, newsInfo) {
    return request({
        url: `/management/news/transit/${tag}`,
        method: 'post',
        data: newsInfo
    })   
}

/**
 * 查询审核失败信息
 * @param newsId 
 */
export function queryReviewFailInfo(newsId){
    return request({
        url: `/management/news/transit/reviewFailInfo/${newsId}`,
        method: 'get'
    })
}


/**
 * 查询打回修改信息
 * @param newsId 
 */
 export function queryReModificationInfo(newsId){
    return request({
        url: `/management/news/transit/reModification/${newsId}`,
        method: 'get'
    })
}