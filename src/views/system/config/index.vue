<template>
    <div class="app-container">
        <el-form ref="form" :model="configForm" label-width="80px" class="configForm" v-loading="loading">
            <el-form-item label="审核等级">
                <el-slider
                    v-model="configForm.reviewLevel"
                    :max="maxReviewLevel"
                    show-input
                    show-stops
                    @change="handleChange"
                    />
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {getCurSystemConfig, setReviewLevel} from '@/api/system/config'

    export default {
        name:'SystemConfig',
        data() {
            return {
                loading: false,
                maxReviewLevel: 10,
                oldReviewLevel: 0,//用于恢复滑块
                configForm: {
                    reviewLevel: 0
                }
            }
        },
        created(){
            this.initConfig()
        },
        methods: {
            async initConfig(){
                this.loading = true
                let curConfig = await getCurSystemConfig()
                this.maxReviewLevel = curConfig.maxReviewLevel
                this.configForm.reviewLevel = curConfig.reviewLevel
                this.oldReviewLevel = curConfig.reviewLevel
                this.loading = false
            },
            handleChange(val){
                console.log("值改变 val = " + val)
                this.$confirm(`你确定将审核等级改为【${val}】吗？`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    setReviewLevel(val).then(resp => {
                        this.oldReviewLevel = val //重新设置旧值
                    }).catch(error => {
                        this.configForm.reviewLevel = this.oldReviewLevel//恢复滑块
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });                       
                    this.configForm.reviewLevel = this.oldReviewLevel//恢复滑块
                })
            }
        }
    }
</script>

<style>
.configForm{
    width: 60%;
}
</style>