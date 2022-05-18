/**
 * @desc 金苏
 * */
 class ImgDragSize {
  constructor(dom, options) {
    this._options = options || {
      targets: ['IMG']
    }
    dom.addEventListener("click", async (event) => {
      if(this._options.targets.includes(event.target.tagName)) {
        await this._clearDragPoint(event)
        this._createdDragModal(event)
      } else {
        this._clearDragPoint(event)
      }
    });

    dom.addEventListener("mousedown", async (event) => {
      this._modalMouseDown(event)
    });
  }
  
  // 创建蒙版拖拽点
  _createdDragModal(e) {
    e.target.setAttribute('bse-selected', true) // 添加选中标识
    const fragment = document.createDocumentFragment();
    const modalDiv = document.createElement('div')
    modalDiv.className = 'bse_temp_Modal'
    modalDiv.id = 'bse_img_modal'
    modalDiv.style.position = 'absolute'
    modalDiv.style.left = e.target.offsetLeft + 'px'
    modalDiv.style.top = e.target.offsetTop + 'px'
    modalDiv.style.width = e.target.clientWidth + 'px'
    modalDiv.style.height = e.target.clientHeight + 'px'
    const cloneImg = e.target.cloneNode(false)
    cloneImg.style.width = '100%'
    cloneImg.style.height = '100%'
    modalDiv.appendChild(cloneImg)
    fragment.appendChild(modalDiv)
    const positionObj = { pointerTopLeft: '', pointerTopCenter: '', pointerTopRight: '', pointerBottomLeft: '', pointerBottomCenter: '', pointerBottomRight: '', pointerLeftCenter: '', pointerRightCenter: '' }
    for (let key of Object.keys(positionObj)) {
      positionObj[key] = document.createElement('div')
      positionObj[key].className = 'bse_temp_Modal'
      positionObj[key].id = key
      positionObj[key].style.width = '7px'
      positionObj[key].style.height = '7px'
      positionObj[key].style.background = '#28a670'
      positionObj[key].style.position = 'absolute'
      positionObj[key].style.transform = 'translate(-50%, -50%)'
      fragment.appendChild(positionObj[key])
    }
    positionObj.pointerTopLeft.style.left = e.target.offsetLeft + 'px'
    positionObj.pointerTopLeft.style.top = e.target.offsetTop + 'px'

    positionObj.pointerTopRight.style.left = e.target.offsetLeft + e.target.clientWidth + 'px'
    positionObj.pointerTopRight.style.top = e.target.offsetTop + 'px'

    positionObj.pointerBottomLeft.style.left = e.target.offsetLeft + 'px'
    positionObj.pointerBottomLeft.style.top = e.target.offsetTop + e.target.clientHeight + 'px'

    positionObj.pointerBottomRight.style.left = e.target.offsetLeft + e.target.clientWidth + 'px'
    positionObj.pointerBottomRight.style.top = e.target.offsetTop + e.target.clientHeight + 'px'

    positionObj.pointerTopCenter.style.left = e.target.offsetLeft + e.target.clientWidth/2 + 'px'
    positionObj.pointerTopCenter.style.top = e.target.offsetTop + 'px'

    positionObj.pointerBottomCenter.style.left = e.target.offsetLeft + e.target.clientWidth/2 + 'px'
    positionObj.pointerBottomCenter.style.top = e.target.offsetTop + e.target.clientHeight + 'px'

    positionObj.pointerLeftCenter.style.left = e.target.offsetLeft + 'px'
    positionObj.pointerLeftCenter.style.top = e.target.offsetTop + e.target.clientHeight/2 + 'px'

    positionObj.pointerRightCenter.style.left = e.target.offsetLeft + e.target.clientWidth + 'px'
    positionObj.pointerRightCenter.style.top = e.target.offsetTop + e.target.clientHeight/2 + 'px'
    
    document.querySelector('#bse_edit').appendChild(fragment)
  }

  // 清空选中拖拽点
  _clearDragPoint(e) {
    return new Promise((reslove) => {
      if (!e.target.classList.contains('bse_temp_Modal')) {
        const domArr = Array.from(document.querySelectorAll('.bse_temp_Modal')) // 删除方向点
        domArr.forEach(dom => dom && dom.remove())

        const selArr = Array.from(document.querySelectorAll('*[bse-selected]')) // 删除选中标识
        selArr.forEach(dom => dom && dom.removeAttribute('bse-selected'))
      }
      reslove(true)
    })
  }

  // 鼠标按下事件
  _modalMouseDown(e) {
    if (e.target.classList.contains('bse_temp_Modal')) {
      const img_wrap = document.getElementById('bse_img_modal')
      if (!img_wrap) return
      let referencePoint, finalyWidth, finalyHeight;
      if (['pointerBottomRight', 'pointerRightCenter', 'pointerBottomCenter'].includes(e.target.id)) {
        referencePoint = { top: parseInt(img_wrap.style.top), left: parseInt(img_wrap.style.left) }
      } else if (['pointerTopRight', 'pointerTopCenter'].includes(e.target.id)) {
        referencePoint = { top: parseInt(img_wrap.style.top) + parseInt(img_wrap.style.height), left: parseInt(img_wrap.style.left) }
      } else if (['pointerTopLeft'].includes(e.target.id)) {
        referencePoint = { top: parseInt(img_wrap.style.top) + parseInt(img_wrap.style.height), left: parseInt(img_wrap.style.left) + parseInt(img_wrap.style.width) }
      } else if (['pointerBottomLeft', 'pointerLeftCenter'].includes(e.target.id)) {
        referencePoint = { top: parseInt(img_wrap.style.top), left: parseInt(img_wrap.style.left) + parseInt(img_wrap.style.width) }
      }
      document.onmousemove =  (ev) => {
        const { clientX, clientY } = ev
        switch(e.target.id) {
          case 'pointerBottomRight':
            finalyWidth = clientX - referencePoint.left
            finalyHeight = clientY - referencePoint.top
            img_wrap.style.width = finalyWidth + 'px'
            img_wrap.style.height = finalyHeight + 'px'
            break
          case 'pointerRightCenter':
            finalyWidth = clientX - referencePoint.left
            img_wrap.style.width = finalyWidth + 'px'
            break
          case 'pointerTopRight':
            finalyWidth = clientX - referencePoint.left
            finalyHeight = referencePoint.top - clientY
            img_wrap.style.top = clientY + 'px'
            img_wrap.style.width = finalyWidth + 'px'
            img_wrap.style.height = finalyHeight + 'px'
            break
          case 'pointerTopCenter':
            finalyHeight = referencePoint.top - clientY
            img_wrap.style.top = clientY + 'px'
            img_wrap.style.height = finalyHeight + 'px'
            break
          case 'pointerBottomCenter':
            finalyHeight = clientY - referencePoint.top
            img_wrap.style.height = finalyHeight + 'px'
            break
          case 'pointerTopLeft':
            img_wrap.style.top = clientY + 'px'
            img_wrap.style.left = clientX + 'px'
            finalyWidth = referencePoint.left - clientX
            finalyHeight = referencePoint.top - clientY
            img_wrap.style.width = finalyWidth + 'px'
            img_wrap.style.height = finalyHeight + 'px'
            break
          case 'pointerBottomLeft':
            img_wrap.style.left = clientX + 'px'
            finalyWidth = referencePoint.left - clientX
            finalyHeight = clientY - referencePoint.top
            img_wrap.style.width = finalyWidth + 'px'
            img_wrap.style.height = finalyHeight + 'px'
            break
          case 'pointerLeftCenter':
            img_wrap.style.left = clientX + 'px'
            finalyWidth = referencePoint.left - clientX
            img_wrap.style.width = finalyWidth + 'px'
            break
        }
        
        document.onmouseup = () => {
          const selectdDom = document.querySelector('*[bse-selected]')
          if (selectdDom) {
            selectdDom.style.width = finalyWidth + 'px'
            selectdDom.style.height = finalyHeight + 'px'
            document.onmousemove = null;
          }
        }
      }
    }
  }
  
}
export default ImgDragSize
