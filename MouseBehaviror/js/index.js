window.onload = function () {
  init()
}
function init() {
  initMenu()
}

var initMenu = (function () {
  var oMenu = document.getElementsByClassName('menu-wrap')[0],
    oMenuItems = oMenu.getElementsByClassName('main-item'),
    oSub = oMenu.getElementsByClassName('sub')[0],
    oSubItems = oSub.getElementsByClassName('sub-item'),
    menuLen = oMenuItems.length,
    subLen = oSubItems.length,
    menuItem,
    isInSub = false,
    isFirst = true,
    t = null,
    mousePoses = [];
  for (var i = 0; i < menuLen; i++) {
    menuItem = oMenuItems[i]
    addEvent(menuItem, 'mouseenter', menuItemMouseEnter)
  }

  addEvent(oMenu, 'mouseenter', function () {
    addEvent(document, 'mousemove', mouseMove)
  })

  addEvent(oMenu, 'mouseleave', menuMouseOut)

  addEvent(oSub, 'mouseenter', function () {
    isInSub = true
  })

  addEvent(oSub, 'mouseleave', function () {
    isInSub = false
  })

  function menuItemMouseEnter(e) {
    var e = e || window.event,
      tar = e.target || e.scrElement,
      thisIdx = Array.prototype.indexOf.call(oMenuItems, tar),
      curPos = mousePoses[mousePoses.length - 1] || { x: 0, y: 0 },
      lastPos = mousePoses[mousePoses.length - 2] || { x: 0, y: 0 },
      toDelay = doTimeOut(curPos, lastPos);

    oSub.className = 'sub'

    if (t) {
      clearTimeout(t)
    }

    if (!isFirst) {
      if (toDelay) {
        t = setTimeout(() => {
          if (isInSub) {
            return
          }
          addActive(thisIdx)
        }, 300);
      } else {
        addActive(thisIdx)
      }
    } else {
      addActive(thisIdx)
      isFirst = false
    }


  }

  function addActive(index) {
    removeAllActive()
    oMenuItems[index].className += ' active'
    oSubItems[index].className += ' active'
  }

  function removeAllActive() {
    for (var i = 0; i < menuLen; i++) {
      menuItem = oMenuItems[i]
      menuItem.className = 'main-item'
    }
    for (var i = 0; i < subLen; i++) {
      oSubItem = oSubItems[i]
      oSubItem.className = 'sub-item'
    }
  }

  function mouseMove(e) {
    var e = e || window.event;
    mousePoses.push({
      x: pagePos(e).X,
      y: pagePos(e).Y,
    })
    if (mousePoses.length > 3) {
      mousePoses.shift()
    }
  }

  function menuMouseOut() {
    oSub.className += ' hide'
    removeAllActive()
    removeEvent(document, 'mousemove', mouseMove)
  }

  function doTimeOut(curPos, lastPos) {
    var topRight = {
      x: getStyles(oMenu, 'width') + getStyles(oMenu, 'margin-left'),
      y: getStyles(oMenu, 'margin-top')
    }
    var bottomRight = {
      x: getStyles(oMenu, 'width') + getStyles(oMenu, 'margin-left'),
      y: getStyles(oMenu, 'height') + getStyles(oMenu, 'margin-top')
    }
    // 是否在三角形区域内
    return pointInTriangle(curPos, lastPos, topRight, bottomRight)
  }
})