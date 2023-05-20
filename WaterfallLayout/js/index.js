var isTestDemo = isTestDemo || false;
isTestDemo = true
void function (window, document, undefined) {

  // ES5 strict mode
  "user strict";


  var MIN_COLUMN_COUNT = 3; // 最小列数
  var COLUMN_WIDTH = 220;   // 每个item宽度
  var CELL_PADDING = 26;    // 每个item内边距
  var GAP_HEIGHT = 15;      // 每个item之间的垂直间距
  var GAP_WIDTH = 15;      // 每个item之间的水平间隙
  var THRESHOLD = 2000;     // 确定item是否离视口太远(px)

  var columnHeights;        // 每个列的高度的数组
  var columnCount;          // 列数
  var noticeDelay;          // 弹出通知计时器
  var resizeDelay;          // 视口变化
  var scrollDelay;          // 滚动变化
  var managing = false;     // 管理状态
  var loading = false;      // 加载状态
  var appendCellsNum = 0    // 请求次数

  var noticeContainer = document.getElementById('notice');
  var cellsContainer = document.getElementById('cells');

  // 跨浏览器兼容
  var addEvent = function (el, type, fn) {
    if (el.addEventListener) {
      el.addEventListener(type, fn, false)
    } else if (el.attachEvent) {
      el.attachEvent('on' + type, function () {
        fn.call(el)
      })
    } else {
      el['on' + type] = fn
    }
  };

  // 获取数组中的最小值
  var getMinVal = function (arr) {
    return Math.min.apply(Math, arr);
  };

  // 获取数组中的最大值
  var getMaxVal = function (arr) {
    return Math.max.apply(Math, arr);
  };

  // 获取数字数组中最小值的索引
  var getMinKey = function (arr) {
    var key = 0;
    var min = arr[0];
    for (var i = 1, len = arr.length; i < len; i++) {
      if (arr[i] < min) {
        key = i;
        min = arr[i];
      }
    }
    return key;
  };

  // 获取数字数组中最大值的索引
  var getMaxKey = function (arr) {
    var key = 0;
    var max = arr[0];
    for (var i = 1, len = arr.length; i < len; i++) {
      if (arr[i] > max) {
        key = i;
        max = arr[i];
      }
    }
    return key;
  };

  // 从当前页面宽度计算列数
  var getColumnCount = function () {
    return Math.max(MIN_COLUMN_COUNT, Math.floor((document.body.offsetWidth + GAP_WIDTH) / (COLUMN_WIDTH + GAP_WIDTH)));
  }

  // 重置列高度和容器宽度的数组
  var resetHeights = function (count) {
    columnHeights = [];
    for (var i = 0; i < count; i++) {
      columnHeights.push(0);
    }
    cellsContainer.style.width = (count * (COLUMN_WIDTH + GAP_WIDTH) - GAP_WIDTH) + 'px';
  };

  // Test MODE
  var appendCellsDemo = function (num) {
    if (loading) {
      // Avoid sending too many requests to get new cells.
      return;
    }
    var fragment = document.createDocumentFragment();
    var cells = [];
    var images = [0, 286, 143, 270, 143, 190, 285, 152, 275, 285, 285, 128, 281, 242, 339, 236, 157, 286, 259, 267, 137, 253, 127, 190, 190, 225, 269, 264, 272, 126, 265, 287, 269, 125, 285, 190, 314, 141, 119, 274, 274, 285, 126, 279, 143, 266, 279, 600, 276, 285, 182, 143, 287, 126, 190, 285, 143, 241, 166, 240, 190];
    for (var j = 0; j < num; j++) {
      var key = Math.floor(Math.random() * 60) + 1;
      var cell = document.createElement('div');
      cell.className = 'cell pending';
      cells.push(cell);
      cell.innerHTML = `
        <p><a href="#"><img src="express/img/${key}.jpg" height="${images[key]}" width="190" /></a></p>
      `
      fragment.appendChild(cell);
    }
    // 模拟网络延迟
    setTimeout(function () {
      loading = false;
      cellsContainer.appendChild(fragment);
      adjustCells(cells);
    }, 2000);
  };

  // 通过Ajax获取JSON字符串，解析为HTML并附加到容器中
  var appendCells = function (num) {
    if (appendCellsNum * columnCount + columnCount + columnCount > 60) {
      appendCellsNum = 1
    } else {
      appendCellsNum += 1
    }
    if (loading) {
      // 节流
      return;
    }
    var xhrRequest = new XMLHttpRequest();
    var fragment = document.createDocumentFragment();
    var cells = [];
    var images;
    xhrRequest.open('POST', `http://localhost:3000/getFileList`, true);
    xhrRequest.setRequestHeader('Content-Type', 'application/json');
    xhrRequest.onreadystatechange = function () {
      if (xhrRequest.readyState == 4 && xhrRequest.status == 200) {
        images = JSON.parse(xhrRequest.response);
        for (var j = 0, k = images.length; j < k; j++) {
          var cell = document.createElement('div');
          cell.className = 'cell pending';
          cells.push(cell);
          cell.innerHTML = `<img src="${JSON.parse(images[j]).imgSrc}">`
          fragment.appendChild(cell);
        }
        // <p><a href="#"><img src="img/${images[j].src}.jpg" height="${images[j].height}" width="${images[j].width}" /></a></p>
        cellsContainer.appendChild(fragment);
        loading = false;
        adjustCells(cells);
      }
    };
    loading = true;
    xhrRequest.send(JSON.stringify({
      start: appendCellsNum * columnCount,
      count: num
    }));
  };

  /**
  * file转base64
  */
  function fileToDataUrl(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = function (e) {
        // resolve(evt.target.result)
        let data
        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        resolve(data)
      }
      reader.readAsDataURL(file)
    })
  }

  // 定位新附加的单元格并更新列高度数组
  var adjustCells = function (cells, reflow) {
    var columnIndex;
    var columnHeight;
    for (var j = 0, k = cells.length; j < k; j++) {
      // 新item添加到最小高度的列中
      columnIndex = getMinKey(columnHeights);
      columnHeight = columnHeights[columnIndex];
      cells[j].style.height = (cells[j].offsetHeight - CELL_PADDING) + 'px';
      cells[j].style.left = columnIndex * (COLUMN_WIDTH + GAP_WIDTH) + 'px';
      cells[j].style.top = columnHeight + 'px';
      // 更新添加后的列高数组
      columnHeights[columnIndex] = columnHeight + GAP_HEIGHT + cells[j].offsetHeight;
      if (!reflow) {
        cells[j].className = 'cell ready';
      }
    }
    cellsContainer.style.height = getMaxVal(columnHeights) + 'px';
    manageCells();
  };

  // 视口变化调整布局
  var reflowCells = function () {
    // Calculate new column count after resize.
    columnCount = getColumnCount();
    if (columnHeights.length != columnCount) {
      // Reset array of column heights and container width.
      resetHeights(columnCount);
      adjustCells(cellsContainer.children, true);
    } else {
      manageCells();
    }
  };

  // 根据它们在视窗中的偏移量从DOM中切换旧单元格的内容，节省内存
  // 如果viewport中有空间，加载并追加新的item
  var manageCells = function () {
    // 避免多发异步请求
    managing = true;

    var cells = cellsContainer.children;
    var viewportTop = (document.body.scrollTop || document.documentElement.scrollTop) - cellsContainer.offsetTop; // 滚动条滚动距离
    var viewportBottom = (window.innerHeight || document.documentElement.clientHeight) + viewportTop;

    for (var i = 0, l = cells.length; i < l; i++) {
      if ((cells[i].offsetTop - viewportBottom > THRESHOLD) || (viewportTop - cells[i].offsetTop - cells[i].offsetHeight > THRESHOLD)) {
        if (cells[i].className === 'cell ready') {
          cells[i].fragment = cells[i].innerHTML;
          cells[i].innerHTML = '';
          cells[i].className = 'cell shadow';
        }
      } else {
        if (cells[i].className === 'cell shadow') {
          cells[i].innerHTML = cells[i].fragment;
          cells[i].className = 'cell ready';
        }
      }
    }

    // 当前视口空间足够，则继续请求
    if (viewportBottom > getMinVal(columnHeights)) {
      // 是否不模拟请求?
      if (isTestDemo) {
        appendCellsDemo(columnCount);
      } else {
        appendCells(columnCount);
      }
    }

    // Unlock managing state.
    managing = false;
  };

  // 滚动500ms节流
  var delayedScroll = function () {
    clearTimeout(scrollDelay);
    if (!managing) {
      // Avoid managing cells for unnecessity.
      scrollDelay = setTimeout(manageCells, 500);
    }
  };

  // 视口变化500ms节流
  var delayedResize = function () {
    clearTimeout(resizeDelay);
    resizeDelay = setTimeout(reflowCells, 500);
  };

  // 初始化布局
  var init = function () {
    // 添加系列监听事件
    // addEvent(cellsContainer, 'click', updateNotice);
    addEvent(window, 'resize', delayedResize);
    addEvent(window, 'scroll', delayedScroll);

    // 初始化列高度和容器宽度的数组
    columnCount = getColumnCount();
    resetHeights(columnCount);

    // Load cells for the first time.
    manageCells();
  };

  // start to work
  addEvent(window, 'load', init);

}(window, document)
