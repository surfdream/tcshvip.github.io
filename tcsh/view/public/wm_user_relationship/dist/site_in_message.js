//站内信
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js');
    var _send = function (op) {
        $.ajax({
            url: '',
            type: 'get',
            dataType: 'jsonp',
            data: {

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
             url: '',
             type: 'get',
             dataType: 'jsonp',
             data: {

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
             url: '',
             type: 'get',
             dataType: 'jsonp',
             data: {

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
    //发送站内信
    exports.send = function (op) {
        lib.verificationLogin(function () {
            _send(op);
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
