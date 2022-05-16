<template>
  <div class="text-left">
    <!-- <el-button type="primary" @click="isFocusInsideEle">isEleInside</el-button>
      <el-button type="primary" @click="getSelection">getSelection</el-button>-->
    <el-button type="primary" @click="isShowDialog('protoTypeDialog', { type: 'date' })">日期控件</el-button>
    <el-button type="primary" @click="isShowDialog('protoTypeDialog', { type: 'input' })">输入控件</el-button>
    <el-button type="primary" @click="isShowDialog('protoTypeDialog', { type: 'label' })">标签控件</el-button>
    <el-button type="primary" @click="isShowDialog('protoTypeDialog', { type: 'select' })">下拉控件</el-button>
    <el-button type="primary" @click="computedPageSize({ width: 210, height: 297 })">A4</el-button>
    <el-button type="primary" @click="computedPageSize({ width: 148, height: 210 })">A5</el-button>
    <el-button type="primary" @click="isShowDialog('protoTypeDialog', { type: 'radio' })">单选控件</el-button>
    <el-button type="primary" @click="isShowDialog('protoTypeDialog', { type: 'checkbox' })">复选控件</el-button>
    <el-button type="primary" @click="isShowDialog('protoTypeDialog', { type: 'number' })">数字</el-button>
    <el-button type="primary" @click="insert({ type: 'pagebreak' })">分页符号</el-button>
    <el-button type="primary" @click="insert({ type: 'splitline' })">分割线</el-button>
    <el-button type="primary" @click="getSelection">getSelection</el-button>
    <el-button type="primary" @click="createdBookMarkTest">创建书签</el-button>
    <el-button type="primary" @click="removeBookMarkTest">删除书签</el-button>
    <el-button type="primary" @click="setContentStr">重置</el-button>
    <el-button type="primary" @click="insertIntoDom">测试插入节点</el-button>
    <el-button type="primary" @click="print">打印</el-button>
    <el-button type="primary" @click="convertImgToBase64">64</el-button>
    <el-button type="primary" @click="applyInlineStyle('strong')">加粗</el-button>
    <el-radio-group v-model="model">
      <el-radio-button label="design">设计模式</el-radio-button>
      <el-radio-button label="editor">编辑模式</el-radio-button>
      <el-radio-button label="preview">预览模式</el-radio-button>
    </el-radio-group>
    <el-button @click="undo">撤销</el-button>
    <el-button @click="redo">重做</el-button>
    <el-button @click="isShowDialog('cavesDialog')">签名</el-button>
    <el-button @click="getBseJsonXml">下载xml</el-button>
    <div
      :style="{ height, width }"
      :contenteditable="modelMapping[model]"
      class="bg-white"
      :class="model != 'preview' ? 'bse_editwrap' : 'bse_preview'"
      id="bse_edit"
      @keydown="input($event)"
      @click="click($event)"
    ></div>
    <SignEcard ref="cavesDialog" @closed="createSignImg" />
    <AttributeDialog ref="protoTypeDialog" @closed="setBseProtoType" />
  </div>
</template>
<script>
import SignEcard from '@/views/simple-template/home/SignEcard'
// 判断是否是bse只读元素
// import timePicker from '@/views/simple-template/test/ui/basic/date-picker'
import History from './historyState.js'
import AttributeDialog from '@/views/simple-template/home/AttributeDialog'
// 当前节点是否是bse只读元素
function isBseNotAllowDeleteElement(node) {
  const str = node.outerHTML
  return /<[^<]*?bse\s*?=.*?{.*?notallowdelete.*?:\s*true.*?>.*?<\/.*?>/.test(str)
  //˙
}
// 当前节点是否是bse元素
function isBseElement(node) {
  const str = node.outerHTML
  return /<[^<]*?bse\s*?=.*?>.*?<\/.*?>/.test(str)
}
// 唯一id
function guid() {
  return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36)
}

