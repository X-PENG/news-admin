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
        @save-and-review-success="handleSaveAndReviewSuccess"
      >
      </component>

      <div class="createPost-main-container">
        <el-row>

          <SuggestionBox v-if="showSuggestionBoxNewsStatusList[suggestionBoxTitle]" :title="suggestionBoxTitle" :newsId="postForm.id"/>

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
              <el-row>
                <el-col :span="24">
                  <el-form-item label-width="80px" label="导读片段:">
                        <el-input
                        type="textarea"
                        placeholder="请输入导读片段"
                        v-model="postForm.articleFragmentForShow"
                        :autosize="{ minRows: 3}"
                        maxlength="200"
                        show-word-limit
                        >
                        </el-input>                       
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
import BtnGroupForInputter from './BtnGroupForInputter'
import BtnGroupForEditor from './BtnGroupForEditor'
import BtnGroupForReviewer from './BtnGroupForReviewer'
import SuggestionBox from './SuggestionBox'
import { saveNewsInfo, jumpToPreviewPage } from '@/utils/preview'
import { createNewsAsDraftOrCompleted, saveNewsAsDraftOrCompleted } from '@/api/news/inputter'
import { validURL } from '@/utils/validate'
import { saveOrSaveAndSubmitReview } from '@/api/news/editor'
import { saveOrSaveAndReviewSuccess } from '@/api/news/reviewer'
import { reviewLevelMapApiPathPrefix } from '@/views/news/review/index'
import newsStatusMap from '@/utils/newsStatusMap'

