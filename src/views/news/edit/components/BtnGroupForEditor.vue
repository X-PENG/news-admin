<template>
    <sticky :z-index="10" :class-name="'sub-navbar'">
        <SourceUrlDropdown v-model="curExternalUrl" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="save">
            保存
        </el-button>
        <el-button v-loading="loading" type="primary" @click="submit">
            提交审核
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
        name:'BtnGroupForEditor',
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
                    // console.log('【editor】curExternalUrl的set方法，并触发update:externalUrl事件，val='+val)
                    this.$emit("update:externalUrl", val)
                }
            }
        },
        methods: {
            save(){
                console.log('保存修改')
                this.$emit('save-by-editor')
            },
            submit(){
                console.log('提交审核')
                this.$emit('submit-by-editor')
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