import Print from './print'
// import select from '@/views/simple-template/test/ui/basic/select'
// import { GET } from '@bse/core/axiosHelper.js'
export default {
  components: { SignEcard, AttributeDialog },
  data() {
    return {
      height: '',
      width: '',
      _histroy: {},
      model: 'design',
      modelMapping: {
        design: 'true',
        editor: 'false',
        preview: 'false'
      }
    }
  },
  methods: {
    // #region
    // 重置测试
    setContentStr() {
      const str = `
        <p>
          1、呼吸系统：发热、
          <span>123</span>
          464545646464564
          <span><span>一个</span><span>控件</span></span>
          <span class="bse-element" contenteditable="false" bse-left="[" bse-right="]" bse='{"type":"label"}' style="font-weight: bold">
            <label contenteditable="true" class="placehold-class" placeholder="请输入">提示框</label>
          </span>
          <span style="color: red;">一个控件</span>咳嗽\u200B咯血\u200C潮热\u200D盗汗
          <span style="color: red">、呼吸困难、</span>
          有无浓臭痰（色、量）等
        </p>
        <p>2、消化系统:反酸、烧心、嗳气、恶心、呕吐（性质、色、量）、腹痛、腹泻、里急后重等;</p>
        <p>
          <span class="bse-element" contenteditable="false" bse-left="[" bse-right="]" bse='{"contenteditable":false, "type":"label"}' style="font-weight: bold">
            <text contenteditable="true" class="placehold-class" placeholder="请输入">1.体格检查:</label>
          </span>
          1231311111
          <span class="bse-element" bse-left="["bse-right="]" bse='{"type":"checkbox","notallowdelete":true,"contenteditable":false}'>
            <input type="checkbox" id="选项A" contenteditable="false"></input></label><label contenteditable="false" for="选项A">选项A</label>
            <input type="checkbox" id="选项B" contenteditable="false"></input><label for="选项B" contenteditable="false">选项B</label>
          </span>
          发育正常，营养中等，（自动、端坐、强迫、平卧）体位，神志（清楚、不清），查体合作。全身皮肤黏膜无黄染、出血点、瘀斑、蜘蛛痣、皮下结节，周身浅表淋巴结未触及肿大，头­五官无畸形，眼睑无水肿，巩膜无黄染，结膜无（充血、苍白），两侧瞳孔等大正圆，对光反射（灵敏、迟钝、消失），耳鼻未见异常，口唇无发绀，咽无充血，两侧扁桃体
        </p>
        <p id="testInserInto">
          发育正常，营养中等，（自动、端坐、强迫、平卧）体位，神志（清楚、不清），查体合作。全身皮肤黏膜无黄染、出血点、瘀斑、蜘蛛痣、皮下结节，周身浅表淋巴结未触及肿大，头­五官无畸形，眼睑无水肿，巩膜无黄染，结膜无（充血、苍白），两侧瞳孔等大正圆，对光反射（灵敏、迟钝、消失），耳鼻未见异常，口唇无发绀，咽无充血，两侧扁桃体
        </p>
        <p>
          发育正常，营养中
          <span class="bse-element" bse-left="[" bse-right="]" bse='{"bse_card":"fixed","bse_options":[{"label":"1","value":"1"},{"label":"2","value":"2"},{"label":"3","value":"3"}],"bse_model":{},"bse_json_request":{},"bse_json_response":{},"value":["2"],"type":"checkbox","name":"1","id":"1"}'>
            <input type="checkbox" id="1" value="1" name="1" contenteditable="false"></input>
            <label for="1" contenteditable="false">1</label>
            <input type="checkbox" id="2" value="2" name="1" contenteditable="false" checked=""></input>
            <label for="2" contenteditable="false">2</label>
            <input type="checkbox" id="3" value="3" name="1" contenteditable="false"></input>
            <label for="3" contenteditable="false">3</label>
          </span>
          <span class="bse-element" contenteditable="false" bse-left="[" bse-right="]" bse='{"contenteditable":false, "type":"label"}' style="font-weight: bold">
            <text contenteditable="true" class="placehold-class" placeholder="请输入">1.体格检查:</label>
          </span>等，（自动、端坐、强迫、平卧）体位，神志（清楚、不清），查体合作。全身皮肤黏膜无黄染、出血点、瘀斑、蜘蛛痣、皮下结节，周身浅表淋巴结未触及肿大，头­五官无畸形，眼睑无水肿，巩膜无黄染，结膜无（充血、苍白），两侧瞳孔等大正圆，对光反射（灵敏、迟钝、消失），耳鼻未见异常，口唇无发绀，咽无充血，体不大，颈两侧两侧扁桃
          <span class="bse-element" contenteditable="false" bse-left="[" bse-right="]" bse='{"type":"label"}' style="font-weight: bold">
            <label contenteditable="true" class="placehold-class" placeholder="请输入">提示框</label>
          </span>
          对称,无颈静脉怒张及颈动脉异常搏动,颈无抵抗,气管居中,甲状腺不大。胸廓无畸形,两侧呼吸动度一致,语颤无增强及减弱,双肺叩清音,肺肝浊音界位于右锁骨中线第5肋间,双肺呼吸音（清或粗）,（可或未）闻及干湿性罗音。心前区无隆起,心尖搏动不明显,未触及震颤,心界不大,心率80次/分，律整，各瓣膜听诊区未闻及杂音，腹平坦，未见肠型及蠕动波，腹软，无压痛及反跳痛，肝脾未触及，叩鼓音，肝区无扣击痛，移动性浊音阴性，肠鸣音正常存在，肛门、外生殖器未见异常，脊柱、四肢无畸形，双肾无扣击痛，关节无红肿，肌张力正常，活动自如，双侧肱二、三头肌、膝腱反射存在，双侧巴氏征、克氏征、布氏征均阴性。
          <img style="width: 100px; height: 100px" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"/>
        </p>
        <p contenteditable="false">
          <span id="signCard" style="display: inline-block; height: 60px; width: 150px; float: right; transform: translateY(-100%)"></span>
        </p>
      `
      this.setContent(str)
    },
    // 获取文本内容
    getContent() {
      return this._editDom.innerHTML
    },
    // 设置文本内容
    setContent(html) {
      const content = this.trimSpace(html)
      const result = content.replace(
        /(<\/\S+>)?(<(\S+)[^<]*?bse=[^>]*?>)(?:(?:\b&#8205;\b)*)(.*?<\/\3>)(<\S+[^>]*?>)/g,
        (_, capture1, capture2, capture3, capture4, capture5) => {
          console.log(capture1, capture2)
          const zero = '&#8205;'
          return capture1 ? capture1 + zero + capture2 + capture4 + zero + capture5 : capture2 + capture4 + zero + capture5
        }
      )
      const edit = this._editDom
      edit.innerHTML = result
    },
    // 获取select属性
    getSelection() {
      // ie: const selection = document.selection.createRange();
      const selection = window.getSelection()
      console.log(selection)
      return selection
    },
    // 当前selection是否存在不可删除节点
    isHasNotAllowDeleteEle() {
      const selection = this.getSelection()
      const Range = selection.getRangeAt(0)
      const rangeContent = Range.cloneContents()
      for (let node of rangeContent.childNodes) {
        if (node.outerHTML && /bse\s*=.*?notallowdelete\s*&quot;\s*:\s*true/.test(node.outerHTML)) return true
      }
      return false
    },
    // 创建range对象
    creatRange() {
      // range = document.createRange();
      const range = new Range()
      console.log(range)
      return range
    },
    // 追加隐藏式占位符
    addhiddenPlaceholder() {
      const content = this.getContent()
      const result = content.replace(
        /(<(\S*)\s.*?bse\s*?=[^>]*>)(?:(?:\b&#8205;\b)*)(.*?<\/(?:\2)>)(?:(?:\b&#8205;\b)*\s*)/g,
        (matched, capture1, capture2, capture3) => {
          const zero = '&#8205;'
          return capture1 + capture3 + zero
        }
      )
      const edit = this._editDom
      edit.innerHTML = result
    },
    // 获取标签位置
    getNodeIndex(node, ignoreTextNode) {
      let preNode = node,
        i = 0
      while ((preNode = preNode.previousSibling)) {
        if (ignoreTextNode && preNode.nodeType == 3) {
          if (preNode.nodeType != preNode.nextSibling.nodeType) {
            i++
          }
          continue
        }
        i++
      }
      return i
    },
    // 键入事件
    input(e) {
      ;[46].includes(e.keyCode) && this.deleteKeyDow(e)
      ![37, 38, 39, 40, 46].includes(e.keyCode) && this.backspace(e) // 排除上下左右键
    },
    // 递归判断当前节点是否处于最后一个节点
    isItorPrevChildNode(focus) {
      let isPrevChildFlag = false, prevChildNode = null, currentFocus = focus;
      while (currentFocus && currentFocus.parentNode && currentFocus.parentNode.nodeName !== 'P') {
        prevChildNode = currentFocus
        isPrevChildFlag = !currentFocus.previousSibling
        currentFocus = currentFocus.parentNode
      }
      return { isPrevChildFlag, prevChildNode } // { 是否是最后一个节点, 最后一个节点 }
    },
    // 前删
    backspace(e) {
      if (this.isHasNotAllowDeleteEle()) {
        e.preventDefault()
        this.$message.warning('选中区域存在禁止删除元素')
        return
      }
      const selection = this.getSelection()
      const focus = selection.focusNode

      /* 焦点在内部操作 */
      const bseProps = this.getItorElementBseAttr(focus)
      const { contenteditable } = bseProps || {}
      if (contenteditable === false) {
        e.preventDefault()
        return
      }
      /* 焦点在内部操作 */

      /* 开头是元素标签 */
      if (focus.nodeName === 'P' && [0].includes(selection.focusOffset) && [8].includes(e.keyCode)) {
        e.preventDefault()
        const index = this.getNodeIndex(focus)
        const prevNode = focus.parentNode.childNodes[index - 1]
        const Range = selection.getRangeAt(0)
        Range.selectNodeContents(prevNode)
        Range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(Range)

        prevNode.insertAdjacentHTML('beforeend', focus.innerHTML)
        focus.remove()
        return
      }
      /* 开头是元素标签 */

      /* 焦点在外部部操作 */
      let index = this.getNodeIndex(focus)
      let prevNode = focus.parentNode.childNodes[index - 1]

      /* 递归删除空节点 */
      const { isPrevChildFlag, prevChildNode } = this.isItorPrevChildNode(focus)
      if (isPrevChildFlag) {
        const prevParent = prevChildNode.parentNode
        index = this.getNodeIndex(prevParent)
        let prevNextNode = prevParent.parentNode?.childNodes[index - 1]
        if (prevNextNode) {
          while(/^(\u200B|\u200C|\u200D)+$/g.test(prevNextNode.textContent) || prevNextNode.textContent == '' && !isBseNotAllowDeleteElement(prevNextNode)) { // 如何后一个节点是零宽字符就删除 在前移一位
            prevNextNode.remove()
            index--
            prevNextNode = prevParent.parentNode?.childNodes[index]
          }
        }
        prevNode = prevNextNode
      }
      /* 递归删除空节点 */
      
      if (prevNode) {
        if (isBseNotAllowDeleteElement(prevNode)) {
          ;[0].includes(selection.focusOffset) && e.preventDefault()
          ;[1].includes(selection.focusOffset) && /^(\u200B|\u200C|\u200D)+$/g.test(focus.textContent) && e.preventDefault()
        } else {
          if([8].includes(e.keyCode) && isBseElement(prevNode)) {
            if ([0].includes(selection.focusOffset)) {
              e.preventDefault();
              prevNode.remove()
              if (/^(\u200B|\u200C|\u200D)+$/g.test(focus.textContent)) {
                focus.remove()
              }
            } else if ([1].includes(selection.focusOffset) && /^(\u200B|\u200C|\u200D)+$/g.test(focus.textContent)) {
              prevNode.remove()
            }
          }
        }
      }
      /* 焦点在外部部操作 */
    },
    // 递归判断当前节点是否处于最后一个节点
    isItorLastChildNode(focus) {
      let isLastChildFlag = false, lastChildNode = null, currentFocus = focus;
      while (currentFocus && currentFocus.parentNode && currentFocus.parentNode.nodeName !== 'P') {
        lastChildNode = currentFocus
        isLastChildFlag = !currentFocus.nextSibling
        currentFocus = currentFocus.parentNode
      }
      return { isLastChildFlag, lastChildNode } // { 是否是最后一个节点, 最后一个节点 }
    },
    // 后删
    deleteKeyDow(e) {
      if (this.isHasNotAllowDeleteEle()) {
        e.preventDefault()
        this.$message.warning('选中区域存在禁止删除元素')
        return
      }
      const selection = this.getSelection()
      const length = selection.focusNode.length
      const focus = selection.focusNode

      /* 焦点在内部操作 */
      const bseProps = this.getItorElementBseAttr(focus)
      const { contenteditable } = bseProps || {}
      if (contenteditable === false) {
        e.preventDefault()
        return
      }
      /* 焦点在内部操作 */
      
      /* 焦点在行首操作 */
      if ([0].includes(selection.focusOffset) && focus.nodeName === 'P') {
        const nextNode = focus.childNodes[0]
        if (nextNode) {
          if (isBseNotAllowDeleteElement(nextNode)) {
            e.preventDefault()
            return
          } else if (isBseElement(nextNode)) {
            nextNode.remove() // 移除整个节点
            return
          }
        }
      }
      /* 焦点在行首操作 */

      /* 焦点在行尾操作 */
      let focusParentIsP = focus
      while (focusParentIsP && focusParentIsP.parentNode && focusParentIsP.parentNode.nodeName !== 'P') {
        focusParentIsP = focusParentIsP.parentNode
      }
      const focusIsParentIsIndex = this.getNodeIndex(focusParentIsP)
      
      if (
        [length].includes(selection.focusOffset) &&
        focusParentIsP.parentNode.childNodes.length === focusIsParentIsIndex + 1
      ) {
        e.preventDefault()
        const focusIsp = focusParentIsP.parentNode
        const isPindex = this.getNodeIndex(focusIsp)
        const nextNode = focusIsp.parentNode.childNodes[isPindex + 1]
        if (nextNode) {
          focusIsp.insertAdjacentHTML('beforeend', nextNode.innerHTML)
          nextNode.remove()
        }
        return
      }
      /* 焦点在行尾操作 */
      
      /* 焦点在外部操作 */
      let index = this.getNodeIndex(focus)
      let nextNode = focus.parentNode.childNodes[index + 1]

      /* 递归删除空节点 */
      const { isLastChildFlag, lastChildNode } = this.isItorLastChildNode(focus)
      if (isLastChildFlag) {
        const lastParent = lastChildNode.parentNode
        index = this.getNodeIndex(lastParent)
        let lastNextNode = lastParent.parentNode?.childNodes[index + 1]
        if (lastNextNode) {
          while(/^(\u200B|\u200C|\u200D)+$/g.test(lastNextNode.textContent) || lastNextNode.textContent == '' && !isBseNotAllowDeleteElement(lastNextNode)) { // 如何后一个节点是零宽字符就删除 在前移一位
            lastNextNode.remove()
            index++
            lastNextNode = lastParent.parentNode?.childNodes[index]
          }
        }
        nextNode = lastNextNode
      }
      /* 递归删除空节点 */

      console.log('cur', focus)
      if (nextNode) {
        if (isBseNotAllowDeleteElement(nextNode)) {
          ;[length].includes(selection.focusOffset) && e.preventDefault()
        } else if ([length, 0].includes(selection.focusOffset) && isBseElement(nextNode)) {
          e.preventDefault()
          nextNode.remove() // 移除整个节点
        }
      }
      /* 焦点在外部操作 */
    },
    // 解析json字符串
    jsonparse(jsonify) {
      try {
        return JSON.parse(jsonify)
      } catch {
        const str = jsonify.substring(1, jsonify.length - 1)
        const obj = {}
        const trim = str => str.replace(/(^\s*)|(\s*$)/g, '')
        str
          .split(',')
          .filter(m => m)
          .forEach(f => {
            const map = f.split(':')
            obj[trim(map[0])] = trim(map[1])
          })
        return obj
      }
    },
    // 当时聚焦元素时候在标签内
    isFocusInsideEle() {
      const select = this.getSelection()
      let current = select.focusNode,
        Flag = false
      while (current !== null && !Flag && current.nodeName !== 'BODY') {
        current = current.parentNode
        const hasAttr = /^<\w+[^<]*\s*bse=.*?>/.test(current.outerHTML)
        hasAttr && (Flag = true)
      }
      return Flag
    },
    // 清除换行空格
    trimSpace(str) {
      return str.replace(/\n+\s*/g, () => {
        return ''
      })
    },
    // 设置元素属性
    setBseProtoType(proto) {
      this.insert(proto)
    },
    // 插入标签
    insert(proto) {
      const { type } = proto
      const rest = JSON.stringify(proto)
      const htmlStr = {
        radio: () => `<span class="bse-element" bse-left="[" bse-right="]" bse='${rest}'>
          ${
            proto.bse_options &&
            proto.bse_options
              .map(opt => {
                return `<input type="radio" id="${opt.value}" value="${opt.value}" name="${
                  proto.name
                }" contenteditable="false" ${proto.value == opt.value ? 'checked' : ''}></input><label for="${
                  opt.value
                }" contenteditable="false">${opt.label}</label>`
              })
              .join('')
          }
        </span>`,
        checkbox: () => `<span class="bse-element" bse-left="[" bse-right="]" bse='${rest}'>
          ${
            proto.bse_options &&
            proto.bse_options
              .map(opt => {
                return `<input type="checkbox" id="${opt.value}" value="${opt.value}" name="${
                  proto.name
                }" ${proto.value.includes(opt.value) ? 'checked' : ''}></input><label for="${
                  opt.value
                }">${opt.label}</label>`
              })
              .join('')
          }
        </span>`,
        date: () => `<span class="bse-element" bse-left="[" bse-right="]" bse='${rest}' contenteditable="false">
          <label contenteditable="true" class="placehold-class" placeholder="${proto.placeholder || ''}">${
            proto.value || ''
          }</label>
        </span>`,
        input: () => `<span class="bse-element" bse-left="[" bse-right="]" bse='${rest}' contenteditable="false">
            <label contenteditable="true" class="placehold-class" placeholder="${proto.placeholder || ''}">${
              proto.value || ''
            }</label>
           </span>`,
        select: () => `<span class="bse-element" bse-left="[" bse-right="]" bse='${rest}' contenteditable="false">
          <label contenteditable="true" class="placehold-class" placeholder="${proto.placeholder || ''}">${
            (proto.value && proto.bse_options && proto.bse_options.filter(fit => fit.value == proto.value)[0].label) || ''
          }</label>
        </span>`,
        label: () => `<span style="font-weight: bold" bse='${rest}' contenteditable="false">
          <label contenteditable="true" class="placehold-class" placeholder="${proto.placeholder || ''}">${
            proto.value || ''
          }</label>
        </span>`,
        number: () => `<span class="bse-element" bse-left="[" bse-right="]" bse='${rest}' contenteditable="false">
          <label contenteditable="true" class="placehold-class" placeholder="${proto.placeholder || ''}">${
            proto.value || ''
          }</label>
        </span>`,
        splitline: () => `<hr class="splitline"></hr>`,
        pagebreak: () => `<div class="no-print pageline"></div><div class="page-next"></div>`
      }
      this.insertHtml(this.trimSpace(htmlStr[type]()))
    },
    // 插入html元素
    async insertHtml(html) {
      this._bookmark && (await this.moveToBookMark(this._bookmark))
      const selection = this.getSelection()
      if (!selection.focusNode) return
      const Range = selection.getRangeAt(0)
      console.log('cur', Range)
      !Range.collapsed && Range.deleteContents()
      const edit = this._editDom
      edit.focus()
      const div = document.createElement('div')
      div.style.display = 'inline'
      div.innerHTML = html
      Range.insertNode(div)
      const index = this.getNodeIndex(div)
      const divParent = div.parentNode
      this.removePrentNode(div)
      let dom = divParent.childNodes[index + 1]
      if (dom) {
        !dom.data && (dom.data = '\u200D')
      } else {
        dom = document.createTextNode('\u200D'); // 当前处于最后一个节点就新建一个隐藏字符
        divParent.appendChild(dom)
      }
      Range.selectNodeContents(dom)
      selection.removeAllRanges()
      selection.addRange(Range)
      ;/^(\u200B|\u200C|\u200D)+$/g.test(dom.textContent) ? Range.collapse(false) : Range.collapse(true)
      // Range.setEnd(div, 2); Range.setStart(div, 2); Range.setEndAfter(oLastNode)
    },
    // 删除父节点
    removePrentNode(node) {
      var parent = node.parentNode,
        child
      if (parent) {
        if (node.hasChildNodes()) {
          while ((child = node.firstChild)) {
            parent.insertBefore(child, node)
          }
        }
        parent.removeChild(node)
      }
      return node
    },
    // 获取当前元素位置
    getElementPosition(ele) {
      let top = ele.offsetTop
      let left = ele.offsetLeft
      var current = ele.offsetParent
      while (current !== null && current.nodeName !== 'BODY') {
        console.dir(current)
        top += current.offsetTop - current.scrollTop
        left += current.offsetLeft - current.scrollLeft
        current = current.offsetParent
      }
      return {
        top,
        left
      }
    },
    // 当前元素时候在标签内
    isEvTarInsideEle(ele) {
      return /^<\w+[^<]*\s*bse=.*?>/.test(ele.outerHTML)
    },
    // 获取当前元素属性
    getElementAttribute(ele) {
      return this.isEvTarInsideEle(ele)
        ? ele && this.jsonparse(ele.getAttribute && ele.getAttribute('bse'))
        : { descr: '不是 bse 标签元素' }
    },
    // 递归获取bse标签属性
    getItorElementBseAttr(target) {
      let result = { descr: '不是 bse 标签元素' }
      while (target && target.nodeName !== 'BODY') {
        const attr = this.getElementAttribute(target)
        if (attr.descr !== '不是 bse 标签元素') {
          result = { ...attr, elSrc: target }
          break
        }
        target = target.parentNode
      }
      return result
    },
    // 点击标签
    click(e) {
      const attr = this.getItorElementBseAttr(e.target)
      if (attr.descr !== '不是 bse 标签元素') {
        const { type } = attr
        const { top, left } = this.getElementPosition(e.target) || {}

        // console.log('打印', type, type.length);

        if (type == 'date') {
          e.target.click = () => {
            const el = event.target
            timePicker.hideAll()
            const instance = timePicker.getInstance({ el: el, x: left, y: top })
            instance.value = el.dataset.date
            instance.attrs['value-format'] = 'yyyy:MM:dd'
            instance.attrs.format = 'yyyy-MM-dd'
            instance.show()
            console.log(instance)
            instance.listeners = {
              // 监听 datePicker组件变化
              change: val => {
                el.dataset.date = val
                el.innerText = '\u200B' + el.dataset.date
              }
            }
          }
          e.target.click()
        } else if (type == 'select') {
          if (e.target.click) {
            e.target.click = () => {
              const el = e.target
              select.hideAll()
              const instance = select.getInstance({ el: el, x: left, y: top - 10 })
              instance.value = el.dataset.selectValue || ''
              instance.attrs.options = attr.bse_options || [] // 选择框内容
              instance.listeners = {
                change(val) {
                  // 监听 select组件变化
                  console.log(...arguments)
                  el.dataset.selectValue = val
                  el.innerText = instance.attrs.options.find(v => v.value == val)?.label || el.innerText
                }
              }
              instance.show()
              console.log(instance)
            }
          }
          e.target.click()
        }
      }
    },
    print() {
      new Print(this._editDom)
    },
    // a4 a5尺寸
    computedPageSize(size) {
      function get_dpi() {
        const result = []
        if (window.screen.deviceXDPI != undefined) {
          result[0] = window.screen.deviceXDPI
          result[1] = window.screen.deviceYDPI
        } else {
          const tmpNode = document.createElement('DIV')
          tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden'
          document.body.appendChild(tmpNode)
          result[0] = parseInt(tmpNode.offsetWidth)
          result[1] = parseInt(tmpNode.offsetHeight)
          tmpNode.parentNode.removeChild(tmpNode)
        }
        return result
      }
      const DPI = get_dpi()
      this.height = size.height * (DPI[0] / 25.4) + 'px'
      this.width = size.width * (DPI[1] / 25.4) + 'px'
    },
    // 加粗
    async applyInlineStyle(tagName) {
      const remake = await this.createdBookMark()
      const selection = this.getSelection(),
        Range = selection.getRangeAt(0)
      const frag = Range.extractContents()
      const elm = document.createElement(tagName)
      elm.appendChild(frag)
      Range.insertNode(elm)
      // const newEle = Range.createContextualFragment('<span>123</span>')
      // Range.surroundContents(newEle)
      this.removeBookMark(remake)
    },
    // 撤销
    undo() {
      this._histroy.undo()
    },
    // 重做
    redo() {
      this._histroy.redo()
    },
    // 创建书签
    createdBookMark() {
      return new Promise(reslove => {
        const result = { startMark: '', endMark: '' }
        const selection = this.getSelection(),
          edit = this._editDom,
          { isCollapsed } = selection,
          Range = selection.getRangeAt(0)
        edit.focus()
        const span = document.createElement('span')
        span.style.display = 'inline'
        const uniq = guid()
        const uniqStar = `_bseEdit_star${uniq}`
        span.setAttribute('id', uniqStar)
        Range.insertNode(span)
        result.startMark = span
        if (!isCollapsed) {
          const endspan = document.createElement('span')
          endspan.style.display = 'inline'
          const uniqend = `_bseEdit_end${uniq}`
          endspan.setAttribute('id', uniqend)
          Range.collapse(false)
          Range.insertNode(endspan)
          Range.setStartAfter(span)
          Range.setEndBefore(endspan)
          selection.removeAllRanges()
          selection.addRange(Range)
          result.endMark = endspan
        }
        reslove(result)
      })
    },
    // 移除书签
    removeBookMark(bookObj) {
      return new Promise(reslove => {
        this._histroy.without(() => {
          for (let [_, value] of Object.entries(bookObj)) {
            value && value.remove()
          }
        })
        reslove(true)
      })
    },
    // 移动到书签位置
    moveToBookMark(bookObj) {
      return new Promise(reslove => {
        const edit = this._editDom
        edit.focus()
        const Range = this.creatRange()
        bookObj.startMark && Range.setStartAfter(bookObj.startMark)
        bookObj.endMark && Range.setEndBefore(bookObj.endMark)
        Range.collapse(false)
        const selection = this.getSelection()
        selection.removeAllRanges()
        selection.addRange(Range)
        this._histroy.without(() => {
          for (let [_, value] of Object.entries(bookObj)) {
            value && value.remove()
          }
        })
        reslove(true)
      })
    },
    // 展示dialog层
    async isShowDialog(ref, row) {
      this._bookmark = await this.createdBookMark()
      this.$refs[ref].isShow(row)
    },
    // 创建签名图片
    createSignImg(img) {
      document.getElementById('signCard').appendChild(img)
    },
    // 下载xm文件
    download_xml(filename, text) {
      const pom = document.createElement('a')
      pom.setAttribute('href', 'data:xml/plain;charset=utf-8,' + encodeURIComponent(text))
      pom.setAttribute('download', filename)
      if (document.createEvent) {
        const event = document.createEvent('MouseEvents')
        event.initEvent('click', true, true)
        pom.dispatchEvent(event)
      } else {
        pom.click()
      }
    },
    // 获取json结构
    getBseJsonXml() {
      const content = this.getContent()
      let xml = ''
      // console.log('content', content)
      content.match(/<(\S*)[^>]*bse\s*?=.*?[^>]*>[^<]*<\/(\1)>/g).forEach(text => {
        console.log(text)
        const bsePrototype = JSON.parse(text.match(/{.*}/)[0].replace(/&quot;/g, '"'))
        console.log(bsePrototype)
        const { type, ...rest } = bsePrototype
        const regStr = text.match(/[^>]?>.*</)[0]
        // console.log(regStr)
        const insertHtml = regStr.slice(2, regStr.length - 1)
        let protoStr = ''
        for (let [key, value] of Object.entries(rest)) {
          protoStr += `${key}="${
            ['[object Array]', '[object Object]'].includes(Object.prototype.toString.call(value))
              ? JSON.stringify(value)
              : value
          }" `
        }
        xml += `<${type || 'default'} ${protoStr}>${insertHtml}</${type || 'default'}>`
      })
      const schemeStart = `<?xml version="1.0" encoding="UTF-8"?>`
      const schemeEnd = `</xml>`
      const html = `<html>${encodeURIComponent(content)}</html>`
      xml = `${schemeStart}${xml}${html}${schemeEnd}`
      this.download_xml('测试.xml', xml)
    },
    // #endregion
    blobToBase64Sync(blob) {
      return new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = function (event) {
          resolve(event.target.result)
        }
        reader.readAsDataURL(blob)
      })
    },
    async convertImgToBase64() {
      const html = this.getContent()
      let imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
      let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src
      const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/
      let matchList = html.match(imgReg) || [] //筛选出所有的img
      // src list
      let srcList = matchList
        .reduce((pre, cur) => {
          const imgList = cur.match(srcReg)
          if (imgList?.length) pre.push(imgList[1])
          return pre
        }, [])
        .filter(v => urlRegex.test(v))
      if (!srcList.length) return
      const blobRes = await Promise.all(
        // srcList.map(v =>
        //   GET({
        //     url: v,
        //     responseType: 'blob'
        //   })
        // )
      )
      const blobList = await Promise.all(blobRes.map(blob => this.blobToBase64Sync(blob)))
      const blobListObj = blobList.reduce((pre, cur, idx) => {
        if (cur && srcList[idx]) pre[srcList[idx]] = cur
        return pre
      }, {})
      let tmpHtml = html.replace(imgReg, val => {
        if (typeof val === 'string') {
          val = val.replace(srcReg, (match, $1) => {
            if (blobListObj[$1]) {
              match = match.replace($1, blobListObj[$1])
            }
            return match
          })
        }
        return val
      })
      this.setContent(tmpHtml)
    },
    createdBookMarkTest() {
      this._bookmark = this.createdBookMark()
    },
    removeBookMarkTest() {
      this._bookmark && this.moveToBookMark(this._bookmark)
    },
    insertIntoDom() {
      const selection = this.getSelection()
      if (!selection.focusNode) return
      const Range = selection.getRangeAt(0)
      console.log('cur', Range)
      !Range.collapsed && Range.deleteContents()
      const edit = this._editDom
      edit.focus()
      const divObj = document.createElement('span');
      divObj.innerHTML = `<span bse="" class="bse-element" bse-left="[" bse-right="]" contenteditable="false"><label contenteditable="true" class="placehold-class" placeholder="12321">12321</label></span>`
      Range.insertNode(divObj)
    }
  },
  mounted() {
    this._editDom = document.getElementById('bse_edit')
    this.addhiddenPlaceholder()
    this._histroy = new History(this._editDom)
  }
}
</script>

