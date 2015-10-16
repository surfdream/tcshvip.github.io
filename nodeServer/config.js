/*
nodeServerConfig
服务开启但是无法正常访问，可以考虑更改端口号建议使用8000以上的端口
*/
var express = require('express')
    , routesConfig = require('./routes/config')
    , http = require('http')
    , _attr = require("./routes/admin/attr/app")
    , _class = require("./routes/admin/class/app")
    , _upload = require("./upload/app")
    , _chat = require("./routes/chat_box/push")
    , _push = require("./routes/push/pushMsg")
    , _pageresidencetime = require("./routes/pageresidencetime/pageresidencetime");
    
;
var i,form;
var app = express(),
    //端口号
    port = 6789;

app.configure(function () {
    //定义一个私有变量减少作用域链的检索消耗(其实没必要这么写，1亿次检索才会有性能差异)
    var _app = app, _express = express
    //设置视图文件
    _app.set('views', __dirname + '/views');
    //设置模板引擎
    _app.set('view engine', 'ejs');
    //静态资源管理
    _app.use(express.static(__dirname + '/'));
    app.use(express.favicon());
    //(这个自动处理是将post携带的数据，放到request.body里面)
    _app.use(_express.bodyParser());
    //使用请求头数据自动处理：
    //(这个自动处理是将，某些不是请求头数据在head中或者直接携带在postData中的请求头信息写入到request.method，如果信息在postData里面，会将post.body里面的请求头信息删除)
    _app.use(_express.methodOverride());
    //使用调试？
    //这个不是很清楚看接口对应代码貌似和debug有关
    _app.use(_app.router);
});

app.get('/', routesConfig.default);
for (i in _attr) {
    app.get('/' + i, _attr[i]);
}

for (i in _class) {
    app.get('/' + i, _class[i]);
}

app.get('/upload', _upload.default);
app.post('/uploadform', _upload.upload);
app.post('/push', _chat.push);
app.get('/pushmsg', _push.pushMsg);
app.get('/pageresidencetime', _pageresidencetime.pageresidencetime);
//异常处理
app.configure('development', function () {
    app.use(express.errorHandler());
});
//创建这个服务，并指定端口，完了之后初始端口号
http.createServer(app).listen(port, function () {
    console.log("Express server listening on port " + port);
});