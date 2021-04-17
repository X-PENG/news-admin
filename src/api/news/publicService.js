import request from '@/utils/request'

/**
 * 新闻管理的公共api接口，不管是传稿人、编辑、审核人员、发布人员都可以使用
 */

/**
 * 查询一个不是草稿的新闻，用于预览新闻
 * @param newsId 
 */
export function selectNotDraftNews(newsId) {
    return request({
        url: `/management/news/public/view/${newsId}`,
        method: 'get'
    })
}