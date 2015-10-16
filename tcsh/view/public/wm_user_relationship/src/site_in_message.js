//站内信
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js');
    //单人发送
    var _send = function (op) {
        $.ajax({
            url: domains.api2 + '/dialogue/add.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                sceneId: op.sceneId,
                messageText: op.message
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //多人发送
     _sends = function (op) {
         $.ajax({
             url: domains.api2 + '/dialogue/multiple/send.json',
             type: 'get',
             dataType: 'jsonp',
             data: {
                 receiverIds: op.ids,
                 messageText: op.message
             },
             success: function (data) {
                 typeof op.success === "function" && op.success(data);
             },
             error: function () {
                 typeof op.error === "function" && op.error();
             }
         });
     },
     _delAll = function (op) {
         $.ajax({
             url: domains.api2 + '/dialogue/delete/all.json',
             type: 'get',
             dataType: 'jsonp',
             data: {
                 sceneId: op.sceneId
             },
             success: function (data) {
                 typeof op.success === "function" && op.success(data);
             },
             error: function () {
                 typeof op.error === "function" && op.error();
             }
         });
     },
     _delSingle = function (op) {
         $.ajax({
             url: domains.api2 + '/dialogue/delete.json',
             type: 'get',
             dataType: 'jsonp',
             data: {
                 id: op.id
             },
             success: function (data) {
                 typeof op.success === "function" && op.success(data);
             },
             error: function () {
                 typeof op.error === "function" && op.error();
             }
         });
     }
    ;
    //发送站内信（单人）
    exports.send = function (op) {
        lib.verificationLogin(function () {
            _send(op);
        });
    };
    //发送站内信（多人）
    exports.sends = function (op) {
        lib.verificationLogin(function () {
            _sends(op);
        });
    };
    //删除与某个人的聊天记录
    exports.delAll = function (op) {
        lib.verificationLogin(function () {
            _delAll(op);
        });
    };
    //删除单挑聊天记录
    exports.delSingle = function (op) {
        lib.verificationLogin(function () {
            _delSingle(op);
        });
    };
});
