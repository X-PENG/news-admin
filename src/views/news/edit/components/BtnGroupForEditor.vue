<template>
    <sticky :z-index="10" :class-name="'sub-navbar'">
        <SourceUrlDropdown v-model="curExternalUrl" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" icon="el-icon-document-checked" @click="save">
            保存
        </el-button>
        <el-button v-loading="loading" type="primary" icon="el-icon-check" @click="submit">
            保存并送审
        </el-button>
        <el-button v-loading="loading" type="warning" icon="el-icon-view" @click="preview">
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
                this.$emit('save-by-editor')
            },
            submit(){
                this.$emit('submit-by-editor')
            },
            preview(){
                this.$emit('preview')
            }
        }
    }
</script>

<style>

</style>