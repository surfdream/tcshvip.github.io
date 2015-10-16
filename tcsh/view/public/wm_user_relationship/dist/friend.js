//用户交互
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js');
    //获取用户基础数据
    var _getBaseData = function (op) {
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
    //屏蔽用户的站内信
    _shieldSIM = function (op) {
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
    //获取用户好友
    _getUserFriend = function (op) {
        $.ajax({
            url: "",
            type: "get",
            dataType: "jsonp",
            data: {},
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //获取推荐用户
    _getNBUser = function (op) {
        $.ajax({
            url: "",
            type: "get",
            dataType: "jsonp",
            data: {},
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //获取用户数据
    _getFriendData = function (op) {
        $.ajax({
            url: "",
            type: "get",
            dataType: "jsonp",
            data: {},
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //发送心情
    _sendMood = function (op) {
        $.ajax({
            url: domains.www+"/user/mood/add",
            type: "get",
            dataType: "jsonp",
            data: {
                mood: encodeURIComponent(op.mood)
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //获取用户心情列表
    _getUserMoodList = function (op) {
        $.ajax({
            url:domains.www+ "/user/mood/get",
            type: "get",
            dataType: "jsonp",
            data: {},
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //获取所有用户心情列表
    _getAllMoodList = function (op) {
        $.ajax({
            url: "",
            type: "get",
            dataType: "jsonp",
            data: {},
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    }
    ;
    //获取基础数据
    exports.getBaseData = function (op) {
        lib.verificationLogin(function () {
            _getBaseData(op);
        });
    };
    //屏蔽用户的站内信
    exports.shieldSIM = function (op) {
        lib.verificationLogin(function () {
            _shieldSIM(op);
        });
    };
    //获取好友列表
    exports.getUserFriend = function (op) {
        lib.verificationLogin(function () {
            _getUserFriend(op);
        });
    };
    //获取推荐用户
    exports.getNBUser = function (op) {
        _getNBUser(op);
    };
    //获取用户信息
    exports.getFriendData = function (op) {
        lib.verificationLogin(function () {
            _getFriendData(op);
        });
    };
    //发送心情
    exports.sendMood = function (op) {
        lib.verificationLogin(function () {
            _sendMood(op);
        });
    };
    //获取用户心情列表
    exports.getUserMoodList = function (op) {
        lib.verificationLogin(function () {
            _getUserMoodList(op);
        });
    };
});
