init()

function init() {
  initTodoList;
}

var initTodoList = (function () {
  var showInput = document.getElementsByClassName('j-show-input')[0],
    inputWrap = document.getElementsByClassName('input-wrap')[0],
    addItem = document.getElementsByClassName('j-add-item')[0],
    oList = document.getElementsByClassName('j-list')[0],
    textInput = document.getElementById('textInput'),
    isEdit = false,
    curIndex = null;
  inputShow = false;
  addEvent(showInput, 'click', function () {
    if (inputShow) {
      inputWrap.style.display = 'none'
      inputShow = false
    } else {
      inputWrap.style.display = 'block'
      inputShow = true
    }
  })

  addEvent(addItem, 'click', function () {
    var oItems = document.getElementsByClassName('item'), // 类数组
      val = textInput.value,
      len = val.length,
      itemLen = oItems.length,
      item;
    if (len === 0) {
      return
    }
    for (var i = 0; i < itemLen; i++) {
      // 性能优化
      item = elemChildren(oItems[i])[0]
      var text = item.innerText;
      if (val === text) {
        alert('当前待办已存在')
        return
      }
    }
    if (isEdit) {
      elemChildren(oItems[curIndex])[0].innerText = val
      resetStatus()
    } else {
      var oLi = document.createElement('li')
      oLi.className = 'item'
      oLi.innerHTML = itemTpl(val)
      oList.appendChild(oLi)
      textInput.value = ''
    }
  })

  addEvent(oList, 'click', function (e) {
    // IE9兼容性
    var e = e || window.event,
      tar = e.target || e.srcElement,
      className = tar.className,
      liParent = elemParent(tar, 2),
      oItems = document.getElementsByClassName('item');

    if (className === 'edit-btn fa fa-edit') {
      // 编辑模式下
      var itemLen = oItems.length,
        tarIndex = Array.prototype.indexOf.call(oItems, liParent),
        item;
      for (var i = 0; i < itemLen; i++) {
        item = oItems[i]
        item.className = 'item'
      }
      isEdit = true
      curIndex = tarIndex
      liParent.className = 'item active'
      addItem.innerText = '编辑第' + (curIndex + 1) + '项'
      textInput.value = elemChildren(oItems[tarIndex])[0].innerText
    } else if (className === 'remove-btn fa fa-window-close-o') {
      // 删除
      liParent.remove()
    }
  })

  function resetStatus() {
    textInput.value = null
    isEdit = false
    curIndex = null
    addItem.innerText = '新增一下'
  }

  function itemTpl(text) {
    return (
      '<p class="item-content">' + text + '</p>' +
      '<div class="btn-group">' +
      '<a href="javascript:;" class="edit-btn fa fa-edit"></a>' +
      '<a href="javascript:;" class="remove-btn fa fa-window-close-o"></a>' +
      '</div>'
    )
  }
})()