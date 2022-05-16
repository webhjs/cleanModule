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
      <el-tooltip placement="top" effect="light">
        <div slot="content"><div style="color: #E6A23C;width: 155px;margin-bottom: 5px;">友情提示:</div>值来源于固定值选项卡</div>
        <el-select v-model="formInline.value" class="input-item" placeholder="请选择默认值">
          <el-option
            v-for="item in formInline.bse_options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-tooltip>
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
    <el-form-item class="form-item_special" prop="bse_options">
      <el-tabs type="card" v-model="formInline.bse_card">
        <el-tab-pane label="固定值" name="fixed">
          <ul class="option-list">
            <li
              v-for="(opt, index) in formInline.bse_options"
              :key="opt.value"
              @click="acitveRowChange(opt, index)"
              :class="{ active: activeRow.value == opt.value }"
            >
              <tr style="display: flex;">
                <td style="width: 145px;margin-right: 20px;">{{ opt.value }}</td>
                <td style="flex: 1;">{{ opt.label }}</td>
              </tr>
            </li>
          </ul>
          <div class="control-wrap">
            <el-input
              placeholder="请输入内容"
              style="width: 150px; margin-right: 10px"
              v-model="formInline.bse_model.value"
            >
              <template slot="prepend">值</template>
            </el-input>
            <el-input placeholder="请输入内容" style="width: 150px" v-model="formInline.bse_model.label">
              <template slot="prepend">描述</template>
            </el-input>
            <el-button-group style="margin-left: 10px">
              <el-button class="button-control" icon="el-icon-circle-plus-outline" @click="addOption"></el-button>
              <el-button
                class="button-control"
                icon="el-icon-edit"
                :disabled="operDisabled"
                @click="editOption"
              ></el-button>
              <el-button
                class="button-control"
                icon="el-icon-top"
                :disabled="operDisabled"
                @click="operateOption('top')"
              ></el-button>
              <el-button
                class="button-control"
                icon="el-icon-bottom"
                :disabled="operDisabled"
                @click="operateOption('bottom')"
              ></el-button>
              <el-button
                class="button-control"
                icon="el-icon-delete"
                :disabled="operDisabled"
                @click="removeOption"
              ></el-button>
            </el-button-group>
          </div>
        </el-tab-pane>
        <el-tab-pane label="动态数据" name="axios" class="dynamic-wrap">
          <div class="param-wrap">
            <h5 class="language-title">
              请求参数
              <el-tooltip
                content='{"url":"https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg","method":"get","headers":{},"data":{}}'
                placement="top"
                effect="light"
              >
                <el-link class="float-right">提示</el-link>
              </el-tooltip>
            </h5>
            <pre class="pre-code">
                <code class="language-css" contenteditable="true" v-html="JSON.stringify(formInline.bse_json_request, null, 4)"  @blur="blurJsonRequest"></code>
              </pre>
          </div>
          <el-button size="mini" @click="sendAxios">发送</el-button>
          <div class="param-wrap">
            <h5 class="language-title">返回参数</h5>
            <pre class="pre-code">
                <code class="language-css">{{ JSON.stringify(formInline.bse_json_response, null, 4) }}</code>
              </pre>
          </div>
        </el-tab-pane>
      </el-tabs>
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
  computed: {
    operDisabled() {
      return !!!Object.keys(this.activeRow).length
    }
  },
  data() {
    var validateOptions = (rule, value, callback) => {
      if (value.length) {
        callback();
      } else {
        callback(new Error('选项不能为空'));
      }
    };
    return {
      formInline: {
        bse_card: 'fixed',
        bse_options: [], // 下拉选项
        bse_model: {}, // 选项模板
        bse_json_request: {}, // 请求参数
        bse_json_response: {} // 返回参数
      },
      activeRow: {}, // 当前活动行数据
      rules: {
        name: { required: true, message: '请输入名称', trigger: 'blur' },
        id: { required: true, message: '请输入编码', trigger: 'blur' },
        bse_options: { validator: validateOptions, message: '选项不能为空', trigger: 'blur' }
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
  },
  methods: {
     // 上下移动选项
    operateOption(active) {
      const arr = this.formInline.bse_options
      const index = this._index
      switch (active) {
        case 'top':
          if (index != 0) {
            arr[index] = arr.splice(index - 1, 1, arr[index])[0]
          }
          this._index--
          break
        case 'bottom':
          if (index != arr.length - 1) {
            arr[index] = arr.splice(index + 1, 1, arr[index])[0]
          }
          this._index++
          break
      }
    },
    // 数据验证
    isValidate(filterIndex) {
      const { label, value } = this.formInline.bse_model
      if (!label || !value) {
        this.$message.warning('选项值和描述不能为空')
        return false
      }
      !this.formInline.bse_options && (this.formInline.bse_options = [])
      const newOption = this.formInline.bse_options.filter((fit, inx) => inx !== filterIndex)
      for (const option of newOption) {
        if (option.value === value || option.label === label) {
          this.$message.warning('选项值或描述重复')
          return false
        }
      }
      return true
    },
    // 添加选项
    addOption() {
      if (!this.isValidate()) return
      this.$refs.attributeForm.clearValidate(['bse_options']);
      const { label, value } = this.formInline.bse_model
      this.formInline.bse_options.push({
        label,
        value
      })
      this.formInline.bse_model = {}
      this.activeRow = {}
      this.$forceUpdate()
    },
    // 删除选项
    removeOption() {
      this.formInline.bse_options = this.formInline.bse_options.filter(fit => fit.value !== this.activeRow.value)
      this.activeRow = {}
      this._index = -1
    },
    // 点击活动行
    acitveRowChange(row, index) {
      this.activeRow = row
      this._index = index
      this.formInline.bse_model = JSON.parse(JSON.stringify(this.activeRow))
    },
    // 编辑选项
    editOption() {
      if (!this.isValidate(this._index)) return
      const index = this.formInline.bse_options.indexOf(this.activeRow)
      const row = JSON.parse(JSON.stringify(this.formInline.bse_model))
      this.formInline.bse_options.splice(index, 1, row)
      this.activeRow = row
    },
    // 请求参数失焦格式化
    blurJsonRequest() {
      try {
        this.formInline.bse_json_request = JSON.parse(event.target.innerText)
      } catch {
        this.$message.warning('json格式错误')
      }
    },
    // 发送请求
    sendAxios() {
      // {"url":"https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg","method":"get","headers":{},"data":{}}
      axios(this.formInline.bse_json_request).then(response => {
        this.formInline.bse_json_response = response
      }).catch (err => this.$message.error(err))
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
/deep/ .el-button-group > .el-button.is-disabled {
  background: #f6f7f9;
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
