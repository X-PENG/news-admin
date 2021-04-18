<template>
    <div class="app-container">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="待发布" name="first">
                <!-- v-if决定创建/销毁组件 -->
                <UnpublishedNewsList v-if="activeName === 'first'"/>
            </el-tab-pane>
            <el-tab-pane label="已发布" name="second">
                <PublishedNewsList  v-if="activeName === 'second'"/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import UnpublishedNewsList from './components/UnpublishedNewsList'
import PublishedNewsList from './components/PublishedNewsList'

    export default {
        name:'NewsPub',
        components: { UnpublishedNewsList, PublishedNewsList },
        data() {
            return {
                activeName: 'first'
            }
        }
    }
</script>

<style>

</style>