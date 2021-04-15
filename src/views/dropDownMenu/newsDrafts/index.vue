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
                    v-model="queryParam.imgSource"
                    placeholder="图片来源"
                    class="filter-item"
                />
            </el-col>
            <el-col :span="4">
            <el-input
                v-model="queryParam.articleSource"
                placeholder="文字来源"
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
            <!-- <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="success" icon="el-icon-message" circle></el-button>
            <el-button type="warning" icon="el-icon-star-off" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>               -->
          <el-button type="success" size="small" icon="el-icon-edit" @click="handleEdit">
            编辑
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-top" @click="handleUpload">
            上传草稿
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
            <el-table-column align="center" label="图片来源">
                <template slot-scope="scope">
                    {{ scope.row.imgSource }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="文字来源">
                <template slot-scope="scope">
                {{ scope.row.articleSource }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="外链">
                <template slot-scope="scope">
                {{ scope.row.externalUrl }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" :sortable='"custom"'>
                <template slot-scope="scope">
                {{ scope.row.createTime }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="最近修改时间">
                <template slot-scope="scope">
                {{ scope.row.latestEditTime }}
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
import Pagination from "@/components/Pagination";
import { draftList, uploadDraft, deleteDraft } from '@/api/news/inputter'
import { jumpToPreviewPage } from '@/utils/preview'

function getDefaultQueryParam() {
    //返回新对象
    return {
        page: 1,
        pageSize: 10,
        title: null,
        imgSource: null,
        articleSource: null,
        externalUrl: null,
        orderByCreateTime: null
    }
}

    export default {
        name:'NewsDrafts',
        components: { Pagination },
        data() {
            return {
                listLoading: true,
                data: {
                    total: 0,
                    current: 1,
                    size: 10,
                    records: [],                    
                },
                curOperatedRow: {},
                queryParam: getDefaultQueryParam(),   
                pageSizes: [5, 10, 15, 20],           
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
                draftList(this.queryParam).then((resp) => {
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
                    this.queryParam.orderByCreateTime = null
                    this.queryData()
                }else if(column.label === '创建时间') {
                    //按创建时间排序
                    this.queryParam.orderByCreateTime = (order === 'ascending')
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
                        message: '请选择要' + operateType + '的草稿',
                        type: 'warning'
                    })                
                    return undefined
                }
                return selectedNewId
            },
            handleEdit(){
                let selectedNewId = this.validateIfSelecteRow('编辑')
                if(selectedNewId){
                    this.$router.push( { name: '撰写新闻', query: {id: selectedNewId, type: 'draft' } } )
                }   
            },
            handleUpload(){
                let selectedNewId = this.validateIfSelecteRow('上传')
                if(selectedNewId){
                    this.$confirm(`你确定上传标题为【${this.curOperatedRow.title}】的草稿吗？`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "info",
                    }).then(() => {
                        uploadDraft(selectedNewId).then(resp => {
                            //重新查询列表
                            this.queryData()
                        })
                    }).catch(() => {
                        this.$message({
                            message: '取消上传',
                            type: 'info'
                        })
                    }) 
                }                
            },
            handleRemove(){
                let selectedNewId = this.validateIfSelecteRow('删除')
                if(selectedNewId){
                    this.$confirm(`你确定删除标题为【${this.curOperatedRow.title}】的草稿吗？`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }).then(() => {
                        deleteDraft(selectedNewId).then((resp) => {
                            // 重新查询数据
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
                        jumpToPreviewPage(this.$router, {id: selectedNewId, type: 'draft'})
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