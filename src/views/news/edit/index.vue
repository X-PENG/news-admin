<template>
  <article-detail 
  :is-edit="isEdit" 
  :current-btn-group="currentBtnGroup" 
  :fetchDataAPI="fetchAPIMap[currentBtnGroup]" 
  :curEditingNewsReviewLevel="curEditingNewsReviewLevel"
  :key="componentKey" 
  @create-new-news="handleCreateNewNews"
  />
</template>

<script>
import ArticleDetail from './components/ArticleDetail'
import { isNumber } from '@/utils/validate'
import { selectDraft } from '@/api/news/inputter'
import { selectTransitNews } from '@/api/news/editor'
import { selectUnderReviewNews } from '@/api/news/reviewer'

/**
 * type和按钮组的映射
 */
const btnGroupMap = {
  'inputter': 'btn-group-for-inputter',
  'editor': 'btn-group-for-editor',
  'reviewer': 'btn-group-for-reviewer', 
}


export default {
  name: "NewsEdit",
  components: { ArticleDetail },
  data() {
    return {
      componentKey_prefix: 'article-detail',
      componentKey: 'article-detail',
      //按钮组和fetchDataAPI的映射
      fetchAPIMap: {
        'btn-group-for-inputter': selectDraft,//传稿人编辑草稿时的查询api
        'btn-group-for-editor': selectTransitNews,//中转新闻查询api 
        'btn-group-for-reviewer': selectUnderReviewNews//查询审核中的新闻的api
      },
      //该属性用来保存 当前正在编辑的新闻的审核等级
      curEditingNewsReviewLevel: undefined
    };
  },
  computed: {
    isEdit(){
      console.log('计算isEdit属性')
      let id = this.$route.query['id']
      let type = this.$route.query['type']
      let reviewLevel = this.$route.query['reviewLevel']
      //如果是编辑一个新闻，且路由参数符合规范，那就是true
      if(isNumber(id) && (type === 'draft' || type === 'transit' || (type === 'review' && isNumber(reviewLevel)))){
        return true
      }
      //否则，不是编辑新闻，那就重新回到 '撰写新闻'路由
      this.$router.replace( { name: '撰写新闻', query:{} } )
      return false
    },
    currentBtnGroup(){
      console.log('计算currentBtnGroup属性')
      let type = this.$route.query['type']
      let id = this.$route.query['id']
      let reviewLevel = this.$route.query['reviewLevel']
      //传了id参数，则可能是要编辑新闻
      if(isNumber(id)){
        if(type === 'draft'){
          //表示要编辑草稿
          return btnGroupMap['inputter']
        }else if(type === 'transit'){
          //表示要编辑中转的新闻
          return btnGroupMap['editor']
        }else if(type === 'review' && isNumber(reviewLevel)){
          //表示要编辑正在审核的新闻
          //保存当前正在编辑的新闻的审核等级
          this.curEditingNewsReviewLevel = reviewLevel
          return btnGroupMap['reviewer']
        }
      }
      //不是编辑新闻，那就是录入新的新闻
      return btnGroupMap['inputter']
    }
  },
  watch: {
    //todo 考虑是否只要路由改变了就更新key，这会带来什么问题？如果用户编写新闻时没保存，此时更新了路由，就会丢失上一次保存后新增或修改的内容
    $route(newRoute, oldRoute){
      this.componentKey = this.componentKey_prefix + new Date().getTime()
    }
  },
  methods: {
    handleCreateNewNews() {
      let queryStr = JSON.stringify(this.$route.query)
      //如果有路由参数，那就只要重新导航到 撰写新闻组件
      if(queryStr !== '{}') {
        this.$router.replace({name: '撰写新闻', query: {} })
      }else {
        //监听到创建新新闻的事件，就更新Key，重新刷新撰写新闻组件
        this.componentKey = this.componentKey_prefix + new Date().getTime()
      }
    }
  }
};
</script>

<style>
</style>