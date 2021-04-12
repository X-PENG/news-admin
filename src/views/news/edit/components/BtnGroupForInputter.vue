<template>
    <sticky :z-index="10" :class-name="'sub-navbar'">
        <SourceUrlDropdown v-model="curExternalUrl" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="saveAsDraft">
            存草稿
        </el-button>
        <el-button v-loading="loading" type="primary" @click="completeInputAndUpload">
            完成并上传
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
                // console.log('保存为草稿')
                this.$emit('save-by-inputter')
            },
            completeInputAndUpload(){
                console.log('完成并上传')
                this.$emit('submit-by-inputter')
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