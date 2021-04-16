<template>
    <div class="app-container">
        <!-- 搜索栏 -->
        <div class="filter-container">
        <el-row :gutter="15">
            <el-col :span="6">
                <el-input
                    v-model="queryParam.title"
                    placeholder="标题"
                    class="filter-item"
                />
            </el-col>
            <el-col :span="4">
                <el-input
                    v-model="queryParam.externalUrl"
                    placeholder="外链"
                    class="filter-item"
                />
            </el-col>
            <el-col :span="4">
                <el-select
                    v-model="queryParam.submitterId"
                    placeholder="送审人"
                    clearable
                    @clear='clearSubmitter'
                    class="filter-item"
                    :loading="loadingForUserSelect"
                    @visible-change="remoteSearchUserList"
                >
                    <el-option
                        v-for="item in userList"
                        :key="'送审人' + item.id"
                        :label="item.realName"
                        :value="item.id">
                    </el-option>
                </el-select> 
            </el-col>            
            <el-col :span="4">
            <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleFilter"
            >
                搜索
            </el-button>
            <el-button
                type="primary"
                icon="el-icon-refresh"
                @click="resetFilter"
            >
                重置
            </el-button>
            </el-col>
        </el-row>
        </div>
    <!-- 操作按钮组 -->
    <el-row class="oprerate-btn-group">
        <el-col :span="24">
          <el-button type="success" size="small" icon="el-icon-edit" @click="handleEdit">
            编辑
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-check" @click="handleReviewSuccess">
            审核成功
          </el-button>
          <el-button type="danger" size="small" icon="el-icon-close" @click="handleReviewFail">
            审核失败
          </el-button>
          <el-button type="warning" size="small" icon="el-icon-view" @click="handlePreview">
            预览
          </el-button>           
        </el-col>
    </el-row>


        <el-table
        v-loading="listLoading"
        :data="data.records"
        @sort-change="handleSortChange"
        @current-change="handleTableCurRowChange"
        stripe
        border
        fit
        highlight-current-row
        style="width: 100%"
        >
            <el-table-column align="center" label="序号" width="95">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="标题">
                <template slot-scope="scope">
                    {{ scope.row.title }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="外链">
                <template slot-scope="scope">
                {{ scope.row.externalUrl }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="送审人">
                <template slot-scope="scope">
                {{ scope.row.submitter && scope.row.submitter.realName }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="送审时间" :sortable='"custom"'>
                <template slot-scope="scope">
                {{ scope.row.submitTime }}
                </template>
            </el-table-column>                        
            <el-table-column align="center" label="最近修改的用户">
                <template slot-scope="scope">
                {{ scope.row.latestEditor && scope.row.latestEditor.realName }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="最近修改时间" :sortable='"custom"'>
                <template slot-scope="scope">
                {{ scope.row.latestEditTime }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="上轮审核时间" v-if="curReviewLevel != 1" :sortable='"custom"'>
                <template slot-scope="scope">
                {{ scope.row.previousEpochReviewPassTime }}
                </template>
            </el-table-column>
        </el-table>

        <!--
    .sync是一个语法糖。:page.sync="data.current"相当于：:page="data.current" @update:page="data.current=$event"
    -->
        <pagination
        v-show="data.total > 0"
        :total="data.total"
        :page="data.current"
        :limit="data.size"
        :pageSizes="pageSizes"
        @pagination="handlePagination"
        />

        <SuggestionDialog 
            :showDialog.sync="suggestionDialogObj.visible" 
            :title="suggestionDialogObj.title" 
            :suggestion.sync="suggestionDialogObj.suggestion"
            @complete-suggest="completeSuggest"
        />


    </div>
</template>

<script>
import Pagination from "@/components/Pagination"
import SuggestionDialog from '@/components/SuggestionDialog'
import { underReviewNewsList, userSelectData, reviewOneNews } from '@/api/news/reviewer'
import { jumpToPreviewPage } from '@/utils/preview'
/**
 * 审核等级和api路径前缀的映射。
 * 
 * 因为1、2、3..审的审核人员由于角色不同，对应的url接口也不相同，
 * 但是所有审核人员具有的功能都是一样的，所以不管是一审、二审..人员，他们对应的组件 都是本组件！
 * 但是由于不同审核人员对应的url接口不同，所以需要进行映射。
 * 
 * 当前最多只支持6审
 */
export const reviewLevelMapApiPathPrefix = {
    1: '/management/news/review/1',
    2: '/management/news/review/2',
    3: '/management/news/review/3',
    4: '/management/news/review/4',
    5: '/management/news/review/5',
    6: '/management/news/review/6',
}

function getDefaultQueryParam() {
    //返回新对象
    return {
        page: 1,
        pageSize: 10,
        title: null,
        externalUrl: null,
        submitterId: null,
        orderByLatestEditTime: null,
        orderByPreviousEpochReviewPassTime: null,
        orderBySubmitTime: null
    }
}

    export default {
        name:'NewsReview',
        components: { Pagination, SuggestionDialog },
        data() {
            return {
                listLoading: false,
                loadingForUserSelect: false,
                data: {
                    total: 0,
                    current: 1,
                    size: 10,
                    records: [],                    
                },
                curOperatedRow: {},
                queryParam: getDefaultQueryParam(),   
                pageSizes: [5, 10, 15, 20],
                //用户下拉菜单数据
                userList: [],
                //新闻审核结果
                reviewResult: {
                    reviewSuccess: undefined,
                    suggestion: undefined
                },
                //意见对话框的状态对象
                suggestionDialogObj: {
                    visible: false,
                    title: '审核失败',
                    suggestion: ''
                }                           
            }
        },
        computed:{
            //当前审核等级：1,2,3...，由路由决定
            curReviewLevel(){
                let path = this.$route.path
                return path.substring(path.lastIndexOf('/')+1, path.length)
            }
        },        
        mounted(){
            this.init();
        },
        methods: {
            init() {
                this.queryData();
            },
            //分页、条件查询数据
            queryData() {
                this.listLoading = true;
                console.log('当前审核等级对应的api路径前缀')
                console.log(reviewLevelMapApiPathPrefix[this.curReviewLevel])
                underReviewNewsList(reviewLevelMapApiPathPrefix[this.curReviewLevel], this.queryParam).then((resp) => {
                    this.listLoading = false;
                    this.data = resp;
                }).catch(error => {
                    this.listLoading = false;
                    this.$message({
                        message: '加载失败，未知异常！',
                        type: "error"
                    })       
                });
            },
            handlePagination({ page, limit }) {
                this.queryParam.page = page;
                this.queryParam.pageSize = limit;
                this.queryData();
            },
            remoteSearchUserList(visible){
                //如果没有查询过用户列表，就查询
                if(this.userList.length === 0 && visible){
                    this.loadingForUserSelect = true
                    userSelectData(reviewLevelMapApiPathPrefix[this.curReviewLevel]).then(resp => {
                        this.userList = resp
                        this.loadingForUserSelect = false
                    }).catch(error => {
                        this.$message({
                            message: '加载用户列表失败！',
                            type: 'error'    
                        })
                        this.loadingForUserSelect = false
                    })
                }
            },                 
            clearSubmitter(){
                this.queryParam.submitterId = null
            },      
            handleFilter(){
                //搜索，从第1页开始
                this.queryParam.page = 1
                this.queryData();
            },
            resetFilter(){
                this.queryParam = getDefaultQueryParam();
            },
            /**
             * order有三个值：ascending、descending和null
             */
            handleSortChange({ column, prop, order }){
                //首先，都设为null
                this.queryParam.orderByLatestEditTime = null
                this.queryParam.orderByPreviousEpochReviewPassTime = null
                this.queryParam.orderBySubmitTime = null
                
                if(order) {
                    if(column.label === '最近修改时间') {
                        //按录入完成时间排序
                        this.queryParam.orderByLatestEditTime = (order === 'ascending')
                    }else if(column.label === '送审时间') {
                        this.queryParam.orderBySubmitTime = (order === 'ascending')
                    }else if(column.label === '上轮审核时间') {
                        this.queryParam.orderByPreviousEpochReviewPassTime = (order === 'ascending')
                    }
                }
                this.queryData()
            },
            handleTableCurRowChange(currentRow, oldCurrentRow){
                this.curOperatedRow = currentRow
            },
            //验证是否选择了新闻，并返回选择的新闻的id
            validateIfSelecteRow(operateType) {
                let selectedNewId = this.curOperatedRow && this.curOperatedRow.id
                if(!selectedNewId) {
                    this.$message({
                        message: '请选择要' + operateType + '的新闻',
                        type: 'warning'
                    })                
                    return undefined
                }
                return selectedNewId
            },
            handleEdit(){
                let selectedNewId = this.validateIfSelecteRow('编辑')
                if(selectedNewId){
                    this.$router.push( { name: '撰写新闻', query: {id: selectedNewId, type: 'review', reviewLevel: this.curReviewLevel } } )
                }   
            },
            handleReviewSuccess(){
                let selectedNewId = this.validateIfSelecteRow('操作')
                if(selectedNewId) {
                    this.$confirm(`你确定标题为【${this.curOperatedRow.title}】的新闻通过审核吗？`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }).then(() => {
                        //先重置审核结果
                        this.reviewResult.reviewSuccess = null
                        this.reviewResult.suggestion = null 
                        //设置审核结果
                        this.reviewResult.reviewSuccess = true
                        this.reviewResult.suggestion = null
                        reviewOneNews(reviewLevelMapApiPathPrefix[this.curReviewLevel], selectedNewId, this.reviewResult).then(resp => {
                            //审核成功，重新查询列表数据
                            this.queryData()
                        })                        
                    }).catch(() => {
                        this.$message({
                            message: '取消审核',
                            type: 'info'
                        })
                    })                     
                }
            },
            completeSuggest(){
                this.$confirm(`你确定打回标题为【${this.curOperatedRow.title}】的新闻吗？`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    //先重置审核结果
                    this.reviewResult.reviewSuccess = null
                    this.reviewResult.suggestion = null 
                    //设置审核结果
                    this.reviewResult.reviewSuccess = false
                    this.reviewResult.suggestion = this.suggestionDialogObj.suggestion
                    reviewOneNews(reviewLevelMapApiPathPrefix[this.curReviewLevel], this.curOperatedRow.id, this.reviewResult).then(resp => {
                        this.suggestionDialogObj.visible = false
                        //操作成功，重新查询列表数据
                        this.queryData()
                    })                        
                }).catch(() => {
                    this.$message({
                        message: '取消审核',
                        type: 'info'
                    })
                })                 
            },
            handleReviewFail(){
                let selectedNewId = this.validateIfSelecteRow('操作')
                if(selectedNewId) {
                    //重置对话框状态
                    this.suggestionDialogObj = { visible: false, title: '审核失败', suggestion: '' }       
                    //然后，弹出意见填写对话框
                    this.suggestionDialogObj.visible=true
                }
            },
            
            handlePreview(){
                let selectedNewId = this.validateIfSelecteRow('预览')
                if(selectedNewId){
                    let externalUrl = this.curOperatedRow.externalUrl
                    if(externalUrl) {
                        //如果设置了外链，就跳转到外网
                        window.open(externalUrl, '_blank'); 
                    }else {
                        //预览id为selectedNewId的新闻
                        jumpToPreviewPage(this.$router, {id: selectedNewId, type: 'review', reviewLevel: this.curReviewLevel})
                    }
                }
            }
        }        
    }
</script>

<style>
.el-table th.gutter {
  display: table-cell !important;
}
</style>