<template>
  <div class="app-container">

    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-row :gutter="6">
        <el-col :span="3">
          <el-input
            v-model="queryParam.username"
            placeholder="用户名"
            class="filter-item"
            size="small"
          />
        </el-col>
        <el-col :span="3">
          <el-input
            v-model="queryParam.realName"
            placeholder="实名"
            style="width: 150px"
            class="filter-item"
            size="small"
          />
        </el-col>
        <el-col :span="2">
          <el-select
            v-model="queryParam.gender"
            placeholder="性别"
            clearable
            class="filter-item"
            size="small"
            @clear='clearGender'
          >
            <el-option
              v-for="item in sexs"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input
            v-model="queryParam.phone"
            placeholder="电话"
            class="filter-item"
            size="small"
          />
        </el-col>
        <el-col :span="3">
          <el-input
            v-model="queryParam.email"
            placeholder="邮箱"
            class="filter-item"
            size="small"
          />
        </el-col>
        <el-col :span="2">
          <el-select
            v-model="queryParam.locked"
            placeholder="状态"
            clearable
            @clear='clearStatus'
            class="filter-item"
            size="small"
          >
            <el-option
              key="enable"
              label="锁定"
              value="true"
            />
            <el-option
              key="disable"
              label="未锁定"
              value="false"
            />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="queryParam.roleId"
            placeholder="角色"
            clearable
            @clear='clearRole'
            class="filter-item"
            size="small"
            :loading="roleSelect.loading"
            @visible-change="remoteSearchRoles"
          >
            <el-option
              v-for="item in allRoles"
              :key="item.id"
              :label="item.nameZh"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
            size="small"
          >
            搜索
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-refresh"
            @click="resetFilter"
            size="small"
          >
            重置
          </el-button>
          <el-button
            style="margin-left: 10px"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
            size="small"
          >
            添加
          </el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      v-loading="listLoading"
      :data="data.records"
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
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="实名" width="100">
        <template slot-scope="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" width="80">
        <template slot-scope="scope">
          {{ scope.row.gender ? "男" : "女" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否锁定">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.locked"
            @change="changeLockedStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click.native="removeItem(scope.row)"
          >
            删除
          </el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-s-operation"
            @click.native="clickRolesSettingItem(scope.row)"
            >角色分配</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--
  .sync是一个语法糖。:page.sync="data.current"相当于：:page="data.current" @update:page="data.current=$event"
-->
    <pagination
      v-show="data.total > 0"
      :total="data.total"
      :page.sync="data.current"
      :limit.sync="data.size"
      :pageSizes="pageSizes"
      @pagination="handlePagination"
    />

    <!-- 角色分配对话框 -->
    <el-dialog
      :title="rolesDialogTitle"
      :visible.sync="rolesDialog.visible"
      width="25%"
      style="height: 600px"
    >
      <el-scrollbar wrap-class="scrollbar-wrapper" style="height: 300px">
        <el-tree
          v-loading="rolesDialog.loading"
          :data="rolesDialog.data"
          ref="rolesTree"
          show-checkbox
          node-key="id"
          :default-checked-keys="rolesDialog.defaultCheckedRoles"
          :props="rolesDialog.defaultProps"
        >
        </el-tree>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitRoles"
          size="small"
          :disabled="!rolesDialog.curUserInfo.id"
          >提交</el-button
        >
      </div>
    </el-dialog>

<!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialog.visible"
      width="50%"
      class="userDialog"
      :destroy-on-close="addUserDialog.destroyOnClose"
    >
     <el-form
      ref="addUserForm"
      :model="addUserDialog.userInfo"
      :rules="addUserDialog.rules"
      class="login-form"
      auto-complete="on"
      label-position="right"
      label-width="80px"
    >
    <el-row>
      <el-col :span="12">
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="addUserDialog.userInfo.username"
            placeholder="用户名"
            type="text"
            tabindex="1"
          />
        </el-form-item>        
      </el-col>
      <el-col :span="12">
        <el-form-item prop="realName" label="实名">
          <el-input
            v-model="addUserDialog.userInfo.realName"
            placeholder="实名"
            type="text"
            tabindex="2"
          />
        </el-form-item>        
      </el-col>
      <el-col :span="12">
        <el-form-item prop="passwd" label="密码">
          <el-input
            v-model="addUserDialog.userInfo.passwd"
            type="password"
            placeholder="密码"
            tabindex="3"
          />
        </el-form-item>           
      </el-col>
      <el-col :span="12">
        <el-form-item prop="confirmedPasswd" label="确认密码">
          <el-input
            v-model="addUserDialog.userInfo.confirmedPasswd"
            type="password"
            placeholder="确认密码"
            tabindex="4"
          />
        </el-form-item>  
      </el-col>
      <el-col :span="12">
        <el-form-item prop="gender" label="性别">
          <el-select tabindex="5" v-model="addUserDialog.userInfo.gender" placeholder="性别">
            <el-option label="男" value="true"></el-option>
            <el-option label="女" value="false"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="phone" label="电话">
          <el-input
            v-model="addUserDialog.userInfo.phone"
            type="text"
            placeholder="电话"
            tabindex="6"
          />
        </el-form-item> 
      </el-col>
      <el-col :span="12">
        <el-form-item prop="email" label="邮箱">
          <el-input
            v-model="addUserDialog.userInfo.email"
            type="text"
            placeholder="邮箱"
            tabindex="7"
          />
        </el-form-item> 
      </el-col>
      <el-col :span="12">
        <el-form-item prop="description" label="备注">
          <el-input
            v-model="addUserDialog.userInfo.description"
            type="text"
            placeholder="备注"
            tabindex="8"
          />
        </el-form-item>  
      </el-col>
    </el-row>

    </el-form>     
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitUserInfo"
          >提交</el-button
        >
      </div>
    </el-dialog>    
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import {
  queryUserList,
  getAllRoles,
  getRolesOfUser,
  setRolesForUser,
  lockOrUnlockUser,
  delUser,
  addUser
} from "@/api/userManager";

export default {
  name: "User",
  components: { Pagination },
  data() {
    const checkPasswd = (rule, value, callback) => {
        if(!value){
          callback(new Error("请输入密码"));
        }else if(!value.trim()){
          callback(new Error("密码不能都是空格"));
        }else{
          callback()
        }
    }
    const checkConfirmPasswd = (rule, value, callback) => {
      let key = this.addUserDialog.userInfo.passwd.trim();
      let confirmKey = value.trim();
      if (key !== "" && confirmKey === "") {
        callback(new Error("请再次输入密码"));
        return;
      }
      if (key !== confirmKey) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };    
    return {
      //数据是一个分页对象
      data: {
        total: 0,
        current: 1,
        size: 5,
        records: [],
      },
      listLoading: true,
      queryParam: {
        page: 1,
        size: 5,
        username: null,
        realName: null,
        gender: null,
        phone: null,
        email: null,
        locked: null,
        roleId: null,
      },
      pageSizes: [5, 10, 15, 20],
      sexs: [
        {
          key: 'man',
          label: '男',
          value: true
        },
        {
          key: 'woman',
          label: '女',
          value: false
        }
      ],
      roleSelect: {
        loading: true,
      },
      allRoles: [],
      rolesDialog: {
        visible: false,
        loading: true,
        curUserInfo: {
          //当前正在操作的用户
          id: undefined,
          name: undefined,
        },
        defaultProps: {
          label: "nameZh",
        },
        defaultCheckedRoles: [],
        data:[]
      },
      addUserDialog: {
        visible: false,
        destroyOnClose: true,
        userInfo: {
          username: '',
          realName: '',
          passwd: '',
          confirmedPasswd: '',
          gender: undefined,
          phone: '',
          email: '',
          description: ''
        },
        rules: {
            username: [
              { required: true, trigger: "blur", message: '请输入用户名' },
            ],
            realName: [
              { required: true, trigger: "blur", message: '请输入实名' },
            ],
            passwd: [
              { validator: checkPasswd },
            ],
            confirmedPasswd: [
              { validator: checkConfirmPasswd },
            ],
            gender: [
              { required: true, trigger: "change", message: '请选择性别' },
            ],
            phone: [
              { required: true, trigger: "blur", message: '请输入电话' },
            ]
        }
      }
    };
  },
  computed: {
    rolesDialogTitle() {
      return `【${this.rolesDialog.curUserInfo.name}】的角色列表`;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.queryData();
    },
    //查询数据
    queryData() {
      console.log("queryData");
      this.listLoading = true;
      queryUserList(this.queryParam).then((resp) => {
        this.listLoading = false;
        this.data = resp;
      });
    },
    changeLockedStatus(row) {
      lockOrUnlockUser(row.id, row.locked).catch((error) => {
        row.locked = !row.locked; //改回去
      });
    },
    removeItem(row) {
      this.$confirm(`你确定删除【${row.realName}】用户吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        delUser(row.id).then((resp) => {
          //重新加载当前页
          this.queryData();
        });
      });
    },
    async clickRolesSettingItem(row) {
      this.rolesDialog.curUserInfo.id = undefined; //设为undefined，不允许点击提交按钮
      this.rolesDialog.curUserInfo.name = row.realName;
      //对话框显示之前，清空数据
      this.rolesDialog.data = []
      this.rolesDialog.defaultCheckedRoles = [];

      this.rolesDialog.visible = true;
      this.rolesDialog.loading = true;
      if(this.allRoles.length == 0){
        this.allRoles = await getAllRoles();
      }
      let rolesOfUser = await getRolesOfUser(row.id);
      this.rolesDialog.data = this.allRoles
      this.rolesDialog.defaultCheckedRoles = rolesOfUser;
      this.rolesDialog.loading = false;
      this.rolesDialog.curUserInfo.id = row.id;
    },
    handlePagination({ page, limit }) {
      // console.log("handlePagination");
      this.queryParam.page = page;
      this.queryParam.size = limit;
      this.queryData();
    },
    submitRoles() {
      let checkedKeys = this.$refs.rolesTree.getCheckedKeys(true);
      setRolesForUser(this.rolesDialog.curUserInfo.id, checkedKeys).then((resp) => {
        this.rolesDialog.visible = false;
      });
    },
    handleFilter(){
      this.queryParam.page = 1
      this.queryData()
    },
    resetFilter(){
      this.queryParam.page = 1
      this.queryParam.username = null
      this.queryParam.realName = null
      this.queryParam.gender = null
      this.queryParam.phone = null
      this.queryParam.email = null
      this.queryParam.locked = null
      this.queryParam.roleId = null
        
    },
    handleAdd(){
      this.resetUserInfo()//重置信息
      this.addUserDialog.visible = true
    },
    clearGender(){
        this.queryParam.gender = null
    },
    clearStatus(){
      this.queryParam.locked = null
    },
    clearRole(){
      this.queryParam.roleId = null
    },
    async remoteSearchRoles(visible){
        if(visible){
          this.roleSelect.loading = true
          if(this.allRoles.length == 0){
            this.allRoles = await getAllRoles()
          }
          this.roleSelect.loading=false
        }else{
          this.roleSelect.loading = true
        }
    },
    submitUserInfo(){
      this.$refs.addUserForm.validate((validateResult) => {
        if(validateResult){
           console.log('添加用户') 
           addUser(this.addUserDialog.userInfo).then((resp)=>{
              this.resetUserInfo()
              //刷新表格
              this.queryParam.page = 1
              this.queryData()
           })
        }
      })
    },
    resetUserInfo(){
      this.addUserDialog.userInfo = {
        username: '',
        realName: '',
        passwd: '',
        confirmedPasswd: '',
        gender: undefined,
        phone: '',
        email: '',
        description: ''
      }
    }
  },
};
</script>

<style>
.el-table th.gutter {
  display: table-cell !important;
}
.userDialog .el-dialog{
  padding: 0px 25px;
}
.userDialog .el-dialog__body{
  padding-bottom: 10px;
}
</style>