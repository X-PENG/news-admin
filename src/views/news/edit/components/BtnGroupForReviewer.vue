<template>
    <sticky :z-index="10" :class-name="'sub-navbar'">
        <SourceUrlDropdown v-model="curExternalUrl" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="save">
            保存
        </el-button>
        <el-button v-loading="loading" type="primary" @click="saveAndreviewSuccess">
            保存并通过审核
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
                this.$emit('save-by-reviewer')
            },
            saveAndreviewSuccess(){
                //向父组件发射事件
                this.$emit('save-and-review-success')
            },
            preview(){
                this.$emit('preview')
            }
        }

    }
</script>

<style>

</style>