<template>
  <div class="app-container">
    <div v-if="userInfo">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="userInfo" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="个人资料" name="personalInfo">
                <personalInfo :user='userInfo' />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="updatePassword">
                <updatePassword />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import PersonalInfo from './components/PersonalInfo'
import UpdatePassword from './components/UpdatePassword'

export default {
  name: 'Profile',
  components: { UserCard, PersonalInfo, UpdatePassword },
  data() {
    return {
      user: {},
      activeTab: 'personalInfo'
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  }
  // created() {
  //   this.getUser()
  // },
  // methods: {
  //   getUser() {
  //     this.user = this.userInfo
  //   }
  // }
}
</script>
