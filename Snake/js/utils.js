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

function elemChildren(node) {
  var temp = {
    'length': 0,
    'splice': Array.prototype.splice
  },
    len = node.childNodes.length;
  for (var i = 0; i < len; i++) {
    var childItem = node.childNodes[i];
    if (childItem.nodeType === 1) {
      temp[temp.length] = childItem;
      temp['length']++
    }
  }
  return temp
}
/**
 * 查找父级元素
 * @param {HTMLElement} node 当前元素节点
 * @param {Number} n 第几个父级元素
 */
function elemParent(node, n) {
  var type = typeof (n);
  if (type === 'undefined') {
    return node.parentNode
  } else if (n <= 0 || type !== 'number') {
    return undefined
  }

  while (n) {
    node = node.parentNode
    n--
  }
  return node
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