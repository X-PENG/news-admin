<template>
    <div class="app-container">
        <!-- 搜索栏 -->
        <div class="filter-container">
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-input
                        v-model="queryParam.title"
                        placeholder="标题"
                        class="filter-item"
                    />
                </el-col>
                <el-col :span="4">
                    <el-select
                        v-model="queryParam.newsStatus"
                        placeholder="状态"
                        clearable
                        @clear='clearStatus'
                        class="filter-item"
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

        <el-table
        v-loading="listLoading"
        :data="data.records"
        @sort-change="handleSortChange"
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
            <el-table-column align="center" label="新闻状态">
                <template slot-scope="scope">
                    <el-tag :type="eTagTypeMap[scope.row.newsStatus.name]" style="font-size: 1em">
                        {{ scope.row.newsStatus.name }}
                    </el-tag>
                </template>
            </el-table-column>                       
            <el-table-column align="center" label="审核通过时间" :sortable='"custom"'>
                <template slot-scope="scope">
                {{ scope.row.previousEpochReviewPassTime }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                     <el-tooltip class="item" effect="dark" content="发布" placement="top">
                        <el-button
                            type="success"
                            icon="el-icon-top"
                            circle
                            @click.native="handlePublish(scope.row)"
                            ></el-button
                        >
                     </el-tooltip>

                     <el-tooltip class="item" effect="dark" content="预览" placement="top">
                        <el-button
                            type="warning"
                            icon="el-icon-view"
                            circle
                            @click.native="handlePreview(scope.row)"
                        >
                        </el-button>
                    </el-tooltip>

                     <el-tooltip class="item" effect="dark" content="打回修改" placement="top">
                        <el-button
                            type="danger"
                            icon="el-icon-close"
                            circle
                            @click.native="handleRemodification(scope.row)"
                        >
                        </el-button>
                     </el-tooltip>
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

    <!-- 发布新闻对话框 -->
        <el-dialog
        title="新闻发布"
        :visible.sync="pubNewsDialogObj.visible"
        width="50%"
        class="pubNewsDialog"
        >
            <el-form
            ref="pubNewsForm"
            label-position="right"
            label-width="80px"
            >
            <el-row>
                <el-col :span="24">
                    <el-form-item label="新闻栏目">
                        <el-cascader
                            v-model="pubNewsDialogObj.pubSettingInfo.columnId"
                            v-loading="loadingForNewsColumnCascader"
                            style="width: 100%"
                            clearable
                            placeholder="新闻栏目"
                            :options="newsColumns"
                            :props="newsColumnCascaderProps"
                            @visible-change="handleCascaderVisibleChange"
                            tabindex="1"
                        >
                        </el-cascader>            
                    </el-form-item>        
                </el-col>
                <el-col :span="12">
                    <el-form-item label="文字来源">
                    <el-input
                        v-model="pubNewsDialogObj.pubSettingInfo.articleSource"
                        placeholder="文字来源"
                        type="text"
                        tabindex="2"
                    />
                    </el-form-item>        
                </el-col>
                <el-col :span="12">
                    <el-form-item label="图片来源">
                    <el-input
                        v-model="pubNewsDialogObj.pubSettingInfo.imgSource"
                        placeholder="图片来源"
                        tabindex="3"
                    />
                    </el-form-item>           
                </el-col>
                <el-col :span="12">
                    <el-form-item label="图片新闻">
                        <el-switch
                        v-model="pubNewsDialogObj.pubSettingInfo.imageNews"
                        tabindex="4">
                        </el-switch>            
                    </el-form-item>  
                </el-col>
                <el-col :span="12">
                    <el-form-item label="置顶">
                        <el-switch
                        v-model="pubNewsDialogObj.pubSettingInfo.top"
                        tabindex="5">
                        </el-switch>            
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="编辑">
                    <el-input
                        v-model="pubNewsDialogObj.pubSettingInfo.editors"
                        type="text"
                        placeholder="参与编辑人员"
                        tabindex="6"
                    />
                    </el-form-item> 
                </el-col>
                <el-col :span="12">
                    <el-form-item label="审核">
                    <el-input
                        v-model="pubNewsDialogObj.pubSettingInfo.reviewers"
                        type="text"
                        placeholder="参与审核人员"
                        tabindex="7"
                    />
                    </el-form-item> 
                </el-col>
                <el-col :span="12">
                    <el-form-item label="发布时间">
                        <el-date-picker
                            v-model="pubNewsDialogObj.pubSettingInfo.showPubTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            tabindex="8"
                        >
                        </el-date-picker>
                    </el-form-item>  
                </el-col>
                <el-col :span="12">
                    <el-form-item label="阅读数">
                    <el-input
                        v-model="pubNewsDialogObj.pubSettingInfo.initReadingCount"
                        type="text"
                        placeholder="阅读数"
                        tabindex="9"
                    />
                    </el-form-item>  
                </el-col> 
                <el-col :span="12">
                    <el-form-item label="是否头条">
                        <el-switch
                        v-model="pubNewsDialogObj.pubSettingInfo.headlines"
                        tabindex="10">
                        </el-switch>             
                    </el-form-item>  
                </el-col>  
                <el-col :span="12">
                    <el-form-item label="是否轮播">
                        <el-switch
                        v-model="pubNewsDialogObj.pubSettingInfo.carousel"
                        tabindex="11">
                        </el-switch>             
                    </el-form-item>  
                </el-col> 
                <el-col :span="24" v-show="pubNewsDialogObj.pubSettingInfo.carousel">
                    <el-form-item label="轮播图片">
                        <el-select
                           style="width: 100%"
                            v-model="pubNewsDialogObj.pubSettingInfo.imgUrlForCarousel"
                            @clear=" pubNewsDialogObj.pubSettingInfo.imgUrlForCarousel=null "
                            clearable
                            filterable
                            default-first-option
                            allow-create
                            placeholder="请选择或输入轮播图地址">
                        </el-select>                                     
                    </el-form-item>  
                </el-col>     
                <el-col :span="24" v-show="pubNewsDialogObj.pubSettingInfo.carousel && pubNewsDialogObj.pubSettingInfo.imgUrlForCarousel" class="peng-img-container">
                    <div class="flex-center">
                        <el-image 
                            v-if="pubNewsDialogObj.pubSettingInfo.imgUrlForCarousel"
                            :src="pubNewsDialogObj.pubSettingInfo.imgUrlForCarousel"
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
                type="primary"
                @click="pubNewsDialogObj.visible = false"
                >取消</el-button
                >
                <el-button
                type="primary"
                :loading="loadingForDoPubBtn"
                :disabled="loadingForDoPubBtn"
                @click="doPubNews"
                >提交</el-button
                >
            </div>
        </el-dialog> 
    </div>
</template>

<script>
import Pagination from "@/components/Pagination"
import SuggestionDialog from '@/components/SuggestionDialog'
import { jumpToPreviewPage } from '@/utils/preview'
import { unpublishedNewsList,toBeReleasedStatusList, remodification, allNewsColumn, publishOneNews } from '@/api/news/publisher'
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
        newsStatus: null,
        orderByPreviousEpochReviewPassTime: null
    }
}

