<template>
    <div class="app-container">
        <!-- 搜索栏 -->
        <div class="filter-container">
        <el-row :gutter="10">
            <el-col :span="6">
                <el-input
                    v-model="queryParam.title"
                    placeholder="标题"
                    size="small"
                    class="filter-item"
                />
            </el-col>
            <el-col :span="4">
                <el-input
                    v-model="queryParam.externalUrl"
                    placeholder="外链"
                    size="small"
                    class="filter-item"
                />
            </el-col>
            <el-col :span="3">
                <el-input
                    v-model="queryParam.participateEditor"
                    placeholder="参与编辑的人"
                    size="small"
                    class="filter-item"
                />
            </el-col>            
            <el-col :span="2">
                <el-select
                    v-model="queryParam.newsStatus"
                    placeholder="状态"
                    clearable
                    @clear='clearStatus'
                    class="filter-item"
                    size="small"
                    :loading="loadingForStatusSelect"
                    @visible-change="remoteSearchStatusList"
                >
                    <el-option
                        v-for="item in newsStatusList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                </el-select>                
            </el-col>    
            <el-col :span="2">
                <el-select
                    v-model="queryParam.inputterId"
                    placeholder="录入人"
                    clearable
                    @clear='clearInputter'
                    class="filter-item"
                    size="small"
                    :loading="loadingForUserSelect"
                    @visible-change="remoteSearchUserList"
                >
                    <el-option
                        v-for="item in userList"
                        :key="'录入人' + item.id"
                        :label="item.realName"
                        :value="item.id">
                    </el-option>
                </el-select>               
            </el-col> 
            <el-col :span="3">
                <el-select
                    v-model="queryParam.latestEditorId"
                    placeholder="最近修改用户"
                    clearable
                    @clear='clearLatestEditor'
                    class="filter-item"
                    size="small"
                    :loading="loadingForUserSelect"
                    @visible-change="remoteSearchUserList"                    
                >
                    <el-option
                        v-for="item in userList"
                        :key="'最近修改用户' + item.id"
                        :label="item.realName"
                        :value="item.id">
                    </el-option>
                </el-select>                
            </el-col>                                 
            <el-col :span="4">
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="small"
                    @click="handleFilter"
                >
                    搜索
                </el-button>
                <el-button
                    type="primary"
                    icon="el-icon-refresh"
                    size="small"
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
          <el-button type="primary" size="small" icon="el-icon-check" @click="handleSubmitToReview">
            提交审核
          </el-button>
          <el-button type="warning" size="small" icon="el-icon-view" @click="handlePreview">
            预览
          </el-button>  
          <el-button type="danger" size="small" icon="el-icon-delete" @click="handleRemove">
            删除
          </el-button>            
        </el-col>
    </el-row>


        <el-table
        v-loading="listLoading"
        :data="data.records"
        @sort-change="handleSortChange"
        @current-change="handleTableCurRowChange"
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
            <el-table-column align="center" label="新闻状态">
                <template slot-scope="scope">
                    <el-tag :type="eTagTypeMap[scope.row.newsStatus.name]" style="font-size: 1em">
                        {{ scope.row.newsStatus.name }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="参与编辑者">
                <template slot-scope="scope">
                {{ formatEditors(scope.row.editors) }}
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
            <el-table-column align="center" label="录入者">
                <template slot-scope="scope">
                {{ scope.row.inputter.realName }}
                </template>
            </el-table-column>                      
            <el-table-column align="center" label="录入完成时间">
                <template slot-scope="scope">
                {{ scope.row.completeInputTime }}
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
    </div>
</template>

<script>
import Pagination from "@/components/Pagination"
import { jumpToPreviewPage } from '@/utils/preview'
import { transitNewsList, transitStatusList, userSelectData, deleteTransitNews, submitTransitNewsToReview } from '@/api/news/editor'

/**
 * 默认的查询参数
 */
function getDefaultQueryParam() {
    //返回新对象
    return {
        page: 1,
        pageSize: 10,
        title: null,
        externalUrl: null,
        newsStatus: null,
        inputterId: null,
        latestEditorId: null,
        participateEditor: null,
        orderByLatestEditTime: null
    }
}

const editors_seperator = "、";

    export default {
        name:'NewsTransit',
        components: { Pagination },
        data() {
            return {
                listLoading: true,
                loadingForStatusSelect: false,
                loadingForUserSelect: false,
                data: {
                    total: 0,
                    current: 1,
                    size: 10,
                    records: [],                    
                },
                //新闻状态下拉菜单数据
                newsStatusList: [],
                //用户下拉菜单数据
                userList: [],
                curOperatedRow: {},
                queryParam: getDefaultQueryParam(),   
                pageSizes: [5, 10, 15, 20],   
                //新闻状态和tag标签类型的映射 
                eTagTypeMap: {
                    '上传成功': 'success',
                    '审核失败': 'danger',
                    '打回修改': 'warning',
                }              
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            init() {
                this.queryData();
            },       
            //分页、条件查询新闻列表
            queryData() {
                this.listLoading = true;
                transitNewsList(this.queryParam).then((resp) => {
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
            //处理分页事件
            handlePagination({ page, limit }) {
                this.queryParam.page = page;
                this.queryParam.pageSize = limit;
                this.queryData();
            },  
            remoteSearchStatusList(visible){
                //如果没有查询过状态列表，就查询
                if(this.newsStatusList.length === 0 && visible){
                    this.loadingForStatusSelect = true
                    transitStatusList().then(resp => {
                        this.newsStatusList = resp
                        this.loadingForStatusSelect = false
                    }).catch(error => {
                        this.$message({
                            message: '加载状态列表失败！',
                            type: 'error'    
                        })
                        this.loadingForStatusSelect = false
                    })
                }
            },  
            remoteSearchUserList(visible){
                //如果没有查询过用户列表，就查询
                if(this.userList.length === 0 && visible){
                    this.loadingForUserSelect = true
                    userSelectData().then(resp => {
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
            clearStatus(){
                this.queryParam.newsStatus = null
            },   
            clearInputter(){
                this.queryParam.inputterId = null
            },
            clearLatestEditor(){
                this.queryParam.latestEditorId = null
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
                //只要order没值，就按默认排序
                if(!order){
                    this.queryParam.orderByLatestEditTime = null
                    this.queryData()
                }else if(column.label === '最近修改时间') {
                    //按录入完成时间排序
                    this.queryParam.orderByLatestEditTime = (order === 'ascending')
                    this.queryData()
                }
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
                    this.$router.push( { name: '撰写新闻', query: {id: selectedNewId, type: 'transit' } } )
                }   
            },
            handleSubmitToReview(){
                let selectedNewId = this.validateIfSelecteRow('提交')
                if(selectedNewId){
                    this.$confirm(`你确定提交标题为【${this.curOperatedRow.title}】的新闻吗？`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "info",
                    }).then(() => {
                        submitTransitNewsToReview(selectedNewId).then(resp => {
                            //重新查询新闻列表
                            this.queryData()
                        })
                    }).catch(() => {
                        this.$message({
                            message: '取消提交',
                            type: 'info'
                        })
                    }) 
                }                
            },
            handleRemove(){
                let selectedNewId = this.validateIfSelecteRow('删除')
                if(selectedNewId){
                    this.$confirm(`你确定永久删除标题为【${this.curOperatedRow.title}】的新闻吗？`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }).then(() => {
                        deleteTransitNews(selectedNewId).then(resp => {
                            //重新查询新闻列表
                            this.queryData()
                        })
                    }).catch(() => {
                        this.$message({
                            message: '取消删除',
                            type: 'info'
                        })
                    })                    
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
                        //预览id为selectedNewId的草稿
                        jumpToPreviewPage(this.$router, {id: selectedNewId, type: 'transit'})
                    }
                }
            },
            //格式化编辑者用户列表
            formatEditors(editors) {
                if(editors[editors.length - 1] === editors_seperator) {
                    return editors.substring(0, editors.length - 1)
                }
                return editors
            }                      
        }
    }
</script>

<style>
.el-table th.gutter {
  display: table-cell !important;
}
</style>