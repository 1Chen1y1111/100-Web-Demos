; (function (node) {
  var TodoList = function () {
    _self = this
    this.node = node
    this.inputShow = false
    this.isEdit = false
    this.curIndex = null
    this.defaultConfig = {
      "plusBtn": "",
      "inputArea": "",
      "addBtn": "",
      "list": "",
      "itemClass": ""
    }
    this.config = this.getConfig()
    this.itemClass = this.config.itemClass
    for (var key in this.defaultConfig) {
      if (!this.config.hasOwnProperty(key)) {
        // 抛出错误
        console.log(errorInfo(key));
        return
      }
    }

    this.setConfig()

    addEvent(this.plusBtn, 'click', function () {
      // _self.showInput().call(_self)
      _self.showInput()
    })

    addEvent(this.addBtn, 'click', function () {
      _self.addBtnClick()
    })

    addEvent(this.list, 'click', function (edit) {
      var e = e || window.event,
        tar = e.target || e.srcElement;
      _self.listClick(tar)
    })
  }

  TodoList.prototype = {
    getConfig: function () {
      // var config = this.node.dataset.config // 兼容性问题
      return JSON.parse(this.node.getAttribute('data-config'))
    },

    setConfig: function () {
      var config = this.config,
        node = this.node;
      this.plusBtn = node.getElementsByClassName(config.plusBtn)[0]
      this.inputArea = node.getElementsByClassName(config.inputArea)[0]
      this.addBtn = node.getElementsByClassName(config.addBtn)[0]
      this.list = node.getElementsByClassName(config.list)[0]
      this.content = this.inputArea.getElementsByClassName('content')[0]
    },

    showInput: function () {
      var _self = this
      if (this.inputShow) {
        setInputShow.call(_self, 'close')
      } else {
        setInputShow.call(_self, 'open')
      }
    },

    addBtnClick: function () {
      var content = this.content.value,
        contentLen = content.length,
        oItems = this.list.getElementsByClassName('item'),
        itemLen = oItems.length,
        text;
      if (contentLen <= 0) {
        return;
      }

      if (itemLen > 0) {
        for (var i = 0; i < itemLen; i++) {
          text = elemChildren(oItems[i])[0].innerText
          if (text === content) {
            alert('已存在该待办事项')
            return
          }
        }
      }

      if (this.isEdit) {
        elemChildren(oItems[this.curIndex])[0].innerText = content
        setInputStatus.apply(_self, [oItems, null, "add"])
      } else {
        var oLi = document.createElement('li')
        oLi.className = this.itemClass
        oLi.innerHTML = itemTpl(content)
        this.list.appendChild(oLi)
        this.content.value = null
      }
    },

    listClick: function (tar) {
      var _self = this,
        className = tar.className,
        oItems = this.list.getElementsByClassName('item'),
        itemLen = oItems.length,
        liParent = elemParent(tar, 2),
        item;
      if (className === 'edit-btn fa fa-edit') {
        // 编辑模式下
        for (var i = 0; i < itemLen; i++) {
          item = oItems[i]
          item.className = 'item'
        }
        liParent.className += ' active'
        setInputStatus.apply(_self, [oItems, liParent, "edit"])
      } else if (className === 'remove-btn fa fa-window-close-o') {
        // 删除
        liParent.remove()
      }
    }
  }

  function setInputShow(action) {
    if (action === 'open') {
      this.inputArea.style.display = 'block'
      this.inputShow = true
    } else if (action === 'close') {
      this.inputArea.style.display = 'none'
      this.inputShow = false
    }
  }

  function setInputStatus(oItems, target, status) {
    if (status === 'edit') {
      var idx = Array.prototype.indexOf.call(oItems, target);
      this.addBtn.innerText = '编辑第' + (idx + 1) + '项'
      this.isEdit = true
      this.curIndex = idx
      this.content.value = elemChildren(oItems[idx])[0].innerText
    } else if (status === 'add') {
      var itemLen = oItems.length,
        item;
      for (var i = 0; i < itemLen; i++) {
        item = oItems[i]
        item.className = 'item'
        this.isEdit = false
        this.curIndex = null
        this.addBtn.innerText = '新增一下'
        this.content.value = null
      }
    }
  }

  function errorInfo(key) {
    return new Error(
      '您没有配置参数' + key + '\n' +
      '必须配置的参数列表如下:\n' +
      '打开输入框按钮元素类名:plusBtn\n' +
      '输入框区域元素类名:inputArea\n' +
      '增加项目按钮元素类名:addBtn\n' +
      '列表承载元素类名:list\n' +
      '列表承载元素类名:itemClass\n'
    )
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
  new TodoList()
})(document.getElementsByClassName('wrap')[0])