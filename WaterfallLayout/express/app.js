const express = require('express');
const path = require('path');
const fs = require('fs');
// 在服务端代码中引入 body-parser 中间件
const bodyParser = require('body-parser');
const app = express();

// 设置静态资源路径
// 使用express.static中间件 让服务器可以返回静态文件
app.use(express.static(path.resolve(__dirname, './img')))
app.all('*', function (req, res) {
  res.header('Access-Control-Allow-Origin', "*")
  res.header('Access-Control-Allow-Methods', 'GEt,POST,PUT')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Content-Type', 'application/json')
  req.next()
})
// 使用 body-parser 中间件，解析 application/json 格式的参数
app.use(bodyParser.json());

// 设定路由
app.post('/getFileList', function (req, res) {
  const start = req.body.start || 1;
  const count = req.body.count || 8;
  const _fileArr = []
  for (let i = start; i < start + count; i++) {
    const imgPath = __dirname + '/img/' + i + '.jpg';
    var imgBuffer = fs.readFileSync(imgPath);
    var base64String = imgBuffer.toString('base64');
    var imgSrcString = 'data:image/jpeg;base64,' + base64String; // 拼接 data URI 格式
    var imgJson = JSON.stringify({ imgSrc: imgSrcString });
    _fileArr.push(imgJson)
  }

  res.send(_fileArr);
});

// 启动服务器
app.listen(3000, function () {
  console.log('getFileList app listening on port 3000!');
});
