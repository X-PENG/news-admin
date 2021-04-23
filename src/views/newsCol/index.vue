<template>
    <div class="app-container">
    <el-row class="header-btn-group">
        <el-col :span="24">
          <el-button type="success" size="small" icon="el-icon-plus" @click="handleAddBtn">
            添加
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEditBtn">
            修改
          </el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelBtn">
            删除
          </el-button>            
        </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="newsColList"
      stripe
      border
      fit
      highlight-current-row
      row-key="id"
      lazy
      :load="loadChildList"
      :tree-props="treeProps"
      style="width: 100%"
      @current-change="handleCurRowChange"
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="栏目名称">
        <template slot-scope="scope">
          <el-tag class="title-tag">
              {{ scope.row.title }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="栏目描述" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="菜单序号" width="80">
        <template slot-scope="scope">
          {{ scope.row.settings.menuOrder }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="模块序号" width="80">
        <template slot-scope="scope">
          {{ scope.row.settings.moduleOrder }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否开启" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.settings.enabled"
            @change="changeStatus($event, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="右侧显示图片" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.settings.showImgOnTheRight"
            @change="changeShowImgStatus($event, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="栏目链接" min-width="100">
        <template slot-scope="scope">
          <a :href="scope.row.externalLink" target="_blank" style="color: blue">{{ scope.row.externalLink }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
    </el-table>   

<!-- 添加栏目对话框 -->
    <el-dialog
      title="添加新闻栏目"
      :visible.sync="addNewsColDialog.visible"
      width="30%"
      class="addNewsColDialog"
    >
     <el-form
      ref="addNewsColForm"
      :model="newsColInfoForAdd"
      label-position="right"
      label-width="80px"
    >
    <el-row>
      <el-col :span="24">
        <el-form-item prop="title" label="名称">
          <el-input
            v-model="newsColInfoForAdd.title"
            placeholder="栏目名称"
            type="text"
            tabindex="1"
          />
        </el-form-item>        
      </el-col>
      <el-col :span="24">
        <el-form-item prop="description" label="描述">
          <el-input
            v-model="newsColInfoForAdd.description"
            placeholder="栏目描述"
            type="text"
            tabindex="2"
          />
        </el-form-item>        
      </el-col>
      <el-col :span="24">
        <el-form-item prop="parentId" label="父栏目">
          <el-select tabindex="3" v-model="newsColInfoForAdd.parentId" placeholder="父栏目">
            <el-option
              v-for="item in newsColList"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="externalLink" label="外网链接">
          <el-input
            v-model="newsColInfoForAdd.externalLink"
            type="text"
            placeholder="外网链接"
            tabindex="5"
          />
        </el-form-item> 
      </el-col>
    </el-row>
    </el-form>     
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="doAdd"
          >提交</el-button
        >
        <el-button
          @click="cancelAdd"
          >取消</el-button
        >        
      </div>
    </el-dialog> 


<!-- 编辑栏目对话框 -->
    <el-dialog
      title="编辑新闻栏目"
      :visible.sync="editNewsColDialog.visible"
      width="30%"
      class="addNewsColDialog"
    >
     <el-form
      ref="editNewsColForm"
      :model="newsColInfoForUpdate"
      label-position="right"
      label-width="80px"
    >
    <el-row>
      <el-col :span="24">
        <el-form-item prop="title" label="名称">
          <el-input
            v-model="newsColInfoForUpdate.title"
            placeholder="栏目名称"
            type="text"
            tabindex="1"
          />
        </el-form-item>        
      </el-col>
      <el-col :span="24">
        <el-form-item prop="description" label="描述">
          <el-input
            v-model="newsColInfoForUpdate.description"
            placeholder="栏目描述"
            type="text"
            tabindex="2"
          />
        </el-form-item>        
      </el-col>
      <el-col :span="12">
        <el-form-item prop="menuOrder" label="菜单序号">
          <el-input
            v-model="newsColInfoForUpdate.settings.menuOrder"
            placeholder="菜单序号"
            type="text"
            tabindex="3"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="moduleOrder" label="模块序号">
          <el-input
            v-model="newsColInfoForUpdate.settings.moduleOrder"
            placeholder="模块序号"
            type="text"
            tabindex="4"
          />
        </el-form-item>
      </el-col>      
      <el-col :span="24">
        <el-form-item prop="parentId" label="父栏目">
          <el-select tabindex="5" v-model="newsColInfoForUpdate.parentId" placeholder="父栏目">
            <el-option
              v-for="item in newsColList"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="externalLink" label="外网链接">
          <el-input
            v-model="newsColInfoForUpdate.externalLink"
            type="text"
            placeholder="外网链接"
            tabindex="6"
          />
        </el-form-item> 
      </el-col>
    </el-row>

    </el-form>     
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="doUpdate"
          >提交</el-button
        >
        <el-button
          @click="cancelUpdate"
          >取消</el-button
        >          
      </div>
    </el-dialog> 
    </div>
</template>

<script>
import { newsColList, childNewsColList, addNewsCol, delNewsCol, updateNewsCol, enableOrDisableNewsCol, changeNewsColShowImgStatus } from '@/api/newsCol'
import { isNumber } from '@/utils/validate'

export default {
        name:'NewsCol',
        data() {
            return {
                listLoading: false,
                tableKeyPrefix: 'newsColTable',
                tableKey: 'newsColTable',
                newsColList: [],
                treeProps: {hasChildren: 'isHasChildren'},
                curSelectedRow: {},
                addNewsColDialog: {//控制添加栏目对话框
                    visible: false,
                    destroyOnClose: true
                },
                editNewsColDialog: {//控制编辑栏目对话框
                     visible: false,
                    destroyOnClose: true                   
                },
                newsColInfoForAdd: {//添加的栏目信息
                    title: null,
                    description: null,
                    parentId: null,
                    externalLink: null
                },
                newsColInfoForUpdate: {//修改的栏目信息
                    id: null,
                    title: null,
                    description: null,
                    parentId: null,
                    externalLink: null,
                    settings: {
                      menuOrder: 127,//默认最大值127
                      moduleOrder: null
                    }
                },
            }
        },
        mounted(){
            this.initList()
        },
        methods: {
            initList(){
                //更改table的key，重新渲染table
                this.tableKey = this.tableKeyPrefix + new Date().getTime()              
                this.listLoading = true
                this.newsColList = []//刷新表格
                newsColList().then(resp => {
                    this.newsColList = resp
                    this.listLoading = false                    
                }).catch(error => {
                    this.$message({
                        message: '加载失败，未知异常！',
                        type: 'error'
                    })
                    this.listLoading = false
                })
            },
            loadChildList(row, treeNode, resolve){
                childNewsColList(row.id).then(resp => {
                  resolve(resp)
                }).catch(error => {
                    this.$message({
                        message: '加载失败，未知异常！',
                        type: 'error'
                    })                  
                })
            },
            handleCurRowChange(currentRow, oldCurrentRow){
              // console.log("当前行改变 id=" + currentRow.id + ', title=' + currentRow.title)
              this.curSelectedRow = currentRow
            },
            handleAddBtn(){
              this.addNewsColDialog.visible = true
              //重置信息
              this.newsColInfoForAdd = {
                  title: null,
                  description: null,
                  parentId: null,
                  externalLink: null
              }               
            },
            cancelAdd(){
              this.addNewsColDialog.visible = false
            },
            doAdd(){
              if(this.validateForAdd()){
                addNewsCol(this.newsColInfoForAdd).then(resp => {
                  this.addNewsColDialog.visible=false
                  //重新刷新
                  this.initList()
                })
              }
            },
            //对添加表单进行信息验证
            validateForAdd(){
              let title = this.newsColInfoForAdd.title
              let msg
              if(!title || title.trim() === ''){
                msg = '名称不能为空或空格'
              }
              if(!!msg){
                this.$message({
                  message: msg,
                  type: 'error'
                })
                return false                
              }else{
                return true
              }
            },
            handleEditBtn(){
              if(!this.curSelectedRow.id) {
                this.$message({
                  message: '请选择要修改的栏目',
                  type: 'warning'
                })                
                return
              }
              this.newsColInfoForUpdate.id = this.curSelectedRow.id           
              this.newsColInfoForUpdate.title = this.curSelectedRow.title           
              this.newsColInfoForUpdate.description = this.curSelectedRow.description           
              this.newsColInfoForUpdate.parentId = this.curSelectedRow.parentId           
              this.newsColInfoForUpdate.externalLink = this.curSelectedRow.externalLink   
              this.newsColInfoForUpdate.settings.menuOrder = this.curSelectedRow.settings.menuOrder           
              this.newsColInfoForUpdate.settings.moduleOrder = this.curSelectedRow.settings.moduleOrder           
              this.editNewsColDialog.visible = true        
            },
            cancelUpdate(){
              this.editNewsColDialog.visible = false
            },
            doUpdate(){
              if(this.validateForUpdate()){
                updateNewsCol(this.newsColInfoForUpdate).then(resp => {
                  this.editNewsColDialog.visible = false
                  this.initList()//重新加载
                })
              }
            },
            //对编辑表单进行校验
            validateForUpdate(){
              let title = this.newsColInfoForUpdate.title
              let menuOrder = this.newsColInfoForUpdate.settings.menuOrder
              let moduleOrder = this.newsColInfoForUpdate.settings.moduleOrder
              let msg
              if(!title || title.trim() === ''){
                msg = '名称不能为空或空格'
              }else if(typeof(menuOrder) === 'string' && !menuOrder.trim()){
                msg = '菜单序号不能为空'
              }else if(!isNumber(menuOrder)){
                msg = '菜单序号必须是数字'
              }else if(menuOrder < 1 || menuOrder > 127){
                msg = '菜单序号必须在1~127之间'
              }else if(moduleOrder != null && (typeof(moduleOrder) === 'string' && !!moduleOrder.trim())){
                if(!isNumber(moduleOrder)){
                  msg = '模块序号必须是数字'
                }else if(moduleOrder < 1 || moduleOrder > 127){
                   msg = '模块序号必须在1~127之间' 
                }
              }

            if(!!msg){
                this.$message({
                  message: msg,
                  type: 'error'
                })
                return false                
              }else{
                return true
              }                
            },
            handleDelBtn(){
              if(!this.curSelectedRow.id) {
                this.$message({
                  message: '请选择要删除的栏目',
                  type: 'warning'
                })                
                return
              }
              this.$confirm(`你确定删除【${this.curSelectedRow.title}】栏目吗？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                delNewsCol(this.curSelectedRow.id).then(resp => {
                    this.initList()
                })
              }).catch(() => {
                this.$message({
                  message: `取消删除【${this.curSelectedRow.title}】栏目`,
                  type: 'info'
                })
              })              
            },
            changeStatus($event, row){
              let newStatus = $event
              //先还原，请求成功了才改变
              row.settings.enabled = !newStatus
              let msgType = newStatus ? '开启' : '禁用'
              this.$confirm(`你确定${msgType}【${row.title}】栏目吗？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                enableOrDisableNewsCol(row.id, newStatus).then(resp => {
                    //请求成功才改变
                    row.settings.enabled = newStatus
                }).catch(error => {
                  this.$message({
                    message: '操作失败！',
                    type: 'error'
                  })
                })
              })      
            },
            changeShowImgStatus($event, row) {
              let newStatus = $event
              //先还原，请求成功了才改变
              row.settings.showImgOnTheRight = !newStatus
              changeNewsColShowImgStatus(row.id, newStatus).then(resp => {
                  //请求成功才改变
                  row.settings.showImgOnTheRight = newStatus
              }).catch(error => {
                  this.$message({
                    message: '操作失败！',
                    type: 'error'
                  })
              })
            }
        }
    }
</script>

<style>
.header-btn-group{
    margin-top: 10px;
    margin-bottom: 20px;
}
.el-table th.gutter {
  display: table-cell !important;
}
.title-tag{
  font-size: 1.2em;
}
.addNewsColDialog .el-dialog{
  padding: 0px 25px;
}
.addNewsColDialog .el-dialog__body{
  padding-bottom: 10px;
}
</style>