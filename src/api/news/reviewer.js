import request from '@/utils/request'
/**
 * 审核人员相关api
 */

/**
 * 查询审核中的新闻
 * @param apiPathPrefix  api路径前缀。由于一审、二审、三审...的url接口不同
 * @param queryParam 
 * @returns 
 */
export function underReviewNewsList(apiPathPrefix, queryParam) {
    return request({
        url: `${apiPathPrefix}/`,
        method: 'get',
        params: queryParam
    })
}

/**
 * 查询用户下拉菜单的数据
 * @param apiPathPrefix 
 * @returns 
 */
export function userSelectData(apiPathPrefix) {
    return request({
        url: `${apiPathPrefix}/userSelectData`,
        method: 'get'
    })
}

/**
 * 查询一个审核中的新闻
 * @param apiPathPrefix 
 * @param newsId 
 */
export function selectUnderReviewNews(newsId, apiPathPrefix) {
    return request({
        url: `${apiPathPrefix}/${newsId}`,
        method: 'get'
    })
}

/**
 * 保存新闻 或 保存并通过审核新闻
 * @param apiPathPrefix api路径前缀
 * @param tag 1-保存修改；2-保存并通过审核；其他-非法请求
 * @param newsInfo 要保存的新闻信息
 */
export function saveOrSaveAndReviewSuccess(apiPathPrefix, tag, newsInfo) {
    return request({
        url: `${apiPathPrefix}/${tag}`,
        method: 'post',
        data: newsInfo
    })
}     

/**
 * 审核一个新闻
 * @param apiPathPrefix 
 * @param newsId 
 * @param reviewResult 
 */
export function reviewOneNews(apiPathPrefix, newsId, reviewResult) {
    return request({
        url: `${apiPathPrefix}/${newsId}`,
        method: 'put',
        data: reviewResult
    })
}



