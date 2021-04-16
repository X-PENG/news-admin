<template>
    <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="50%"
    >
        <el-input
        type="textarea"
        placeholder="请填写意见"
        v-model="textAreaContent"
        :autosize="{ minRows: 10}"
        maxlength="300"
        show-word-limit
        >
        </el-input>    
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">提 交</el-button>
    </span>
    </el-dialog>    
</template>

<script>
    export default {
        name:'SuggestionDialog',
        props: {
            showDialog: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: '无标题'
            },
            suggestion: {
                type: String,
                default: ''
            }
        },
        data() {
            return {

            }
        },
        computed: {
            dialogVisible: {
                get() {
                    return this.showDialog
                },
                set(val) {
                    this.$emit('update:showDialog', val)
                }
            },
            textAreaContent: {
                get() {
                    return this.suggestion
                },
                set(val) {
                    this.$emit('update:suggestion', val)
                }
            }
        },
        methods: {
            handleSubmit() {
                this.$emit('complete-suggest')
            }
        }
    }
</script>

<style>

</style>