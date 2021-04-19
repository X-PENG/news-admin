<template>
  <el-form :model="form" :rules="rules" ref="form" :key="formKey">
    <el-form-item label="新密码" prop="newPassword">
      <el-input ref='newPassInput' type="password" v-model="form.newPassword" placeholder="请输入新密码" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input type="password" v-model="form.confirmPassword" placeholder="请确认密码" />
    </el-form-item>
    <el-form-item class="flex-right">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updatePassword } from '@/api/user'
export default {
  name: "UpdatePassword",
  data() {
    const checkConfirmPasswd = (rule, value, callback) => {
      let newKey = this.form.newPassword.trim();
      let confirmKey = value.trim();
      if (newKey !== "" && confirmKey === "") {
        callback(new Error("请再次输入密码"));
        return;
      }
      if (newKey !== confirmKey) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      formKey: 'formKey',
      formKey_prefix: 'formKey',
      form: {
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        newPassword: [{ required: true, message: "密码不能为空" }],
        confirmPassword: [{ validator: checkConfirmPasswd }],
      },
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
            updatePassword(undefined, this.form.newPassword).then(resp => {
                this.resetForm()
            })
        }
      });
    },
    resetForm(){
      this.form.newPassword=''
      this.form.confirmPassword=''
      this.formKey = this.formKey_prefix + new Date().getTime()
    }
  },
};
</script>
