/**
 * 预览新闻模块，撰写新闻页面和预览新闻页面要共享 新闻信息 ，通过localStorage实现共享
 */

export function saveNewsInfo(newsInfo){
    window.localStorage.setItem("newsForPreview", JSON.stringify(newsInfo))
}

export function getNewsInfo(){
    let newsInfo = window.localStorage.getItem("newsForPreview")
    if(!newsInfo){
        return { title: '', content: '' }
    }
    return JSON.parse(newsInfo)
} 


export function removeNewsInfo(){
    window.localStorage.removeItem("newsForPreview")
} 

/**
 * 跳转到预览新闻的页面
 * @param {*} router vue-router对象
 * @param {*} queryParam 查询字符串 
 */
export function jumpToPreviewPage(router, queryParam){
    /**
     * router.resolve函数的返回值是一个对象：
     *  {
    *       location: Location;
    *       route: Route;
    *       href: string;
     *  }
     */
    let routeUrl = router.resolve({
        path: "/news/preview",
        query: queryParam   
    });
    //for debug
    // console.log('跳转到预览页面')
    // console.log(routeUrl.href)//比如：#/news/preview?id=40&type=draft
    window.open(routeUrl.href, '_blank');  
}