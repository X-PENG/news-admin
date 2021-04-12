<template>
    <div class="preview-container">
        <div class="peng-news-show-container">
            <!-- 江财heahder -->
            <!-- <el-row>
                <el-col :span="24">
                    <p style="text-align:center; font-size:20px; font-weight:bold; color:#0066CC;"><span style="font-size:24px">{{ title }}</span></p>
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
                    <h3> {{ title }} </h3>		 					
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

            <div class="peng-news-show-content" v-html="content">
            </div>			
        </div> 
    </div>

</template>

<script>
import { getNewsInfo } from '@/utils/preview'

const title = '我校在校友会系列榜单中表现亮眼'
const content = `<p style="text-indent: 2em;">春风送暖，万物生辉。4月7日下午，省妇联二级巡视员李景芝等人到我校开展&ldquo;送奖到岗位到基层&rdquo;活动，为校工会授予&ldquo;全国巾帼文明岗&rdquo;奖牌。校党委书记卢福财、副校长刘小丽出席活动。</p><p style="text-align: center;"><img src="http://news.jxufe.edu.cn/uploadfile/82/1617935311802.jpg" alt="" width="640" height="361" /></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;春风送暖，万物生辉。4月7日下午，省妇联二级巡视员李景芝等人到我校开展&ldquo;送奖到岗位到基层&rdquo;活动，为校工会授予&ldquo;全国巾帼文明岗&rdquo;奖牌。校党委书记卢福财、副校长刘小丽出席活动。</p><p align="center"><img src="http://news.jxufe.edu.cn/uploadfile/82/1617935330085.jpg" alt="" width="640" height="427" /></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;卢福财对李景芝一行的到来表示热烈欢迎，向多年来重视关心支持&ldquo;巾帼文明岗&rdquo;创建工作的省妇联领导和同志们表示衷心感谢。他希望学校工会以此为契机，总结工会工作经验，再接再厉，更好地为全校教职员工服务。</p><p style="text-align: center;"><img src="http://news.jxufe.edu.cn/uploadfile/82/1617935323229.jpg" /></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;省妇联为我校颁发&ldquo;全国巾帼文明岗&rdquo;奖牌。</p><p style="text-align: center;"><img src="http://news.jxufe.edu.cn/uploadfile/82/1617935316371.jpg" /></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;李景芝代表省妇联对校工会取得的优异成绩给予充分肯定，希望校工会作为先进集体能继续发挥好带头示范作用，引领全校女职工在各自的岗位上努力奋斗，书写人生美好篇章。</p><p style="text-align: center;"><img src="http://news.jxufe.edu.cn/uploadfile/82/Attachment/c954a0b2b1.jpg" /></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;授牌仪式结束后，江西省妇联女科技工作者协会（简称&ldquo;省女科协&rdquo;）七届二次理事会召开。</p><p style="text-align: center;"><img src="http://news.jxufe.edu.cn/uploadfile/82/Attachment/432deb8426.jpg" /></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;刘小丽对省女科协七届二次理事会在我校举行表示祝贺，对省女科协一直以来对我校的关心和支持表示衷心感谢，并预祝会议取得圆满成功。</p><p>　　会后，与会人员参观了图书馆。校工会、女工委代表、省妇联组联部同志们参加了此次活动。（文/唐磊雯&nbsp; 图/刘建芳&nbsp; 编辑/姜莹&nbsp; 范毅洲）</p>`

    export default {
        name:'Preview',
        data() {
            return {
                title: '',
                content: ''
            }
        },
        created(){
            this.initNews()
        },
        methods: {
            initNews(){
                console.log('初始化新闻')
                let news = getNewsInfo()
                this.title = news.title
                this.content = news.content
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