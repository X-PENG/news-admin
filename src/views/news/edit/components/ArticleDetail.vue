<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-position='left'>

      <component
        v-bind:is="currentBtnGroup"
        :externalUrl.sync="postForm.externalUrl"
        @save-by-inputter="handleSaveByInputter" 
        @submit-by-inputter="handleSubmitByInputter"
        @preview="handlePreview"
        @save-by-editor="handleSaveByEditor"
        @submit-by-editor="handleSubmitByEditor"
        @save-by-reviewer="handleSaveByReviewer"
        @review-success="handleReviewSuccess"
        @review-fail="handleReviewFail"
      >
      </component>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                新闻标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row type="flex" :gutter="20">
                <el-col :span="12">
                  <el-form-item label-width="80px" label="文字来源:">
                    <el-input v-model="postForm.article_source" placeholder="文字来源"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label-width="80px" label="图片来源:">
                    <el-input v-model="postForm.img_source" placeholder="图片来源"></el-input>
                  </el-form-item>
                </el-col>                
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>

        <!-- <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <Upload v-model="postForm.image_uri" />
        </el-form-item> -->
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { SourceUrlDropdown } from './Dropdown'
import BtnGroupForInputter from './BtnGroupForInputter'
import BtnGroupForEditor from './BtnGroupForEditor'
import BtnGroupForReviewer from './BtnGroupForReviewer'
import { saveNewsInfo } from '@/utils/preview'

const defaultForm = {
  id: null,
  title: '', // 文章题目
  content: '', // 文章内容
  img_source: null,
  article_source: null,
  externalUrl: null
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Upload, Sticky, SourceUrlDropdown, BtnGroupForInputter, BtnGroupForEditor, BtnGroupForReviewer },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    currentBtnGroup: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateTitle = (rule, value, callback) => {
      if (value.trim() === '') {
        let msg = '标题不能为空'
        this.$message({
          message: msg,
          type: 'error'
        })
        callback(new Error(msg))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        title: [{ validator: validateTitle }],
      },
      tempRoute: {}
    }
  },
  created() {
    if (this.isEdit) {
      console.log('编辑文章')
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      /**
       * todo 根据type，查询草稿、中转新闻、n审中的新闻，会使用不同的接口  
       */
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    validateForm(){
      let success
      this.$refs.postForm.validate(validateResult => {
          success=validateResult
      })
      return success
    },
    //以下是按钮组的事件处理方法
    handleSaveByInputter(){
      // console.log('监听到子组件的save-by-inputter事件 外链='+this.postForm.externalUrl)
      if(this.validateForm()){
        console.log(this.postForm)
      }
    },
    handleSubmitByInputter(evnt){
      // console.log('监听到子组件的submit-by-inputter事件 外链='+this.postForm.externalUrl)
    },
    handlePreview(){
      console.log('监听到子组件的preview事件')
      //将title、content存储到vuex中，全局共享，以便共享数据
      saveNewsInfo({title: this.postForm.title, content: this.postForm.content})
      //跳转到预览新闻路由
      let routeUrl = this.$router.resolve({
           path: "/news/preview"
      });
      window.open(routeUrl.href, '_blank');      
    },
    handleSaveByEditor(){
      // console.log('监听到子组件的save-by-editor事件 外链='+this.postForm.externalUrl)
    },
    handleSubmitByEditor(){
      // console.log('监听到子组件的submit-by-editor事件')
    },
    handleSaveByReviewer(){
      // console.log('监听到子组件的save-by-reviewer事件 外链='+this.postForm.externalUrl)
    },
    handleReviewSuccess(){
      // console.log('监听到子组件的review-success事件')
    },
    handleReviewFail(){
      // console.log('监听到子组件的review-fail事件')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
