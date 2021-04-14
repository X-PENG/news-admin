<template>
    <sticky :z-index="10" :class-name="'sub-navbar'">
        <SourceUrlDropdown v-model="curExternalUrl" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="info" icon="el-icon-document" @click="saveAsDraft">
            存草稿
        </el-button>
        <el-button v-loading="loading" type="success" icon="el-icon-top" @click="completeInputAndUpload">
            完成并上传
        </el-button>
        <el-button v-loading="loading" type="warning" icon="el-icon-view" @click="preview">
            预览
        </el-button>
        <el-button v-loading="loading" type="primary" icon="el-icon-plus" @click="createNewNews">
            创建新闻
        </el-button>        
    </sticky>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { SourceUrlDropdown } from './Dropdown'

    export default {
        name:'BtnGroupForInputter',
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
        computed: {
            curExternalUrl:{
                get(){
                    return this.externalUrl
                },
                set(val){
                    // console.log('【Inputter】curExternalUrl的set方法，并触发update:externalUrl事件，val='+val)
                    this.$emit("update:externalUrl", val)
                }
            }
        },        
        methods: {
            saveAsDraft(){
                this.$emit('save-by-inputter')
            },
            completeInputAndUpload(){
                this.$emit('submit-by-inputter')
            },
            preview(){
                this.$emit('preview')
            },
            createNewNews(){
                //向父组件发射事件
                this.$emit('create-new-news')
            }
        }
    }
</script>

<style>

</style>