const list = document.getElementsByClassName('list')[0]
const items = document.getElementsByClassName('list-item')
const playGround = document.getElementsByClassName('playground')
const contentContainer = document.getElementsByClassName('content-container')[0]
const animationContainer = document.getElementsByClassName('animation-container')[0]


function createAnimation(scrollStart, scrollEnd, valueStart, valueEnd) {
  return function (scroll) {
    if (scroll <= scrollStart) return valueStart
    if (scroll >= scrollEnd) return valueEnd
    return (valueStart + ((valueEnd - valueStart) * (scroll - scrollStart)) / (scrollEnd - scrollStart))
  }
}

//节点以及对应的样式属性
const animationMap = new Map() // dom作为属性， 对象为值， 对象中 需要更新的样式属性名作为对象的属性名，结果作为值

function getDomAnimation(scrollStart, scrollEnd, dom) {
  scrollStart = scrollStart + dom.dataset.order * 200
  const opacityAnimation = createAnimation(scrollStart, scrollEnd, 0, 1)
  const opacity = function (scroll) {
    return opacityAnimation(scroll)
  }

  const scaleAnimation = createAnimation(scrollStart, scrollEnd, 0.5, 1)
  const xAnimation = createAnimation(scrollStart, scrollEnd, list.clientWidth / 2 - dom.offsetLeft - dom.clientWidth / 2, 0)
  const yAnimation = createAnimation(scrollStart, scrollEnd, list.clientHeight / 2 - dom.offsetTop - dom.clientHeight / 2, 0)

  const transform = function (scroll) {
    return `translate(${xAnimation(scroll)}px,${yAnimation(scroll)}px) scale(${scaleAnimation(scroll)})`
  }

  return {
    opacity,
    transform
  }
}

function updateMap() {
  // 浏览器比例缩放等重置
  animationMap.clear()
  console.log('contentContainer: ', getStyles(contentContainer, 'height'), window.scrollY);
  const scrollStart = getStyles(contentContainer, 'height') - 630
  const scrollEnd = getStyles(contentContainer, 'height') + getStyles(animationContainer, 'height')
  for (const item of items) {
    animationMap.set(item, getDomAnimation(scrollStart, scrollEnd, item))
  }
}

function updateStyles() {
  const scroll = window.scrollY
  for (let [dom, value] of animationMap) {
    for (const cssProps in value) {
      dom.style[cssProps] = value[cssProps](scroll)
    }

  }
}

updateMap()
updateStyles()

window.addEventListener('scroll', updateStyles)

// 工具函数 元素内容尺寸
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
