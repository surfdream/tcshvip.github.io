define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib")
    ;
    var _markuser = function (op) {
        $.ajax({
            url: domains.operator + "/asyn/imported_user/mark_called.json",
            data: {
                id: op.id,
                called: !!op.called,
                call_mark: op.call_mark,
                remark: op.remark
            },
            dataType: "json",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    var _sendSMS = function (op) {
        $.ajax({
            url: domains.operator + "/asyn/imported_user/send_sms.json",
            data: {
                id: op.id
            },
            dataType: "json",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    var _sendMail = function (op) {
        $.ajax({
            url: domains.operator + "/asyn/imported_user/send_email.json",
            data: {
                id: op.id,
                email: op.email
            },
            dataType: "json",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    var _delUser = function (op) {
        $.ajax({
            url: domains.operator + "/asyn/imported_user/delete_data.json",
            data: {
                id: op.id
            },
            dataType: "json",
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    };
    exports.markuser = function (op) {
        _markuser(op);
    };
    exports.sendSMS = function (op) {
        _sendSMS(op);
    };
    exports.sendMail = function (op) {
        _sendMail(op);
    };
    exports.delUser = function (op) {
        _delUser(op);
    };

});