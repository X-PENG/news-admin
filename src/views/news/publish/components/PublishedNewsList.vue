<template>
    <div class="app-container">
        <!-- 搜索栏 -->
        <div class="filter-container">
            <el-row :gutter="5">
                <el-col :span="5">
                    <el-input
                        v-model="queryParam.title"
                        placeholder="标题"
                        class="filter-item"
                    />
                </el-col>
                <el-col :span="3">
                    <el-input
                        v-model="queryParam.externalUrl"
                        placeholder="外链"
                        class="filter-item"
                    />
                </el-col>                
                <el-col :span="3">
                    <el-cascader
                        v-model="queryParam.columnId"
                        v-loading="loadingForNewsColumnCascader"
                        clearable
                        placeholder="新闻栏目"
                        :options="newsColumns"
                        :props="newsColumnCascaderProps"
                        @visible-change="handleCascaderVisibleChange"
                        tabindex="1"
                    >
                    </el-cascader>               
                </el-col>            
                <el-col :span="2">
                    <el-select
                        v-model="queryParam.publisherId"
                        placeholder="发布人"
                        clearable
                        @clear="queryParam.publisherId=null"
                        class="filter-item"
                        :loading="loadingForUserSelect"
                        @visible-change="remoteSearchUserList"
                    >
                        <el-option
                            v-for="item in userList"
                            :key="'发布人' + item.id"
                            :label="item.realName"
                            :value="item.id">
                        </el-option>
                    </el-select>               
                </el-col>   
                <el-col :span="2">
                    <el-select
                        v-model="queryParam.isTop"
                        placeholder="置顶"
                        clearable
                        @clear="queryParam.isTop=null"
                        class="filter-item"
                    >
                        <el-option label="是" :value="true"></el-option>
                        <el-option label="否" :value="false"></el-option>
                    </el-select>               
                </el-col>
                <el-col :span="2">
                    <el-select
                        v-model="queryParam.isCarousel"
                        placeholder="轮播"
                        clearable
                        @clear="queryParam.isCarousel=null"
                        class="filter-item"
                    >
                        <el-option label="是" :value="true"></el-option>
                        <el-option label="否" :value="false"></el-option>
                    </el-select>                  
                </el-col>
                <el-col :span="2">
                    <el-select
                        v-model="queryParam.isHeadlines"
                        placeholder="头条"
                        clearable
                        @clear="queryParam.isHeadlines=null"
                        class="filter-item"
                    >
                        <el-option label="是" :value="true"></el-option>
                        <el-option label="否" :value="false"></el-option>
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
          <el-button type="warning" size="small" icon="el-icon-view" @click="handlePreview">
            预览
          </el-button>           
          <el-button type="danger" :loading="loadingForRevokeBtn" size="small" icon="el-icon-refresh-left" @click="handleRevokePub">
            撤销发布
          </el-button>
        </el-col>
    </el-row>

        <el-table
        v-loading="listLoading"
        :data="data.records"
        row-key="id"
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
            <el-table-column align="center" label="新闻栏目">
                <template slot-scope="scope">
                    {{ getColumnFullPath(scope.row.column) }}
                </template>
            </el-table-column>                       
            <el-table-column align="center" label="是否置顶">
                <template slot-scope="scope">
                    <el-switch
                        :key="'是否置顶'+scope.row.id"
                        v-model="scope.row.isTop"
                        @change="handleTopChange($event, scope.row)"
                        >
                    </el-switch>  
                </template>
            </el-table-column>  
            <el-table-column align="center" label="设置置顶时间" :sortable='"custom"'>
                <template slot-scope="scope">
                    {{ scope.row.setTopTime }}
                </template>
            </el-table-column>                                 
            <el-table-column align="center" label="是否轮播">
                <template slot-scope="scope">
                    <el-switch
                        :key="'是否轮播'+scope.row.id"
                        v-model="scope.row.isCarousel"
                         @change="handleCarouselChange($event, scope.row)"
                        >
                    </el-switch>  
                </template>
            </el-table-column>  
            <el-table-column align="center" label="设置轮播时间" :sortable='"custom"'>
                <template slot-scope="scope">
                    {{ scope.row.setCarouselTime }}
                </template>
            </el-table-column>                                  
            <el-table-column align="center" label="是否头条">
                <template slot-scope="scope">
                    <el-switch
                        :key="'是否头条'+scope.row.id"
                        v-model="scope.row.isHeadlines"
                         @change="handleHeadlinesChange($event, scope.row)"
                        >
                    </el-switch>  
                </template>
            </el-table-column>   
            <el-table-column align="center" label="设置头条时间" :sortable='"custom"'>
                <template slot-scope="scope">
                    {{ scope.row.setHeadlinesTime }}
                </template>
            </el-table-column>                                
            <el-table-column align="center" label="发布人">
                <template slot-scope="scope">
                {{ scope.row.publisher.realName }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="实际发布时间" :sortable='"custom"'>
                <template slot-scope="scope">
                    {{ scope.row.realPubTime }}
                </template>
            </el-table-column>  
            <el-table-column align="center" label="实际阅读量" :sortable='"custom"'>
                <template slot-scope="scope">
                    {{ scope.row.realReadingCount }}
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

<!-- 设置轮播对话框 -->
        <el-dialog
        title="开启轮播"
        :visible.sync="carouselDialogObj.visible"
        width="50%"
        class="openCarouselDialog"
        >
            <el-form
            ref="openCarouseForm"
            label-position="right"
            label-width="80px"
            >
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="轮播图片">
                            <el-select
                                style="width: 100%"
                                v-model="settingCarouselParam.imgUrlForCarousel"
                                @clear="settingCarouselParam.imgUrlForCarousel=null"
                                clearable
                                filterable
                                default-first-option
                                allow-create
                                placeholder="请选择或输入轮播图地址">
                            </el-select>                                     
                        </el-form-item>  
                    </el-col>     
                    <el-col :span="24" v-show="settingCarouselParam.imgUrlForCarousel" class="carousel-img-container">
                        <div class="flex-center">
                            <!-- v-if 保证有值时才渲染image标签 -->
                            <el-image 
                                v-if="settingCarouselParam.imgUrlForCarousel"
                                :src="settingCarouselParam.imgUrlForCarousel"
                                alt="图片加载失败"
                            >
                            <div slot="error" class="image-slot">
                                <div class="error-div">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </div>                          
                            </el-image>
                        </div>                                     
                    </el-col>                                    
                </el-row>
            </el-form> 
            <div slot="footer" class="dialog-footer">
                <el-button
                @click="carouselDialogObj.visible=false"
                >取消</el-button
                >
                <el-button
                type="primary"
                :loading="carouselDialogObj.loadingForSubmitBtn"
                :disabled="carouselDialogObj.loadingForSubmitBtn"
                @click="doOpenCarousel"
                >提交</el-button
                >
            </div>                       
        </el-dialog>        
    </div>
</template>

<script>
import Pagination from "@/components/Pagination"
import { jumpToPreviewPage } from '@/utils/preview'
import {publishedNewsList, userSelectData, allNewsColumn, revokePub, carouselManage, headlinesManage, topManage} from '@/api/news/publisher'
import { validURL } from '@/utils/validate'

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
        columnId: null,
        isTop: null,
        isCarousel: null,
        isHeadlines: null,
        publisherId: null,
        orderByRealPubTime: null,
        orderBySetCarouselTime: null,
        orderBySetHeadlinesTime: null,
        orderBySetTopTime: null,
        orderByRealReadingCount: null
    }
}

    export default {
        //已发布新闻列表组件
        name:'PublishedNewsList',
        components: { Pagination },
        data() {
            return {
                listLoading: false,
                loadingForRevokeBtn: false,
                data: {
                    total: 0,
                    current: 1,
                    size: 10,
                    records: [],                    
                },
                queryParam: getDefaultQueryParam(),   
                pageSizes: [5, 10, 15, 20], 
                curOperatedRow: {}, 
                loadingForUserSelect: false,
                //用户下拉菜单数据
                userList: [],   
                //新闻栏目级联选择器Loading             
                loadingForNewsColumnCascader: false,
                //新闻栏目
                newsColumns: [],
                newsColumnCascaderProps: {
                  value: 'id',
                  label: 'title',
                  children: 'children',
                  emitPath: false
                },
                //设置轮播的参数
                settingCarouselParam: {
                    isCarousel: null,
                    imgUrlForCarousel: null
                },
                //管理轮播对话框状态的对象
                carouselDialogObj: {
                    visible: false,
                    loadingForSubmitBtn: false,
                    //保存正设置轮播的那一行
                    settingCarouselRow: {}
                }
            }
        },
        mounted(){
            console.log('已发布组件mounted钩子')
            this.init()
        },
        destroyed(){
            console.log('已发布组件destroyed钩子')
        },
        methods: {
            init() {
                this.queryData();
            },       
            //分页、条件查询新闻列表
            queryData() {
                this.listLoading = true
                publishedNewsList(this.queryParam).then((resp) => {
                    this.data = resp;
                    this.listLoading = false
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
            handleCascaderVisibleChange(visible) {
                //如果栏目列表是空，就从服务器中查询
                if(visible && this.newsColumns.length == 0) {
                    this.loadingForNewsColumnCascader = true
                    allNewsColumn().then(resp => {
                        this.newsColumns = resp
                        this.loadingForNewsColumnCascader = false
                    }).catch(error => {
                        this.$message({
                          message: '加载新闻栏目失败！',
                          type: 'error'
                        })
                        this.loadingForNewsColumnCascader = false
                    })
                }
            },            
            remoteSearchUserList(visible){
                //如果没有查询过用户列表，就查询
                if(visible && this.userList.length === 0){
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
            /**
             * order有三个值：ascending、descending和null
             */
            handleSortChange({ column, prop, order }){
                //首先，都设为null
                this.queryParam.orderByRealPubTime = null
                this.queryParam.orderBySetCarouselTime = null
                this.queryParam.orderBySetHeadlinesTime = null
                this.queryParam.orderBySetTopTime = null
                this.queryParam.orderByRealReadingCount = null
                
                if(order) {
                    if(column.label === '实际发布时间') {
                        //按录入完成时间排序
                        this.queryParam.orderByRealPubTime = (order === 'ascending')
                    }else if(column.label === '设置轮播时间') {
                        this.queryParam.orderBySetCarouselTime = (order === 'ascending')
                    }else if(column.label === '设置头条时间') {
                        this.queryParam.orderBySetHeadlinesTime = (order === 'ascending')
                    }else if(column.label === '设置置顶时间') {
                        this.queryParam.orderBySetTopTime = (order === 'ascending')
                    }else if(column.label === '实际阅读量') {
                        this.queryParam.orderByRealReadingCount = (order === 'ascending')
                    }
                }
                this.queryData()
            }, 
            handleFilter(){
                //搜索，从第1页开始
                this.queryParam.page = 1
                this.queryData();
            },
            resetFilter(){
                let order1 = this.queryParam.orderByRealPubTime
                let order2 = this.queryParam.orderBySetCarouselTime
                let order3 = this.queryParam.orderBySetHeadlinesTime
                let order4 = this.queryParam.orderBySetTopTime
                let order5 = this.queryParam.orderByRealReadingCount
                this.queryParam = getDefaultQueryParam();
                //不能重置排序，要设回来
                this.queryParam.orderByRealPubTime = order1
                this.queryParam.orderBySetCarouselTime = order2
                this.queryParam.orderBySetHeadlinesTime = order3                
                this.queryParam.orderBySetTopTime = order4               
                this.queryParam.orderByRealReadingCount = order5               
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
            handlePreview(){
                let selectedNewId = this.validateIfSelecteRow('预览')
                if(selectedNewId){
                    let externalUrl = this.curOperatedRow.externalUrl
                    if(externalUrl && externalUrl.trim()!=='') {
                        //如果设置了外链，就跳转到外网
                        window.open(externalUrl, '_blank'); 
                    }else {
                        //预览id为selectedNewId的新闻
                        jumpToPreviewPage(this.$router, {id: selectedNewId})
                    }
                }
            },
            handleRevokePub(){
                let selectedNewId = this.validateIfSelecteRow('撤销')
                if(selectedNewId){
                    this.$confirm(`你确定撤销标题为【${this.curOperatedRow.title}】的新闻吗？`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "info",
                    }).then(() => {
                        this.loadingForRevokeBtn = true
                        revokePub(selectedNewId).then(resp => {
                            this.loadingForRevokeBtn = false
                            //重新查询新闻列表
                            this.queryData()
                        }).catch(error => {
                            this.loadingForRevokeBtn = false
                            this.$message({
                                message: '撤销失败！',
                                type: 'error'
                            })
                        })
                    }).catch(() => {
                        this.$message({
                            message: '取消撤销',
                            type: 'info'
                        })
                    })                    
                }
            },
            //得到新闻栏目完整路径。如果新闻栏目有父栏目，则返回 “父/子” 这样的形式
            getColumnFullPath(newsCol) {
                if(!!newsCol.parent) {
                    //如果有父栏目
                    return newsCol.parent.title + "/" + newsCol.title
                }else {
                    return newsCol.title
                }
            },
            handleTopChange($event, row) {
                //先设回原先的状态，请求成功后才变更状态
                row.isTop = !$event
                let operateType = $event ? '置顶' : '取消置顶'
                this.$confirm(`你确定【${operateType}】标题为【${row.title}】的新闻吗？`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "info",
                }).then(() => {
                    let tagParam = $event ? 1 : 2
                    topManage(row.id, tagParam).then(resp => {
                        //请求成功，才变更新状态
                        row.isTop = $event
                        row.setTopTime = resp//更新时间
                    }).catch(error => {
                        this.$message({
                            message: '操作失败！',
                            type: 'error'
                        })                            
                    })
                }).catch(() => {
                    this.$message({
                        message: '取消变更',
                        type: 'info'
                    })
                })                
            },
            handleCarouselChange($event, row) {
                //先设回原先的状态
                row.isCarousel = !$event                
                if(!$event) {
                    this.$confirm(`你确定【取消轮播】标题为【${row.title}】的新闻吗？`, "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "info",
                    }).then(() => {
                        //先重置参数
                        this.settingCarouselParam.isCarousel = null
                        this.settingCarouselParam.imgUrlForCarousel = null
                        //再设置参数
                        this.settingCarouselParam.isCarousel = false
                        carouselManage(row.id, this.settingCarouselParam).then(resp => {
                            //请求成功，才设置新状态
                            row.isCarousel = false
                            row.setCarouselTime = resp//更新时间
                        }).catch(error => {
                            this.$message({
                                message: '操作失败！',
                                type: 'error'
                            })                            
                        })
                    }).catch(() => {
                        this.$message({
                            message: '取消变更',
                            type: 'info'
                        })
                    })                     
                }else {
                    //设置对话框操作的当前行
                    this.carouselDialogObj.settingCarouselRow = row                    
                    //重置对话框状态
                    this.carouselDialogObj.loadingForSubmitBtn = false
                    this.settingCarouselParam.imgUrlForCarousel = null
                    //显示对话框
                    this.carouselDialogObj.visible = true
                }
            },
            doOpenCarousel() {
                //正设置轮播的行
                let curRow = this.carouselDialogObj.settingCarouselRow
                //验证图片地址
                let imgUrl = this.settingCarouselParam.imgUrlForCarousel
                if(!imgUrl){
                    this.$message({
                        message: '设置轮播时必须选择或填写轮播图地址',
                        type: 'error'
                    })
                }else if(!validURL(imgUrl)){
                    this.$message({
                        message: '请填写正确的图片地址',
                        type: 'error'
                    })
                }else {//验证通过后，才进行请求
                    this.carouselDialogObj.loadingForSubmitBtn = true
                    //设置参数
                    this.settingCarouselParam.isCarousel = true
                    carouselManage(curRow.id, this.settingCarouselParam).then(resp => {
                        //请求成功，才设为true
                        curRow.isCarousel = true
                        curRow.setCarouselTime = resp//更新时间
                        this.carouselDialogObj.visible = false//关闭对话框
                    }).catch(error => {
                        this.$message({
                            message: '操作失败！',
                            type: 'error'
                        })                            
                    }) 
                }                
            },
            handleHeadlinesChange($event, row) {
                //先设回原先的状态，只有请求成功时才变更
                row.isHeadlines = !$event
                let operateType = $event ? '' : '取消'
                this.$confirm(`你确定将标题为【${row.title}】的新闻【${operateType}设为头条】吗？`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "info",
                }).then(() => {
                    let tagParam = $event ? 1 : 2
                    headlinesManage(row.id, tagParam).then(resp => {
                        //请求成功，才设置新状态
                        row.isHeadlines = $event
                        row.setHeadlinesTime = resp//更新时间
                    }).catch(error => {
                        this.$message({
                            message: '操作失败！',
                            type: 'error'
                        })                            
                    })  
                }).catch(() => {
                    this.$message({
                        message: '取消变更',
                        type: 'info'
                    })
                }) 
            }
        }
    }
</script>

<style>
.el-table th.gutter {
  display: table-cell !important;
}
.carousel-img-container {
    padding: 20px 20px;
}
.carousel-img-container .image-slot .error-div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
    font-size: 10em;
    padding: 30px 30px;
}
</style>