<style lang="stylus">
#bse_edit,
input,
.bse-element * {
  outline: 0 !important;
  border: 0;
}
input {
  background: #f0f8ff;
}
.bse_editwrap .bse-element::before {
  color: #0000ff;
  padding-right: 3px;
  content: attr(bse-left);
}
.bse_editwrap .bse-element::after {
  color: #0000ff;
  padding-left: 3px;
  content: attr(bse-right);
}
p * {
  outline: 0;
}
.bse-element ::after,
.bse-element ::before {
  vertical-align: text-bottom;
  font-size: 12px;
}
.bse_preview {
  pointer-events: none;
}
.bse_editwrap .bse-element {
  background: linear-gradient(to right, #f0f8ff, #f0f8ff) 7px no-repeat;
  background-size: calc(100% - 15px) 100%;
  cursor: pointer;
}
.bse-element label {
  margin: 0 5px;
}
.bse_editwrap .bse-element[bse*='"notallowdelete":true']::before {
  color: #f66262;
  content: attr(bse-left);
}
.bse_editwrap .bse-element[bse*='"contenteditable":false'] {
  color: #f66262;
}
.bse_editwrap .bse-element[bse*='"notallowdelete":true']::after {
  color: #f66262;
  content: attr(bse-right) '.';
}
.pageline {
  page-break-after: always;
  height: 3px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.splitline {
  margin: 5px 0;
  border: 1px solid #999;
}
.bse_preview .bse-element {
  padding: 0 5px;
}
.placehold-class {
  display: inline-block;
  min-width: 5px;
}
.placehold-class:empty:before {
  content: attr(placeholder);
  color: #ccc;
}
</style>
