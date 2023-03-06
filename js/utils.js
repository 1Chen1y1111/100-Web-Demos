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