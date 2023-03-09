// 浏览器可视区域尺寸
function getViewsSize() {
  if (window.innerWidth) {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  } else {
    if (window.compatMode === 'BackCompat') {
      return {
        width: document.body.clientWidth,
        height: document.body.clientHeight
      }
    } else {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      }
    }
  }
}

// 获取鼠标点击pageX\Y
function pagePos(e) {
  var sLeft = getScrollOffset().left,  // 滚动条距离
    sTop = getScrollOffset().top,
    cLeft = document.documentElement.clientLeft || 0, // 文档偏移
    cTop = document.documentElement.clientTop || 0;
  return {
    X: e.clientX + sLeft - cLeft,
    Y: e.clientY + sTop - cTop,
  }
}

// 获取滚动条距离
function getScrollOffset() {
  if (window.pageXOffset) {
    return {
      left: window.pageXOffset,
      top: window.pageYOffset
    }
  } else {
    return {
      left: document.body.scrollLeft + document.documentElement.scrollLeft,
      top: document.body.scrollTop + document.documentElement.scrollTop
    }
  }
}

/**
 * 获取样式属性
 * @param {HTMLElement} ele   当前元素节点
 * @param {*}           props 所要获取的计算样式
 * @returns 
 */
function getStyles(ele, props) {
  if (window.getComputedStyle) {
    if (props) {
      return parseInt(window.getComputedStyle(ele, null)[props])
    } else {
      return window.getComputedStyle(ele, null)
    }
  } else {
    if (props) {
      return parseInt(ele.currentStyle[props])
    } else {
      return ele.currentStyle
    }
  }
}

/**
 * 绑定事件处理函数
 * @param {HTMLElement} el    当前元素节点
 * @param {String}      type  所要绑定的事件名
 * @param {Function}    fn    事件回调函数
 */
function addEvent(el, type, fn) {
  if (el.addEventListener) {
    el.addEventListener(type, fn, false)
  } else if (el.attachEvent) {
    el.attachEvent('on' + type, function () {
      fn.call(el)
    })
  } else {
    el['on' + type] = fn
  }
}

/**
 * 绑定事件处理函数
 * @param {HTMLElement} el    当前元素节点
 * @param {String}      type  所要绑定的事件名
 * @param {Function}    fn    事件回调函数
 */
function removeEvent(el, type, fn) {
  if (el.addEventListener) {
    el.removeEventListener(type, fn, false)
  } else if (el.attachEvent) {
    el.detachEvent('on' + type, function () {
      fn.call(el)
    })
  } else {
    el['on' + type] = null
  }
}

/**
 * 取消冒泡行为
 * @param {Event} e 事件对象
 */
function cancelBubble(e) {
  var e = e || window.event;
  if (e.stopPropagation) {
    e.stopPropagation()
  } else {
    e.cancelBubble = true
  }
}

/**
 * 阻止默认行为
 * @param {Event} e 事件对象
 */
function preventDefaultEvent(e) {
  var e = e || window.event;
  if (e.preventDefaultEvent) {
    e.preventDefaultEvent()
  } else {
    event.returnValue = false
  }
}

/**
 * 拖拽函数
 * @param {HTMLElement} elem 当前元素节点
 */
function elemDrag(elem) {
  var x,
    y;

  addEvent(elem, 'mousedown', function (e) {
    var e = e || window.event;
    x = pagePos(e).X - getStyles(elem, 'left')
    y = pagePos(e).Y - getStyles(elem, 'top')
    addEvent(document, 'mousemove', mouseMove)
    addEvent(document, 'mouseup', mouseUp)
    cancelBubble(e)
    preventDefaultEvent(e)
  })

  function mouseMove(e) {
    var e = e || window.event;
    elem.style.top = pagePos(e).Y - y + 'px'
    elem.style.left = pagePos(e).X - x + 'px'
    if (elem.style.top === '0px') {
      removeEvent(document, 'mousemove', mouseMove)
    } else if (elem.style.left === '0px') {
      removeEvent(document, 'mousemove', mouseMove)
    } else (
      addEvent(document, 'mousemove', mouseMove)
    )
  }

  function mouseUp(e) {
    var e = e || window.event;
    removeEvent(document, 'mousemove', mouseMove)
    removeEvent(document, 'mouseup', mouseUp)
  }
}

/**
 * 判断点是否在一个三角形内
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
function vec(a, b) {
  return {
    x: b.x - a.x,
    y: b.y - a.y
  }
}

function vecProduct(v1, v2) {
  return v1.x * v2.y - v2.x * v1.y
}

function sameSymbols(a, b) {
  return (a ^ b) >= 0
}

function pointInTriangle(p, a, b, c) {
  var PA = vec(p, a),
    PB = vec(p, b),
    PC = vec(p, c),
    R1 = vecProduct(PA, PB),
    R2 = vecProduct(PB, PC),
    R3 = vecProduct(PC, PA);
  return sameSymbols(R1, R2) && sameSymbols(R2, R3)
}