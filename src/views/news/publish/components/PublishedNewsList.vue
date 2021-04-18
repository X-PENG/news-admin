<template>
    <div>
        <h1>已发布新闻列表</h1>
    </div>
</template>

<script>
    export default {
        //已发布新闻列表组件
        name:'PublishedNewsList',
        data() {
            return {

            }
        },
        created(){
            console.log('已发布组件created钩子')
        },
        destroyed(){
            console.log('已发布组件destroyed钩子')
        }
    }
</script>

<style>

</style>