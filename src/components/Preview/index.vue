<template>
    <div class="preview-container">
        <div class="peng-news-show-container" v-loading='loading'>
            <!-- 江财heahder -->
            <!-- <el-row>
                <el-col :span="24">
                    <p style="text-align:center; font-size:20px; font-weight:bold; color:#0066CC;"><span style="font-size:24px">{{ newsInfo.title }}</span></p>
                </el-col>
                <el-col :span="24">
                    <p style="text-align:center; height:28px; line-height:28px; background:#F0F0F0; border:1px dashed #CCCCCC; margin-top:5px;">
                            日期：2021-04-10 16:49:05　　
                            文章点击数：<span id="dr_show_hits_108788">2606</span>
                            稿源：      
                    </p>           
                </el-col>
            </el-row>             -->

            <el-row class="peng-news-show-header">
                <el-col :span="24" class="articleTitle">
                    <h3> {{ newsInfo.title }} </h3>		 					
                </el-col>
                <el-col :span="24" class="articleAuthor">
						<p>
                            <span> 2021/03/23</span>
						    <span> 阅读：6796次</span>
						    <span>信息来源： 融媒体中心 </span>						
                        </p>
						<span>文字：韩芳</span><i>|</i>    
						<span>摄影：王天天、李香花、刘月玲、夏子然</span><i>|</i>    						  
						<span>编辑：悠然</span><i>|</i>    						
                        <span>责编：山石</span>    						
                </el-col>
            </el-row> 

            <div class="peng-news-show-content" v-html="newsInfo.content">
            </div>			
        </div> 
    </div>

</template>

<script>
import { isNumber } from '@/utils/validate'
import { getNewsInfo } from '@/utils/preview'
import { selectDraft } from '@/api/news/inputter'
import { selectTransitNews } from '@/api/news/editor'
import { reviewLevelMapApiPathPrefix } from '@/views/news/review/index'
import { selectUnderReviewNews } from '@/api/news/reviewer'


const apiMap = {
    draft: selectDraft,//草稿对应的api是selectDraft
    transit: selectTransitNews,//查询中转状态的新闻的api
    review: selectUnderReviewNews,//查询审核中的新闻
}

function getDefaultNewsInfo(){
    return {
        title: '',
        content: ''
    }
} 

    export default {
        name:'Preview',
        data() {
            return {
                loading: false,
                newsInfo: getDefaultNewsInfo(),
                //进入预览组件时的初始路由查询字符串，防止用户手动更改路由
                initRouteQueryParam: undefined,
                //如果是查询新闻进行显示，就封装新闻id和对应的api函数
                query: {
                    id: null,
                    queryApi: null,
                    //调用api的额外参数
                    apiExtraParam: null
                }
            }
        },
        computed: {
            //是否从后台查询新闻进行初始化
            isInitByQueryNews: {
                get(){
                    try{
                       return this.judgeIsInitByQuertNews()
                    }catch(e){
                        this.$message({
                            message: e,
                            type: 'error'
                        })
                        //返回undefined表示异常，则不进行初始化
                        return undefined
                    }
                }
            }
        },
        watch: {
            //监听路由的变化，不允许用户手动修改路由参数
            $route(newRoute){
                //新路由的查询字符串
                let newRouterQueryStr = JSON.stringify(newRoute.query)
                //如果用户手动修改了路由参数，那就报错，并回到之前的路由
                if(this.initRouteQueryParam !== newRouterQueryStr) {
                    //报错，但显示的内容不变
                    this.$message({
                        message: '禁止用户手动更改路由参数！',
                        type: 'error'
                    })
                    //回到原来的路由
                    this.$router.back()
                }
                return                
            }
        },
        created() {
            //保存初始路由的查询字符串
            this.initRouteQueryParam = JSON.stringify(this.$route.query)
            this.initNews()
        },
        methods: {
            /**
             * 判断是从后台查询新闻进行初始化，还是从localStorage中查询新闻进行初始化。
             * id参数，表示从后台查询哪个新闻；
             * type参数，表示是查询草稿、中转还是审核状态的新闻
             */
            judgeIsInitByQuertNews(){
                let queryParam = this.$route.query
                let id = queryParam['id']
                let type = queryParam['type']
                let reviewLevel = queryParam['reviewLevel']
                //有id、有type，就查询数据库
                if(id && type) {
                    //必须满足参数规范
                    if(type === 'draft'|| type === 'transit') {
                        this.query.id = id
                        //查询api
                        this.query.queryApi = apiMap[type]
                        return true
                    }else if(type === 'review' && isNumber(reviewLevel)){
                        this.query.id = id
                        //查询api
                        this.query.queryApi = apiMap[type]
                        this.query.apiExtraParam = reviewLevelMapApiPathPrefix[reviewLevel]
                        return true                        
                    }else{
                        throw new Error("未知的type参数!")
                    }
                }
                //没有任何参数，就查询localStorage
                if(JSON.stringify(queryParam) === '{}'){
                    return false
                }

                throw new Error("路由参数异常!")
            },
            initNews(){
                if(this.isInitByQueryNews === undefined) {
                    console.log('未知的初始化方式！')
                    return
                }
                
                //开始初始化
                this.loading = true
                if(!this.isInitByQueryNews){
                    console.log('查询localStorage进行初始化')
                    this.newsInfo = getNewsInfo()
                    this.loading = false
                }else {
                    console.log('查询数据库进行初始化')
                    this.query.queryApi(this.query.id, this.query.apiExtraParam).then(resp => {
                        if(!resp) {
                            this.$message({
                                message: '加载失败！可能原因：新闻不存在或没有查询权限。',
                                type: 'error'
                            })
                            this.loading = false
                            return
                        }
                        this.newsInfo = resp
                        this.loading = false
                    }).catch(errpr => {
                        this.$message({
                            message: '加载失败！',
                            type: 'error'
                        })
                        this.loading = false
                    })
                }
            }
        },
    }
</script>

<style>
.preview-container * {
    padding: 0;
    margin: 0;
}
.preview-container {
    display: flex;
    justify-content: center;  
    flex-wrap: wrap;
    background: url(http://news.jxufe.edu.cn/statics/news/images/bg.gif) repeat-x #e4f1f9;
    min-height: 100%;
}
.peng-news-show-container {
    width: 65%;
    padding: 30px 20px;;
    border:1px solid #c8d8e7;
    background:#FFFFFF;
}
.peng-news-show-header {
    margin-bottom:35px;
}
.articleTitle {
    color: #000;
    line-height: 26px;
    padding: 0 0 25px;
    height: auto;
    font-family: 'Microsoft YaHei',SimSun,SimHei ,"STHeiti Light",STHeiti,"Lucida Grande", Tahoma,Arial, Helvetica, sans-serif;    
}
.articleTitle h3 {
    font-size: 26px;
    line-height: 36px;
    font-weight: normal;
}
.articleAuthor {
    padding: 10px 0 10px 10px;
    color: #646464;
    font-size: 13px;
    border-left: 5px solid #dbdbdb;
}
.articleAuthor span {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    margin: 0 10px;
    color: #646464;
}
.articleAuthor i {
    font-style: normal;
    color: #646464;
}
.peng-news-show-content{
    font-size: 1em;
    font-family: Arial, Helvetica, sans-serif,微软雅黑;
    color: #292929;
    line-height: 2em;
}
.peng-news-show-content img{
    min-width: 70%;
    max-width: 70%;
    height: auto;
}
</style>