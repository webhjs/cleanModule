/**
 * @desc 金苏
 * */
 class History {
  constructor(dom) {
    var MutationObserver = (this.MutationObserver =
      window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver)

    this.mutationObserverSupport = !!MutationObserver
    if (!this.mutationObserverSupport) return alert('浏览器不支持mutationObserver')

    //默认监听子元素， 子元素的属性， 属性值的改变;
    this.options = {
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true,
      // attributes: true,
      // attributeOldValue: true,
      // attributeFilter: []
    }

    //这个保存了History实例;
    this._mutation = {}

    // 记录Mutation的操作;
    this.historylist = []

    //当前回退的索引
    this.index = -1

    // 监听dom对象
    this.dom = dom || document.documentElement.body || document.getElementsByTagName('body')[0]

    //关闭监听;输出得到含有一个MutationRecord对象的数组
    this.observe()
  }

  // 记录Mutation操作
  observe() {
    if (this.dom.nodeType !== 1) return alert('参数不对，第一个参数应该为一个dom节点')
    this._mutation = new this.MutationObserver(this.callback.bind(this))
    this._mutation.observe(this.dom, this.options)
  }

  // 关闭监听;
  disconnect() {
    return this._mutation.disconnect()
  }

  // 从MutationObserver的通知队列中删除所有待处理的通知，并将它们返回到MutationRecord对象的新Array中
  takeRecords() { return this._mutation.takeRecords() }

  // 不记录Mutation操作
  without(fn) {
    this.disconnect()
    fn & fn()
    return Promise.resolve().then(() => { this.reObserve() })
  }

  // 节点发生改变的回调, 记录redo和undo到list中
  callback(records, instance) {
    console.log(records)
    console.log(instance)
    console.log(this.takeRecords())
    //要把索引后面的给清空;
    this.historylist.splice(this.index + 1)
    const recordhistroylist = {
      undo: [],
      redo: []
    }
    records.map((record) => {
      const target = record.target
      // 删除或添加节点;
      if (record.type === 'childList') {
        if (record.removedNodes.length !== 0) {
          const index = this.getNodeIndexs(target, record.previousSibling)
          console.log(this.getNodeIndexs(target, record.previousSibling)) // 删除之前节点索引
          recordhistroylist.undo.push(['childList', this.addChildren,  target, record.removedNodes, index])
          recordhistroylist.redo.push(['childList', this.removeChildren,  target, record.removedNodes])
          // this.addChildren(target, record.removedNodes, indexs)
          // this.removeChildren(target, record.addedNodes)
        }
        if (record.addedNodes.length !== 0) {
          const index = this.getNodeIndexs(target, record.previousSibling)
          recordhistroylist.undo.push(['childList', this.removeChildren,  target, record.addedNodes])
          recordhistroylist.redo.push(['childList', this.addChildren,  target, record.addedNodes, index])
        }
        //注释和字符改变监听
      } else if (record.type === 'characterData') {
        const oldValue = record.oldValue
        const newValue = record.target.textContent //|| record.target.innerText, 不准备处理IE789的兼容，所以不用innerText了;
        recordhistroylist.undo.push(['characterData', target, oldValue])
        recordhistroylist.redo.push(['characterData', target, newValue])
        // target.textContent = newValue
        //如果是属性变化的话style, dataset, attribute都是属于attributes发生改变, 可以统一处理;
      }
      // else if (record.type === 'attributes') {
      //   var oldValue = record.oldValue
      //   var newValue = record.target.getAttribute(record.attributeName)
      //   var attributeName = record.attributeName
      //   recordhistroylist.undo.push(['attributes', target, attributeName, oldValue])
      //   recordhistroylist.redo.push(['attributes', target, attributeName, newValue])
      //   // target.setAttribute(attributeName, newValue)
      // }
    })
    this.historylist.push({
      undo: () => {
        this.disconnect()
        recordhistroylist.undo.map((item, inx) => {
          // const inx 假装删除的上一个节点索引  加 inx数组索引 为删除节点点的位置 
          if (item[0] === 'childList') {
            item[1].call(null, item[2], item[3], item[4], inx)
          } else if (item[0] === 'characterData') {
            item[1].textContent = item[2]
          }
          // else if (item[0] === 'attributes') {
          //   item[1].setAttribute(item[2], item[3])
          // }
        })
        this.reObserve()
      },
      redo: () => {
        this.disconnect()
        recordhistroylist.redo.map((item, inx) => {
          // const inx 假装删除的上一个节点索引  加 inx数组索引 为删除节点点的位置 
          if (item[0] === 'childList') {
            item[1].call(null, item[2], item[3], item[4], inx)

          } else if (item[0] === 'characterData') {
            item[1].textContent = item[2]
          } 
          // else if (item[0] === 'attributes') {
          //   item[1].setAttribute(item[2], item[3])
          // }
        })
        this.reObserve()
      }
    })

    //重新设置索引;
    this.index = this.historylist.length - 1
  }

  removeChildren(target, nodes) {
    nodes.forEach(node => {
      node.remove ? node.remove(true) : target.removeChild(node)
    });
  }

  // index 前一个节点位置 // inx removeNode 索引+1
  addChildren(target, nodes, index, inx) {
    for (let i = 0, len = nodes.length; i < len; i++) {
      if (nodes[i]) {
        target.insertBefore(nodes[i], target.childNodes[index + inx + i])
      } else {
        target.appendChild(nodes[i])
      }
    }
  }

  //快捷方法,用来判断child在父元素的哪个节点上;
  getNodeIndexs(parent, obj) {
    // const index = parent.childNodes.indexOf(obj)
    // let preNode = obj,inx = 0;
    // if (preNode && preNode.previousSibling) {
    //   while (preNode = preNode.previousSibling) {
    //     inx++;
    //   }
    //   inx++
    // }
    const index = Array.prototype.indexOf.call(parent.childNodes, obj);
    return index < 0 ? 0 : index
  }

  // 重新开始监听;
  reObserve() {
    this._mutation.observe(this.dom, this.options)
  }

  // 保存Mutation操作到history;
  save(obj) {
    if (!obj.undo || !obj.redo) return alert('undo redo')
    this.historylist.push(obj)
  }

  // 重置history数组
  reset() {
    this.historylist = []
    this.index = 0
  }

  // 删除index后面的history;
  splice(index) {
    this.historylist.splice(index)
  }
  
  // 回退
  undo() {
    if (this.canUndo()) {
      this.historylist[this.index].undo()
      this.index--
    }
  }

  // 重写
  redo() {
    if (this.canRedo()) {
      this.index++
      this.historylist[this.index].redo()
    }
  }

  // 是否可以撤销操作
  canUndo() {
    return this.index !== -1
  }

  // 判断是否可以重新操作
  canRedo() {
    return this.historylist.length - 1 !== this.index
  }
}
export default History
