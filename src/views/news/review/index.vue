<template>
    <div class="app-container">
        <h1>新闻审核</h1>
        <h2>{{ curReviewLevel }}</h2>
    </div>
</template>

<script>
    export default {
        name:'NewsReview',
        data() {
            return {
            }
        },
        computed:{
            //当前审核等级：1,2,3...，由路由决定
            curReviewLevel(){
                let path = this.$route.path
                return path.substring(path.lastIndexOf('/')+1, path.length)
            }
        }
    }
</script>

<style>

</style>