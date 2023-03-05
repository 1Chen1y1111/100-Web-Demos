init()

function init() {
  initTodoList;
}

var initTodoList = (function () {
  var showInput = document.getElementsByClassName('j-show-input')[0],
    inputWrap = document.getElementsByClassName('input-wrap')[0],
    addItem = document.getElementsByClassName('j-add-item')[0],
    oList = document.getElementsByClassName('j-list')[0],
    textInput = document.getElementById('textInput');
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
    console.log(oItems[1], 'oItems');
    for (var i = 0; i < itemLen; i++) {
      // 性能优化
      item = elemChildren(oItems[i])[0]
      var text = item.innerText;
      if (val === text) {
        alert('当前待办已存在')
        return
      }
    }
    var oLi = document.createElement('li')
    oLi.className = 'item'
    oLi.innerHTML = itemTpl(val)
    oList.appendChild(oLi)
    textInput.value = ''
  })

  function itemTpl(text) {
    return (
      '<p class="item-content">' + text + '</p>' +
      '<div class="btn-group">' +
      '<a href="javascript:;" class="edit-btn fa fa-plus"></a>' +
      '<a href="javascript:;" class="remove-btn fa fa-plus"></a>' +
      '</div>'
    )
  }
})()