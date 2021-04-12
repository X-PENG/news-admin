<template>
  <article-detail :is-edit="isEdit" :current-btn-group="currentBtnGroup" :key="componentKey"/>
</template>

<script>
import ArticleDetail from './components/ArticleDetail'
import {isNumber} from '@/utils/validate'
 
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
      componentKey: 'article-detail'
    };
  },
  computed: {
    isEdit(){
      console.log('计算isEdit属性')
      let type = this.$route.query['type']
      let id = this.$route.query['id']
      let reviewLevel = this.$route.query['reviewLevel']
      //如果是编辑一个新闻，那就是true
      if(isNumber(id) && (type === 'draft' || type === 'transit' || (type === 'review' && isNumber(reviewLevel)))){
        return true
      }
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
          //要编辑草稿
          return btnGroupMap['inputter']
        }else if(type === 'transit'){
          //要编辑中转的新闻
          return btnGroupMap['editor']
        }else if(type === 'review' && isNumber(reviewLevel)){
          //要编辑正在审核的新闻
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
};
</script>

<style>
</style>