<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      外链
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding no-border" style="width:400px">
      <el-form-item label-width="0px" style="margin-bottom: 0px" prop="source_uri">
        <el-input v-model="source_uri" placeholder="请输入外网链接" clearable @blur="handleBlur">
          <template slot="prepend">
            网址
          </template>
        </el-input>
      </el-form-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { validURL } from '@/utils/validate'

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    source_uri: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    handleBlur(){
      this.validateSourceUri()
    },
    validateSourceUri(){
      if (this.source_uri && !validURL(this.source_uri)) {
        this.$message({
          message: '外链url填写不正确',
          type: 'error'
        })
      }        
    }  
  }
}
</script>
