<template>
<!-- <transition name="suggestion-box-transition"> -->
    <div class="peng-suggestion-box" v-loading="loading">
        <aside>
            <el-row :gutter="10" type="flex" align="middle">
                <el-col :span="1">
                    <i class="el-alert__icon el-icon-warning is-big"></i>
                </el-col>
                <el-col :span="23">
                    <el-row class="suggestion-header">
                        <el-row class="suggestion-header">
                            <el-row>
                                <span class="title">{{ title }}</span>
                            </el-row>
                            <el-row v-if="title === '审核失败'">
                                <span>轮次：{{ showInfo.epoch }}</span>
                                <span>审核人：{{ showInfo.reviewer.realName }}</span> 
                                <span>审核时间：{{ showInfo.reviewTime }}</span>
                            </el-row> 
                            <el-row v-if="title === '打回修改'">
                                <span>操作人：{{ showInfo.operator.realName }}</span> 
                                <span>操作时间：{{ showInfo.operateTime }}</span>
                            </el-row>                                                        
                        </el-row>
                        
                        <el-row>
                            {{ showInfo.suggestion }}
                        </el-row>
                    </el-row>
                </el-col>
            </el-row>
        </aside>    
    </div>
<!-- </transition> -->
</template>

<script>
import { queryReviewFailInfo, queryReModificationInfo } from '@/api/news/editor'

/**
 * title和查询信息api的映射
 */
const titleMapApi = {
    '审核失败': queryReviewFailInfo,
    '打回修改': queryReModificationInfo
}

    export default {
        name:'SuggestionBox',
        props: {
            title: {
                type: String,
                default: null
            },
            newsId: {
                type: Number,
                default: null
            }
        },
        data() {
            return {
                loading: false,
                showInfo: {
                    epoch: '',
                    reviewer: {
                        realName: ''
                    },
                    reviewTime:'',
                    suggestion: '',
                    operator:{
                        realName: ''
                    },
                    operateTime:''

                }
            }
        },
        created() {
            this.loading=true
            //查询信息
            titleMapApi[this.title](this.newsId).then(resp => {
                this.showInfo = resp
                this.loading=false
            }).catch(error => {
                this.loading=false
            })
        },
    }
</script>

<style lang="scss" scoped>

/* 动画 */
//  .suggestion-box-transition-leave-active {
//     transition: opacity 0.5s
// }
//  .suggestion-box-transition-leave-to{
//     opacity: 0
// }
.suggestion-header {
    margin-top: 10px;
    margin-bottom: 10px;
}
.suggestion-header span {
    font-size: 0.8em;
    margin-right: 10px;
}
.suggestion-header .title {
    font-size: 1em;
    font-weight: bold;
}
aside {
    background-color: #fdf6ec;
    color: #E6A23C;
    padding: 8px 24px;
    margin-bottom: 20px;
    border-radius: 2px;
    display: block;
    line-height: 1.5em;
    font-size: 1em;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

  a {
    color: #337ab7;
    cursor: pointer;

    &:hover {
      color: rgb(32, 160, 255);
    }
  }
}
.peng-suggestion-box .el-alert__description {
    line-height: 32px;
    font-size: 16px;
}
</style>