<template>
  <el-form label-width="80px" :model="formInline" :rules="rules" ref="attributeForm" :inline="true">
    <el-form-item label="名称" class="form-item" prop="name">
      <el-input class="input-item" v-model="formInline.name" placeholder="请输入名称"></el-input>
    </el-form-item>
    <el-form-item label="编码" class="form-item" prop="id">
      <el-input class="input-item" v-model="formInline.id" placeholder="请输入编码"></el-input>
    </el-form-item>
    <el-form-item label="水印" class="form-item">
      <el-input class="input-item" v-model="formInline.placeholder" placeholder="请输入水印"></el-input>
    </el-form-item>
    <el-form-item label="默认值" class="form-item">
      <el-input class="input-item" v-model="formInline.value" placeholder="请输入默认值"></el-input>
    </el-form-item>
    <el-form-item label="提示信息" class="form-fullitem">
      <el-input class="input-item" v-model="formInline.altTitle" placeholder="请输入提示信息"></el-input>
    </el-form-item>
    <el-form-item label="行为属性" class="form-item">
      <el-checkbox v-model="notallowdeleteChecked" :true-label="1" :false-label="0" @change="val => (formInline.notallowdelete = val == 0 ? false : true)" label="不允许删除"></el-checkbox>
    </el-form-item>
    <el-form-item label=" " class="form-item">
      <el-checkbox v-model="contenteditableChecked" :true-label="1" :false-label="0" @change="val => (formInline.contenteditable = val == 0 ? true : false)" label="只读"></el-checkbox>
    </el-form-item>
    <el-form-item label="最大值" class="form-item">
      <el-input class="input-item" v-model="formInline.max" placeholder="请输入最大个数"></el-input>
    </el-form-item>
    <el-form-item label="最小值" class="form-item">
      <el-input class="input-item" v-model="formInline.min" placeholder="请输入最小个数"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    data: {
      type: Object,
      default() { return {}}
    }
  },
  data() {
    return {
      formInline: { },
      activeRow: {}, // 当前活动行数据
      rules: {
        name: { required: true, message: '请输入名称', trigger: 'blur' },
        id: { required: true, message: '请输入编码', trigger: 'blur' }
      },
      notallowdeleteChecked: null,
      contenteditableChecked: null
    }
  },
  watch: {
    data: {
      handler(newValue) {
        this.$nextTick(() => {
          Object.prototype.toString.call(this.data) === '[object Object]' && (this.formInline = { ...this.formInline, ...newValue })
          this.notallowdeleteChecked = this.formInline.notallowdelete ? 1 : 0
          this.contenteditableChecked = this.formInline.contenteditable === false ? 1 : 0
          this.$refs.attributeForm.resetFields()
          this.$refs.attributeForm.clearValidate()
        })
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
/deep/ .label-desc {
  width: 73px;
}
/deep/ .el-tabs__header {
  margin: 0;
}
/deep/ .el-tabs__item {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}
/deep/ .el-tabs__content {
  border: 1px solid #e4e7ed;
  border-top: none;
  min-height: 100px;
  position: relative;
  padding: 8px;
}
.control-wrap {
  margin-top: 4px;
}
.option-list {
  font-size: 12px;
  cursor: pointer;
  overflow: auto;
  min-height: 70px;
  max-height: 150px;
}
.option-list li {
  border-bottom: 1px solid #e4e7ed;
  padding: 5px;
}
.form-item {
  width: calc(50% - 20px);
}
.form-fullitem {
  width: calc(100%);
}
.form-item_special {
  margin: 0;
}
.form-item_special, .form-item_special /deep/ .el-form-item__content {
  width: 100%;
}
/deep/ .el-input-group__prepend {
  padding: 0;
  width: 45px;
  text-align: center;
  letter-spacing: 2px;
}
.active {
  background: #f5f5f5;
}
.language-title {
  padding: 0 5px;
  color: white;
  font-size: 12px;
  background: #54c292;
}
.dynamic-wrap {
  display: flex;
  align-items: center;
}
.param-wrap {
  width: calc(50% - 14px);
  height: 150px;
  display: flex;
  flex-direction: column;
}
.pre-code {
  flex: 1;
  display: flex;
  position: relative;
}
.language-css {
  position: absolute;
  height: 100%;
  width: 100%;
  color: #9a6e3a;
  background: hsla(0, 0%, 100%, 0.5);
  outline: none;
  display: block;
  white-space: break-spaces;
  overflow: auto;
}
.button-control {
  background: #EBF7F2;
  border: none;
  line-height: 100%;
  padding: 3px 14px;
}
.button-control /deep/ .el-icon-circle-plus-outline {
  background: #28A670;
  color: white;
  border-radius: 2px;
}
.button-control /deep/ i {
  padding: 4px;
}
.input-item /deep/ input[type=text]{
  background: #F6F7F9;
}
/deep/ .input-item.el-date-editor.el-input,.input-item /deep/ input[type=text] {
  width: 165px;
}
/deep/ .el-tabs__item.is-active {
  color: white;
  background: #3cc088;
}
/deep/ .el-checkbox__label {
  font-size: 12px;
  color: #333!important;
}
</style>
