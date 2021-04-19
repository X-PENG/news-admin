<template>
  <div class="user-activity">
    <el-form label-width="80px">
      <h4>基本信息</h4>
      <el-form-item label="用户名">
        <span>{{ user.username }}</span>
      </el-form-item>
      <el-form-item label="实名">
        <span>{{ user.realName }}</span>
      </el-form-item>
      <el-form-item label="性别">
        <span> {{ user.gender == true ? "男" : "女" }}</span>
      </el-form-item>
      <el-form-item label="备注">
        <span v-if="!editStatus"> {{ user.description || "无" }} </span>
        <el-input
          v-else
          class="input-width-60"
          v-model="newUserInfo.description"
          placeholder="请填写用户描述"
          size="mini"
        ></el-input>
      </el-form-item>
      <h4>联系信息</h4>
      <el-form-item label="手机">
        <span v-if="!editStatus">{{ user.phone }}</span>
        <el-input
          v-else
          class="input-width-30"
          v-model="newUserInfo.phone"
          placeholder="请输入手机号"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <span v-if="!editStatus"> {{ user.email }}</span>
        <el-input
          v-else
          class="input-width-30"
          v-model="newUserInfo.email"
          placeholder="请输入邮箱地址"
          size="mini"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-divider class="divider-margin"></el-divider>
    <el-row v-if="!editStatus" type="flex">
      <el-col :span="24" class="flex-right">
        <el-button
          size="mini"
          icon="el-icon-edit"
          circle
          plain
          @click="edit"
        ></el-button>
      </el-col>
    </el-row>
    <el-row v-else type="flex" justify="center" :gutter="10">
      <el-col :span="24" class="flex-right">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-check"
          circle
          plain
          @click="submitEdit"
        ></el-button>
        <el-button
          icon="el-icon-close"
          size="mini"
          circle
          @click="cancle"
        ></el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "PersonalInfo",
  props: {
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      editStatus: false,
      newUserInfo: {
        description: "",
        phone: "",
        email: "",
      },
    };
  },
  methods: {
    edit() {
      this.newUserInfo.description = this.user.description
      this.newUserInfo.phone = this.user.phone
      this.newUserInfo.email = this.user.email
      this.editStatus = true;
    },
    cancle() {
      this.editStatus = false;
    },
    async submitEdit(){
      //校验表单内容
      let newPhone = this.newUserInfo.phone
      if(!newPhone || newPhone.trim() === '') {
        this.$message({
          message: '手机号码不能为空！',
          type: 'error'
        })
        return
      }
      //请求修改用户信息
      await this.$store.dispatch('user/updateInfo', this.newUserInfo)
      //再请求最新的用户信息
      await this.$store.dispatch('user/getInfo')
      this.editStatus = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {
    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }

    .username {
      font-size: 16px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;

    .image {
      width: 100%;
      height: 100%;
    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {
      &:hover,
      &:focus {
        color: #999;
      }
    }
  }
}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
.divider-margin {
  margin: 10px 0;
}
.input-width-20 {
  width: 20%;
}
.input-width-30 {
  width: 30%;
}
.input-width-40 {
  width: 40%;
}
.input-width-50 {
  width: 50%;
}
.input-width-60 {
  width: 60%;
}
</style>
