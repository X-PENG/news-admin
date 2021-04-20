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
                            <span> {{ authorInfo.time }}</span>
						    <span> 阅读：{{ authorInfo.count }}次</span>
						    <!-- <span>信息来源： 融媒体中心 </span>						 -->
                        </p>
						<span>文字：{{ authorInfo.articleSource }}</span><i>|</i>    
						<span>图片：{{ authorInfo.imgSource }}</span><i>|</i>    						  
						<span>编辑：{{ authorInfo.editors }}</span><i>|</i>    						
                        <span>审核：{{ authorInfo.reviewers }}</span>    						
                </el-col>
            </el-row> 

            <div class="peng-news-show-content" v-html="newsInfo.content">
            </div>

            <div class="articel-fragment-container">
                <el-divider>导读片段</el-divider>	
                <ArticelFragment :content="newsInfo.articleFragmentForShow"/>              		
            </div>
        </div> 
    </div>

</template>

<script>
import { isNumber } from '@/utils/validate'
import { getNewsInfo } from '@/utils/preview'
import { selectDraft } from '@/api/news/inputter'
import { selectNotDraftNews } from '@/api/news/publicService'
import ArticelFragment from './components/ArticelFragment'

/**
 * 预览新闻，需要查询新闻进行显示，
 * 规定：除了草稿要使用独立api查询，其他状态的新闻都使用公共的查询非草稿的api。
 * 因为，草稿是传稿人私有的，所以需要独立的查询草稿的api。
 */
const apiMap = {
    draft: selectDraft,//草稿对应的api是selectDraft
    notDraft: selectNotDraftNews//查询不是草稿的新闻的api
}

function getDefaultNewsInfo(){
    return {
        title: '',
        articleFragmentForShow: '',
        content: ''
    }
} 

    export default {
        name:'Preview',
        components: { ArticelFragment },
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
                },
                authorInfo: {
                    time: '0000-00-00',
                    count: 0,
                    articleSource: '',
                    imgSource: '',
                    editors: '',
                    reviewers: ''
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
             * 路由参数的含义：
             *      id参数，表示从后台查询哪个新闻；
             *      type参数，表示是查询草稿；不传type参数，表示查询非草稿新闻
             * @returns true：则从后台查询；false：则从LocalStorage中查询新闻。
             */
            judgeIsInitByQuertNews(){
                let queryParam = this.$route.query
                let id = queryParam['id']
                let type = queryParam['type']
                //有id，则可能要从后台查询新闻
                if(isNumber(id)) {
                    if(type) {
                        if(type === 'draft') {
                            //type为draft，表示要查询草稿
                            this.query.id = id
                            //查询api
                            this.query.queryApi = apiMap['draft']                            
                            return true
                        }else {
                            throw new Error("未知的type参数!")
                        }
                    }else {
                        //没有传递type，则需要查询不是草稿的新闻
                        this.query.id = id
                        //查询api
                        this.query.queryApi = apiMap['notDraft']                           
                        return true
                    }
                }
                //没有任何参数，就查询localStorage
                if(JSON.stringify(queryParam) === '{}'){
                    return false
                }

                throw new Error("路由参数异常!")
            },
            async initNews(){
                if(this.isInitByQueryNews === undefined) {
                    console.log('未知的初始化方式！')
                    return
                }
                
                //开始初始化
                this.loading = true
                if(!this.isInitByQueryNews){
                    //await等待查询完毕
                    this.newsInfo = await this.queryFromLocalStorage()
                }else {
                    //await等待查询完毕
                    this.newsInfo = await this.queryFromServer()
                }

                //填充作者信息
                this.authorInfo.time = this.newsInfo.showPubTime || this.authorInfo.time
                //阅读量 = 初始设置的阅读量 + 实际阅读量
                this.authorInfo.count = (this.newsInfo.initReadingCount || 0) + (this.newsInfo.realReadingCount || 0) 
                this.authorInfo.articleSource = this.newsInfo.articleSource || this.authorInfo.articleSource
                this.authorInfo.imgSource = this.newsInfo.imgSource || this.authorInfo.imgSource
                this.authorInfo.editors = this.format(this.newsInfo.editors || this.authorInfo.editors)
                this.authorInfo.reviewers = this.format(this.newsInfo.reviewers || this.authorInfo.reviewers)

                this.loading = false
            },
            //从localStorage中查询新闻
            queryFromLocalStorage() {
                return new Promise((resolve, reject) => {
                    console.log('查询localStorage进行初始化')
                    let news = getNewsInfo()
                    resolve(news)
                })
            },
            //从服务器获取新闻
            queryFromServer() {
                return new Promise((resolve, reject) => {
                    console.log('查询数据库进行初始化')
                    this.query.queryApi(this.query.id).then(resp => {
                        if(!resp) {
                            this.$message({
                                message: '加载失败！可能原因：新闻不存在或没有查询权限。',
                                type: 'error'
                            })
                            resolve({})//返回空对象
                        }else{
                            resolve(resp)
                        }
                    }).catch(errpr => {
                        this.$message({
                            message: '加载失败！',
                            type: 'error'
                        })
                        resolve({})//返回空对象
                    })                    
                })
            },
            //去掉字符串末尾的分隔符，比如：顿号
            format(str) {
                if(str) {
                    let c = str[str.length - 1]
                    if(c === '、') {
                        return str.substring(0, str.length - 1)
                    }
                }
                return str
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
.peng-news-show-container .articel-fragment-container {
    margin-top: 50px;
}
/* element-ui的分割线组件的css */
.articel-fragment-container .el-divider {
    background-color: #DCDFE6;
    position: relative;
    margin-bottom: 20px;
}
.articel-fragment-container .el-divider .el-divider__text {
    position: absolute;
    background-color: #FFF;
    padding: 0 20px;
    color: #303133;
    font-weight: 500;
    font-size: 0.9em;
}
</style>