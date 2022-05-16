<template>
  <el-dialog v-if="dialogVisible" :title="`${bseEleNameMapping[formInline.type]} 控件`" :visible.sync="dialogVisible" width="620px" :close-on-click-modal="false">
    <component ref="bseEleRef" :is="bseEleModules[formInline.type]" :data="formInline" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitFrom">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
const modulesFiles = require.context('@/views/default/testedit/bseEleComponents', true, /\.vue$/)
const bseEleComponents = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
export default {
  components: { ...bseEleComponents },
  data() {
    return {
      title: '',
      dialogVisible: false,
      bseEleNameMapping: {
        select: '下拉',
        checkbox: '复选',
        radio: '单选',
        input: '输入',
        number: '数字',
        label: '标签',
        date: '日期'
      },
      bseEleModules: {
        select: 'Select',
        checkbox: 'Checkbox',
        radio: 'Radio',
        input: 'Input',
        number: 'Number',
        label: 'Label',
        date: 'Date'
      },
      formInline: {}
    }
  },
  methods: {
    // 展示下拉框
    isShow(row) {
      this.formInline = row
      this.dialogVisible = true
    },
    // 确认按钮
    submitFrom() {
      this.$refs.bseEleRef.$refs.attributeForm.validate((valid) => {
        if (valid) {
          this.$emit('closed', this.$refs.bseEleRef.formInline)
          this.dialogVisible = false
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>
