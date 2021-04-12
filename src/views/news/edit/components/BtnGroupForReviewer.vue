<template>
    <sticky :z-index="10" :class-name="'sub-navbar'">
        <SourceUrlDropdown v-model="curExternalUrl" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="save">
            保存
        </el-button>
        <el-button v-loading="loading" type="primary" @click="reviewSuccess">
            审核通过
        </el-button>
        <el-button v-loading="loading" type="danger" @click="reviewFail">
            审核失败
        </el-button>
        <el-button v-loading="loading" type="warning" @click="preview">
            预览
        </el-button>
    </sticky>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { SourceUrlDropdown } from './Dropdown'

    export default {
        name:'BtnGroupForReviewer',
        components: { Sticky, SourceUrlDropdown },
        props: {
            externalUrl: {
                type: String,
                default: null
            }
        },           
        data() {
            return {
                loading: false
            }
        },
        computed:{
            reviewLevel(){
                let level = this.$route.query['reviewLevel']
                console.log('计算审核等级 '+level)
                return level
            },
            curExternalUrl:{
                get(){
                    return this.externalUrl
                },
                set(val){
                    // console.log('【Reviewer】curExternalUrl的set方法，并触发update:externalUrl事件，val='+val)
                    this.$emit("update:externalUrl", val)
                }
            }            
        },
        methods: {
            save(){
                console.log('保存')
                this.$emit('save-by-reviewer')
            },
            reviewSuccess(){
                console.log('审核通过')
                this.$emit('review-success')
            },
            reviewFail(){
                console.log('审核失败')
                this.$emit('review-fail')
            },
            preview(){
                console.log('预览')
                this.$emit('preview')
            }
        }

    }
</script>

<style>

</style>