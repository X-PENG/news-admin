<template>
  <div class="createPost-container" v-loading="loadingForEdit">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-position='left'>

      <component
        v-bind:is="currentBtnGroup"
        :externalUrl.sync="postForm.externalUrl"
        @save-by-inputter="handleSaveByInputter" 
        @submit-by-inputter="handleSubmitByInputter"
        @create-new-news="handleCreateNewNews"
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
                    <el-input v-model="postForm.articleSource" placeholder="文字来源"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label-width="80px" label="图片来源:">
                    <el-input v-model="postForm.imgSource" placeholder="图片来源"></el-input>
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
import { saveNewsInfo, jumpToPreviewPage } from '@/utils/preview'
import { createOrSaveNewsAsDraftOrCompleted } from '@/api/news/inputter'

function getDefaultForm(){
  return {
    id: null,
    title: null, // 文章题目
    content: null, // 文章内容
    imgSource: null,
    articleSource: null,
    externalUrl: null
  }
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
    },
    fetchDataAPI: {
      type: Function,
      default: null
    }
  },
  data() {
    const validateTitle = (rule, value, callback) => {
      if (!value || value.trim() === '') {
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
      loadingForEdit: false,
      postForm: getDefaultForm(),
      rules: {
        title: [{ validator: validateTitle }],
      },
    }
  },
  created() {
    console.log('ArticleDetail组件的created钩子')
    if (this.isEdit) {
      console.log('编辑文章')
      console.log('fetchDataAPI')
      console.log(this.fetchDataAPI)
      const id = this.$route.query && this.$route.query.id
      //如果是编辑新闻，那就先查询新闻
      this.fetchData(id)
    }
  },
  methods: {
    fetchData(id) {
      this.loadingForEdit = true
      this.fetchDataAPI(id).then(resp => {
        if(!resp) {
            this.$message({
                message: '加载失败！可能原因：新闻不存在或没有查询权限。',
                type: 'error'
            })
            this.loadingForEdit = false
            return
        }
        console.log('查询草稿成功')
        //查到了新闻
        let { id, title, content, imgSource, articleSource, externalUrl } = resp
        //填充id，则保存就是更新操作
        this.postForm.id = id
        this.postForm.title = title
        this.postForm.content = content
        this.postForm.imgSource = imgSource
        this.postForm.articleSource = articleSource
        this.postForm.externalUrl = externalUrl
        this.loadingForEdit = false
      }).catch(error => {
        this.loadingForEdit = false
      })
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    validateForm(){
      let success
      this.$refs.postForm.validate(validateResult => {
          success = validateResult
      })
      return success
    },
    //以下是按钮组的事件处理方法
    handleSaveByInputter(){
      // console.log('监听到子组件的save-by-inputter事件 外链='+this.postForm.externalUrl)
      if(this.validateForm()){
        console.log(this.postForm)
        createOrSaveNewsAsDraftOrCompleted(1, this.postForm).then(resp => {
          if(resp) {
            //如果是创建草稿，就会返回新创建的新闻的id
            console.log('新的新闻的id = ' + resp)
            //将新草稿的id赋给到this.postForm中，表示接下来的保存/上传操作将携带id，是更新操作
            this.postForm.id = resp
          }
        })
      }
    },
    handleSubmitByInputter(){
      // console.log('监听到子组件的submit-by-inputter事件 外链='+this.postForm.externalUrl)
      if(this.validateForm()){
        console.log(this.postForm)
        createOrSaveNewsAsDraftOrCompleted(2, this.postForm).then(resp => {
            //上传成功后，就向父组件发射创建新闻的事件
            this.$emit('create-new-news')
        })
      }      
    },
    handlePreview(){
      console.log('监听到子组件的preview事件')
      //将title、content存储到vuex中，全局共享，以便共享数据
      saveNewsInfo({title: this.postForm.title, content: this.postForm.content})
      //跳转到预览新闻页面
      jumpToPreviewPage(this.$router, {})
    },
    handleCreateNewNews(){
      //继续向父组件发射事件
      this.$emit('create-new-news')
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
