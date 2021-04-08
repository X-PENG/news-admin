<template>
    <div class="app-container" v-loading.fullscreen.lock="fullscreenLoading">
      <el-form :inline="true" :model="roleInfoForAdd" class="header-form">
        <el-form-item>
          <el-input v-model="roleInfoForAdd.nameEn" placeholder="英文名">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="roleInfoForAdd.nameZh" placeholder="中文名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="roleInfoForAdd.description" placeholder="角色描述"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd" icon="el-icon-plus">添加</el-button>
        </el-form-item>
      </el-form>      
      
      <div class="collapse-container">
        <el-collapse
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          class="customize-collapse"
          v-model="activeCollapseItem"
          ref="collapse"
          accordion
          @change="handleCollapseChange"
        >
          <el-collapse-item
            :name="role.id"
            v-for="role in roles"
            :key="role.nameEn"
          >
            <template slot="title">
              <el-tooltip class="item" effect="dark" :content="role.description|| '无描述信息'" placement="top-start">
                <el-tag >
                  <span class="collapse-title">{{ role.nameZh }}</span>
                </el-tag>
              </el-tooltip>
            </template>
            <el-card class="box-card" :key="cardRefPrefix + role.id" v-loading="loadingForCard">
              <div slot="header" class="clearfix">
                <span>可访问的资源</span>
                <el-button
                  style="float: right; padding: 3px 0; color: red"
                  type="text"
                  icon="el-icon-delete"
                  @click="delRole(role)"
                ></el-button>
              </div>
              <div>
                <el-tree
                  show-checkbox
                  default-expand-all
                  :data="menuTree"
                  :props="defaultProps"
                  node-key="id"
                  :key="treeRefPrefix + role.id"
                  :ref="treeRefPrefix + role.id"
                ></el-tree>
              </div>
              <div class="footer-btn-group">
                <el-button size="small" @click="cancleUpdate">取消</el-button>
                <el-button size="small" type="primary" @click="doUpdate(role.id)"
                  >确认修改</el-button
                >
              </div>
            </el-card>
          </el-collapse-item>
        </el-collapse>        
      </div>
    </div>
</template>

<script>
import { roleList, menuTree, addRole, delRole, setResourceForRole, getAllResourceOfRole } from '@/api/roleManager'

    export default {
        name:'Privilege',
        data() {
            return {
                loading: true,
                loadingForCard: false,
                activeCollapseItem: -1,
                treeRefPrefix: 'tree_',
                cardRefPrefix: 'card_',
                defaultProps:{
                    label: "name",
                    children: "children",
                },
                menuTree: [
                  {
                    id: -1,
                    name: '所有',
                    children: []
                  }
                ],
                roles: [],
                roleInfoForAdd: {
                  nameEn: '',
                  nameZh: '',
                  description: ''
                },
                currentRoleAllResources: []
            }
        },
        mounted(){
            this.initRoles()
            this.initMenuTree()
        },
        methods:{
            initRoles(){
                this.loading = true
                roleList().then(resp => {
                  this.roles = resp.records
                  this.loading = false
                })
            },
            initMenuTree(){
                menuTree().then(resp => {
                  this.menuTree[0].children = resp
                })
            },
            handleCollapseChange(activeItem){
              if(activeItem){
                this.loadingForCard = true
                //请求当前角色的所有资源
                getAllResourceOfRole(activeItem).then(
                  resp => {
                    this.currentRoleAllResources = resp
                    let treeIndex = this.treeRefPrefix + activeItem
                    this.$refs[treeIndex][0].setCheckedKeys(resp)
                    this.loadingForCard = false    
                  }
                ).catch(error => {
                  this.loadingForCard = false
                })
              }
            },
            handleAdd(){
                this.roleInfoForAdd.nameEn = this.roleInfoForAdd.nameEn.trim()
                this.roleInfoForAdd.nameZh = this.roleInfoForAdd.nameZh.trim()
                this.roleInfoForAdd.description = this.roleInfoForAdd.description.trim()
                //校验表单
                if(!this.roleInfoForAdd.nameEn){
                  this.$message({
                    message: '请输入角色英文名',
                    type: 'error'
                  })
                }else if(!this.roleInfoForAdd.nameZh){
                  this.$message({
                    message: '请输入角色中文名',
                    type: 'error'
                  })
                }else{
                  addRole(this.roleInfoForAdd).then(resp => {
                    //重置
                    this.roleInfoForAdd = {
                      nameEn: '',
                      nameZh: '',
                      description: ''                     
                    }
                    //重新初始化角色列表
                    this.initRoles()
                  })
                }
            },
            delRole(role){
              this.$confirm(`你确定删除【${role.nameZh}】角色吗？`, "提示", {
                confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }).then(() => {
                  this.loadingForCard = true//加载
                  delRole(role.id).then(resp => {
                      this.loadingForCard = false
                      //重新初始化角色列表
                      this.initRoles()
                  }).catch(error=>{
                    this.loadingForCard = false
                  })
                });
            },
            cancleUpdate(){
                this.activeCollapseItem = -1;
                this.currentRoleAllResources = []
            },
            doUpdate(roleId){
                this.loadingForCard = true//加载
                let treeIndex = this.treeRefPrefix + roleId
                let selectedNodes = this.$refs[treeIndex][0].getCheckedNodes(false, true)
                let resourceIds = [];
                selectedNodes.forEach(node => {
                  if(node.id !== -1){
                    resourceIds.push(node.id)
                  }
                })
                console.log(selectedNodes)
                console.log(resourceIds)
                setResourceForRole(roleId, resourceIds).then(resp => {
                  this.loadingForCard = false
                }).catch(error => {
                    this.loadingForCard = false
                    //还原结点设置
                    let treeIndex = this.treeRefPrefix + roleId
                    this.$refs[treeIndex][0].setCheckedKeys(this.currentRoleAllResources)                     
                })
            }
        }
    }
</script>

<style>
.header-form{
  margin-top: 10px;
}
.customize-collapse{
  width: 60%;
  min-height: 600px;
}
.collapse-title{
  font-size: 1.3em;
}
.footer-btn-group {
  display: flex;
  justify-content: flex-end;
}
</style>