//url模块（nodejs）
var urllib = require('url');
/*socket模块（nodejs）
开启推送端口端口号为：9999，这个端口号其实随意的，只要木有被占用就行
*/
var io = require('socket.io').listen(7758);
//简单队列
var queue = function (ip) {
    var self = this;
    this.list = [];
    this.add = function (data, cb) {
        self.list.push(data);
        typeof cb === "function" && cb();
    };
    this.get = function () {
        return self.list.shift();
    };
    this.getIP = function () {
        return ip
    };
};
//事实上这个user是个山寨的数据库（我用来缓存数据的，这里偷懒了）
var user = {};
var userLength = 0;
var keyToIp = {};
/*
事件绑定
connection事件为，服务端出现链接后执行
我在该事件中表现为，每存在一个链接用户，就为其开出一片内存，用于存放推送信息，这里我没优化，用户多的情况下 应该很坑爹
然后执行推送数据的监听
*/
io.sockets.on('connection', function (socket) {
    var _ip = socket.handshake.address.address;
    !keyToIp[_ip] && console.log(_ip + "：进入");
    keyToIp[_ip] = socket.id;
    if (!user[socket.id]) {
        user[socket.id] = new queue(_ip);
        userLength++;
        setTimeout(function () {
            var _d = new Date();
            for (var i in user) {
                user[i].add({
                    userName: _ip,
                    remark: '进来了!',
                    msg: "",
                    date: _d.getHours() + ":" + _d.getMinutes() + ":" + _d.getSeconds(),
                    ip: _ip
                });
            }
        }, 1000);
    }
    _push(socket);
    
});
/*
开启推送数据的监听，用setInterval，伪造出多线程
这边我没什么好的想法，有好的解决方案，求交流
*/
var _push = function (socket) {
    var _setInterval;
    _setInterval = setInterval(function () {
        var item = user[socket.id] && user[socket.id].get();
        if (item) {
            socket.emit("chat_box", item);
        }
       
    }, 100);
};
/*
接受发送消息的接口，记得那个配置的js吗？
var chat = require("./routes/chat_box/push");
app.post('/push', chat.push);
这句话就是转到这个接口来处理了
*/
exports.push = function (req, res) {
    var _param = req.body,
     _d = new Date();
    //接受到发送消息后，为每个链接用户加入推送消息   
    for (var i in user) {
        console.log(user[i].ip)
        user[i].add({
            userName: _param.uname || user[i].ip,
            msg: _param.text,
            date: _d.getHours() + ":" + _d.getMinutes() + ":" + _d.getSeconds(),
            ip: user[i].getIP()
        });
    }
    res.send('');
    //服务端的监控，可以在命令提示符中看到
    console.log(_param.uname + '有新消息');
};