function getDefaultForm(){
  return {
    id: null,
    title: null, // 新闻标题
    articleFragmentForShow: null,//新闻部分片段，用于门户网站的新闻列表进行显示
    content: null, // 新闻内容
    imgSource: null,
    articleSource: null,
    externalUrl: null
  }
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Upload, SuggestionBox, BtnGroupForInputter, BtnGroupForEditor, BtnGroupForReviewer },
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
    },
    //当前正在编辑的新闻的审核等级
    curEditingNewsReviewLevel: {
      type: String,
      default: undefined
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
      //需要显示意见栏（SuggestionBox组件）的新闻状态的列表
      showSuggestionBoxNewsStatusList: {
        '审核失败': true,
        '打回修改': true
      },
      //新闻状态。如果是编辑文章，则用该字段保存新闻状态的code
      newsStatus: undefined       
    }
  },
  computed: {
    suggestionBoxTitle(){
      return newsStatusMap[this.newsStatus]
    }
  },
  created() {
    console.log('ArticleDetail组件的created钩子')
    if (this.isEdit) {
      console.log('编辑文章')
      console.log('fetchDataAPI')
      console.log(this.fetchDataAPI)
      const id = this.$route.query && this.$route.query.id
      const apiExtraParam = reviewLevelMapApiPathPrefix[this.curEditingNewsReviewLevel]
      console.log("api额外参数" + apiExtraParam)
      //如果是编辑新闻，那就先查询新闻
      this.fetchData(id, apiExtraParam)
    }
  },
  methods: {
    /**
     * @param id 新闻id
     * @param apiExtraParam 调用api的额外参数
     */
    fetchData(id, apiExtraParam) {
      this.loadingForEdit = true
      this.fetchDataAPI(id, apiExtraParam).then(resp => {
        if(!resp) {
            this.$message({
                message: '加载失败！可能原因：新闻不存在或没有查询权限。',
                type: 'error'
            })
            this.loadingForEdit = false
            return
        }
        console.log('查到了新闻成功')
        //查到了新闻
        let { id, title, articleFragmentForShow, content, imgSource, articleSource, externalUrl, newsStatus } = resp
        //填充id，则保存就是更新操作
        this.postForm.id = id
        this.postForm.title = title
        this.postForm.articleFragmentForShow = articleFragmentForShow
        this.postForm.content = content
        this.postForm.imgSource = imgSource
        this.postForm.articleSource = articleSource
        this.postForm.externalUrl = externalUrl
        this.loadingForEdit = false
        this.newsStatus = newsStatus
      }).catch(error => {
        this.loadingForEdit = false
      })
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    validateForm(){
      let success = true
      this.$refs.postForm.validate(validateResult => {
          if(!validateResult) {
            success = false
          }
      })
      //验证外链
      let externalUrl = this.postForm.externalUrl
      if(externalUrl && externalUrl.trim() !== '') {
        if(!validURL(externalUrl)){
          this.$message({
            message: '请填写正确的外链',
            type: 'error'
          })        
          success = false
        }
      }
      return success
    },
    //以下是按钮组的事件处理方法
    handleSaveByInputter(){
      // console.log('监听到子组件的save-by-inputter事件 外链='+this.postForm.externalUrl)
      if(this.validateForm()){
        this.validateExternalUrlAndPrompt(this.postForm.externalUrl).then(()=>{
          if(!!this.postForm.id) {
            //有id，则更新
            saveNewsAsDraftOrCompleted(1, this.postForm);
          }else {
            //无id，则创建
            createNewsAsDraftOrCompleted(1, this.postForm).then(resp => {
              if(resp) {
                //如果是创建草稿，就会返回新创建的新闻的id
                console.log('新的新闻的id = ' + resp)
                //将新草稿的id赋给到this.postForm中，表示接下来的保存/上传操作将携带id，是更新操作
                this.postForm.id = resp
              }
            })
          }
        }).catch(error => {
            this.$message({
              message: '取消',
              type: 'info'
            })          
        })
      }
    },
    handleSubmitByInputter(){
      // console.log('监听到子组件的submit-by-inputter事件 外链='+this.postForm.externalUrl)
      if(this.validateForm()){
        this.validateExternalUrlAndPrompt(this.postForm.externalUrl).then(()=>{
          if(!!this.postForm.id) {
            //有id，则更新
            saveNewsAsDraftOrCompleted(2, this.postForm).then(resp => {
                //上传成功后，就向父组件发射创建新闻的事件
                this.$emit('create-new-news')
            });
          }else {
            //无id，则创建
            createNewsAsDraftOrCompleted(2, this.postForm).then(resp => {
                //上传成功后，就向父组件发射创建新闻的事件
                this.$emit('create-new-news')
            });
          }
        }).catch(error => {
            this.$message({
              message: '取消',
              type: 'info'
            })          
        })
      }      
    },
    handlePreview(){
      if(this.validateForm()) {
        //验证通过了才能预览
        if(this.postForm.externalUrl) {
            //如果设置了外链，就跳转到外网
            //是外链，才跳转
            window.open(this.postForm.externalUrl, '_blank'); 
        }else {
          //先将新闻信息存储到localStorage中，全局共享，以便预览新闻组件可以获得新闻信息进行显示
          saveNewsInfo({title: this.postForm.title, articleFragmentForShow: this.postForm.articleFragmentForShow, content: this.postForm.content})
          //跳转到预览新闻页面
          jumpToPreviewPage(this.$router, {})
        }
      }
    },
    handleCreateNewNews(){
      //继续向父组件发射事件
      this.$emit('create-new-news')
    },
    handleSaveByEditor(){
      // console.log('监听到子组件的save-by-editor事件 外链='+this.postForm.externalUrl)
      if(this.validateForm()){
        this.validateExternalUrlAndPrompt(this.postForm.externalUrl).then(()=>{
          saveOrSaveAndSubmitReview(1, this.postForm)
        }).catch(error => {
            this.$message({
              message: '取消',
              type: 'info'
            })          
        })
      }
    },
    handleSubmitByEditor(){
      // console.log('监听到子组件的submit-by-editor事件')
      if(this.validateForm()){
        this.validateExternalUrlAndPrompt(this.postForm.externalUrl).then(()=>{
          saveOrSaveAndSubmitReview(2, this.postForm).then(resp => {
            //送审之后，回到新闻中转站
            this.$router.replace({name: '新闻中转站'})
          })
        }).catch(error => {
            this.$message({
              message: '取消',
              type: 'info'
            })          
        })
      }
    },
    handleSaveByReviewer(){
      // console.log('监听到子组件的save-by-reviewer事件 外链='+this.postForm.externalUrl)
      if(this.validateForm()) {
        this.validateExternalUrlAndPrompt(this.postForm.externalUrl).then(()=>{
          saveOrSaveAndReviewSuccess(reviewLevelMapApiPathPrefix[this.curEditingNewsReviewLevel], 1, this.postForm)
        }).catch(error => {
            this.$message({
              message: '取消',
              type: 'info'
            })          
        })
      }
    },
    handleSaveAndReviewSuccess(){
      // console.log('监听到子组件的review-success事件')
      if(this.validateForm()) {
        this.validateExternalUrlAndPrompt(this.postForm.externalUrl).then(()=>{
          saveOrSaveAndReviewSuccess(reviewLevelMapApiPathPrefix[this.curEditingNewsReviewLevel], 2, this.postForm).then(resp => {
            //审核通过后，回到自己的审核站
            this.$router.replace(`/news/review/${this.curEditingNewsReviewLevel}`)
          })
        }).catch(error => {
            this.$message({
              message: '取消',
              type: 'info'
            })          
        })
      }
    },
    //验证外链，如果设置了外链就提示
    validateExternalUrlAndPrompt(url) {
      return new Promise((resolve, reject) => {
          //如果设置了外链，就提示
          if(url && url.trim() !== '') {
                this.$confirm("检测到新闻设置了外链，除了标题之外的其他信息将都不会保存，你确定吗？", "温馨提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                  resolve()
                }).catch(() => {
                  reject()
                })               
          }else {
              // console.log('没有设置外链，直接resolve')
              resolve()
          }
      })
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
