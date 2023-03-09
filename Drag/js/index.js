Element.prototype.dragClick = (function (elemClick) {
  var bTime = 0,
    eTime = 0,
    oPos = [],
    wWidth = getViewsSize().width,
    wHeight = getViewsSize().height,
    eleWidth = getStyles(this, 'width'),
    eleHeight = getStyles(this, 'height');
  drag.call(this)
  function drag() {
    var x,
      y,
      _self = this;

    addEvent(_self, 'mousedown', function (e) {
      var e = e || window.event;
      bTime = new Date().getTime()
      oPos = [getStyles(_self, 'left'), getStyles(_self, 'top')]
      x = pagePos(e).X - getStyles(_self, 'left')
      y = pagePos(e).Y - getStyles(_self, 'top')

      addEvent(document, 'mousemove', mouseMove)
      addEvent(document, 'mouseup', mouseUp)
      cancelBubble(e)
      preventDefaultEvent(e)
    })

    function mouseMove(e) {
      var e = e || window.event,
        eleLeft = pagePos(e).X - x,
        eleTop = pagePos(e).Y - y;
      if (eleLeft <= 0) {
        eleLeft = 0
      } else if (eleLeft >= wWidth - eleWidth) {
        eleLeft = wWidth - eleWidth
      } else if (eleTop <= 0) {
        eleTop = 0
      } else if (eleTop >= wHeight - eleHeight) {
        eleTop = wHeight - eleHeight
      }
      _self.style.top = eleTop + 'px'
      _self.style.left = eleLeft + 'px'
    }

    function mouseUp(e) {
      var e = e || window.event;
      eTime = new Date().getTime()
      if (eTime - bTime < 300) {
        _self.style.left = oPos[0] + 'px'
        _self.style.top = oPos[1] + 'px'
        elemClick()
      }
      removeEvent(document, 'mousemove', mouseMove)
      removeEvent(document, 'mouseup', mouseUp)
    }
  }
})