function getDefaultPubSettingInfo() {
    return {
        columnId: null,
        articleSource: null,
        imgSource: null,
        imageNews: false,//默认false，不是图片新闻
        top: false,//默认false，不置顶
        editors: null,
        reviewers: null,
        showPubTime: null,
        initReadingCount: 0,//默认0,
        carousel: false,//默认false，不发布到轮播图上
        headlines: false,//默认false，不作为头条发布
        imgUrlForCarousel: null
    }
}

    export default {
        //未发布新闻列表组件
        name:'UnpublishedNewsList',
        components: { Pagination, SuggestionDialog },
        data() {
            return {
                listLoading: false,
                data: {
                    total: 0,
                    current: 1,
                    size: 10,
                    records: [],                    
                },
                loadingForStatusSelect: false,
                //新闻状态下拉菜单数据
                newsStatusList: [],   
                //新闻状态和tag标签类型的映射 
                eTagTypeMap: {
                    '待发布': 'success',
                    '撤销发布': 'danger'
                },                             
                queryParam: getDefaultQueryParam(),   
                pageSizes: [5, 10, 15, 20], 
                curOperatedRow: {}, 
                //意见对话框的状态对象
                suggestionDialogObj: {
                    visible: false,
                    title: '打回修改',
                    suggestion: ''
                },
                pubNewsDialogObj: {
                    visible: false,
                    //发布设置信息
                    pubSettingInfo: getDefaultPubSettingInfo()
                },
                loadingForNewsColumnCascader: false,
                //发布新闻对话框的确定按钮的loading状态
                loadingForDoPubBtn: false,
                //新闻栏目
                newsColumns: [],
                newsColumnCascaderProps: {
                  value: 'id',
                  label: 'title',
                  children: 'children',
                  emitPath: false
                }              
            }
        },
        mounted(){
            console.log('未发布组件mounted钩子')
            this.init();
        },        
        destroyed(){
            console.log('未发布组件destroyed钩子')
        },
        methods: {
            init() {
                this.queryData();
            },       
            //分页、条件查询新闻列表
            queryData() {
                this.listLoading = true;
                unpublishedNewsList(this.queryParam).then((resp) => {
                    this.data = resp;
                    this.listLoading = false;
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
            clearStatus(){
                this.queryParam.newsStatus = null
            }, 
            remoteSearchStatusList(visible){
                //如果没有查询过状态列表，就查询
                if(this.newsStatusList.length === 0 && visible){
                    this.loadingForStatusSelect = true
                    toBeReleasedStatusList().then(resp => {
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
            handleFilter(){
                //搜索，从第1页开始
                this.queryParam.page = 1
                this.queryData();
            },
            resetFilter(){
                let order = this.queryParam.orderByPreviousEpochReviewPassTime
                this.queryParam = getDefaultQueryParam();
                //不能重置排序！
                this.queryParam.orderByPreviousEpochReviewPassTime = order
            }, 

            /**
             * order有三个值：ascending、descending和null
             */
            handleSortChange({ column, prop, order }){
                //只要order没值，就按默认排序
                if(!order){
                    this.queryParam.orderByPreviousEpochReviewPassTime = null
                    this.queryData()
                }else if(column.label === '审核通过时间') {
                    //按录入完成时间排序
                    this.queryParam.orderByPreviousEpochReviewPassTime = (order === 'ascending')
                    this.queryData()
                }
            },            
            handlePreview(row){
                let externalUrl = row.externalUrl
                if(externalUrl && externalUrl.trim()!=='') {
                    //如果设置了外链，就跳转到外网
                    window.open(externalUrl, '_blank'); 
                }else {
                    //预览id为selectedNewId的草稿
                    jumpToPreviewPage(this.$router, {id: row.id})
                }
            },
            handlePublish(row) {
                console.log(`发布新闻 id=${row.id}  title=${row.title}`)
                //设置当前操作的行
                this.curOperatedRow = row
                //重置对话框信息
                this.pubNewsDialogObj.pubSettingInfo = getDefaultPubSettingInfo()
                //设置默认值
                this.pubNewsDialogObj.pubSettingInfo.articleSource = row.articleSource
                this.pubNewsDialogObj.pubSettingInfo.imgSource = row.imgSource
                this.pubNewsDialogObj.pubSettingInfo.editors = row.editors
                this.pubNewsDialogObj.pubSettingInfo.reviewers = row.reviewers
                this.pubNewsDialogObj.pubSettingInfo.showPubTime = row.showPubTime
                //显示对话框
                this.pubNewsDialogObj.visible = true
            },
            handleRemodification(row) {
                //设置当前行为正在操作的行
                this.curOperatedRow = row
                //重置对话框状态
                this.suggestionDialogObj = { visible: false, title: '审核失败', suggestion: '' }       
                //然后，弹出意见填写对话框
                this.suggestionDialogObj.visible=true                
            },
            completeSuggest(){
                this.$confirm(`你确定打回标题为【${this.curOperatedRow.title}】的新闻吗？`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    remodification(this.curOperatedRow.id, this.suggestionDialogObj.suggestion).then(resp => {
                        this.suggestionDialogObj.visible = false
                        //操作成功，重新查询列表数据
                        this.queryData()
                    }).catch(error => {
                        this.$message({
                            message: '打回失败！',
                            type: 'error'
                        })                        
                    })                        
                }).catch(() => {
                    this.$message({
                        message: '取消打回',
                        type: 'info'
                    })
                })                 
            },
            //验证发布新闻表单
            validatePubForm(){
                let success = true
                if(this.pubNewsDialogObj.pubSettingInfo.columnId == null) {
                    success = false
                    this.$message({
                        message: '请选择新闻栏目',
                        type: 'error'
                    })
                }else if(this.pubNewsDialogObj.pubSettingInfo.carousel){
                    let imgUrl = this.pubNewsDialogObj.pubSettingInfo.imgUrlForCarousel
                    if(!imgUrl){
                        success = false
                        this.$message({
                            message: '设置了轮播，必须选择或填写轮播图地址',
                            type: 'error'
                        })
                    }else if(!validURL(imgUrl)){
                        success = false
                        this.$message({
                            message: '请填写正确的图片地址',
                            type: 'error'
                        })
                    }
                }else if(!this.pubNewsDialogObj.pubSettingInfo.showPubTime) {
                        success = false
                        this.$message({
                            message: '请选择发布时间',
                            type: 'error'
                        })                    
                }
                return success
            },
            doPubNews(){
                //首先，对表单做校验
                if(!this.validatePubForm()) {
                    return
                }
                this.$confirm(`你确定发布标题为【${this.curOperatedRow.title}】的新闻吗？`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    console.log('确定发布新闻 id=' + this.curOperatedRow.id)
                    console.log(this.pubNewsDialogObj.pubSettingInfo)
                    //loading，并禁用按钮
                    this.loadingForDoPubBtn=true
                    publishOneNews(this.curOperatedRow.id, this.pubNewsDialogObj.pubSettingInfo).then(resp => {
                        this.loadingForDoPubBtn=false
                        this.pubNewsDialogObj.visible = false
                        //发布成功，就重新查询列表
                        this.queryData()
                    }).catch(error => {
                        this.$message({
                            message: '发布失败',
                            type: 'error'
                        })                        
                        this.loadingForDoPubBtn=false
                    })
                }).catch(() => {
                    this.$message({
                        message: '取消发布',
                        type: 'info'
                    })
                })                 
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
            }                                      
        }        
    }

</script>

<style>
.el-table th.gutter {
  display: table-cell !important;
}
.peng-img-container {
  padding: 20px 20px;
}
.peng-img-container .image-slot .error-div{
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