define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');

    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        juicer = require('http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js'),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js'),
        tips = require('http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js'),
        loginBox = require('http://s.tcsh.me/tcsh/model/wmloginbox/dist/wmloginbox.js'),
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js');
    require("http://s.tcsh.me/tcsh/view/public/wm_share/css/style.css#");
    var userFriendData, roleTips, role = lib.getRole();
    var _createShare = function (data) {
        var _r = parseInt(Math.random() * 999) + 100;
        data._r = _r;
        var _html = juicer([
         '<div class="share_con">',
            '<div class="share_head">',
                '<span class="right">',
                    '<input type="checkbox" class="chked_allfriend" id="labfor_${_r}" />',
                    '<label for="labfor_${_r}">全部好友</label>',
                '</span>',
                '<span>好友列表：</span>',
            '</div>',
            '<ul class="friendlist">',
                '{@each friendlist as item}',
                '<li>',
                    '<input type="checkbox" id="friend_${_r}_${item.Id}" class="chk_friend" data_id="${item.Id}" />',
                    '<label for="friend_${_r}_${item.Id}" title="${item.Name}">${item.Name}</label>',
                '</li>',
                '{@/each}',
            '</ul>',
            '<div class="share_btns">',
                '<a href="#" class="ui_btn ui_btn_h26yellow12 share_btn"><span class="ui_btn_txt">分  享</span></a>',
            '</div>',
            '<div class="social_list">',
                '<span>同步到：</span>',
                '<ul>',
                   '{@if sina}',
                   '<li>',
                        '<a href="#" class="social_icon sina_wb2"></a>',
                    '</li>',
                    '{@else}',
                    '<li>',
                        '<a href="#" class="social_icon sina_wb2_notactive"></a>',
                    '</li>',
                    '{@/if}',
                    '{@if qzone}',
                    '<li>',
                        '<a href="#" class="social_icon tx_qzone"></a>',
                    '</li>',
                    '{@else}',
                    '<li>',
                        '<a href="#" class="social_icon tx_qzone_notactive"></a>',
                    '</li>',
                    '{@/if}',
                    '{@if txwb}',
                    '<li>',
                        '<a href="#" class="social_icon tx_wb"></a>',
                    '</li>',
                    '{@else}',
                    '<li>',
                        '<a href="#" class="social_icon tx_wb_notactive"></a>',
                    '</li>',
                    '{@/if}',
                '</ul>',
            '</div>',
        '</div>'
        ].join(''));
        return _html.render(data);
    };
    var _showrelyBox = function (_op, userFriendData) {
        _op.content = _createShare(userFriendData);
        var _share = box.relyBox(_op);
        _share.wmBox.on("change", ".chked_allfriend", function () {
            _share.wmBox.find(".chk_friend").attr("checked", "checked");
        });
        _share.wmBox.find(".share_btn").click(function () {
            alert("分享接口未提供！");
            _share.hide();
            return false;
        });
        return _share;
    };
    var show = function (op) {
        var i;
        if (typeof op === "string") {
            i = op;
            op = {
                rely: $(i)
            }
        }
        if (op instanceof $) {
            i = op;
            op = {
                rely: i
            }
        }
        var _op = $.extend({
            boxCls: "shareBox",
            rely: null,
            offset: {
                left: -220
            },
            btns: []
        }, op);
        if (_op.rely) {
            if (role.key === "1") {
                _share = _op.rely.data("shareBox");
                if (!_share) {
                    if (!userFriendData) {
                        $.ajax({
                            url: domains.member+'/friend/list',
                            type: "get",
                            dataType: "jsonp",
                            success: function (data) {
                                if (data.response) {
                                    userFriendData = {};
                                    userFriendData.friendlist = data.response;
                                    //userFriendData.sina = '20121445785';
                                    //userFriendData.txwb = '130016001';
                                    _share = _showrelyBox(_op, userFriendData);
                                    _op.rely.data("shareBox", _share).attr("showshare", "pubshow");
                                    _share.show();
                                }
                            }
                        });
                    } else {
                        _share = _showrelyBox(_op, userFriendData);
                        _op.rely.data("shareBox", _share).attr("showshare", "pubshow");
                    }
                } else {
                    _op.rely.attr("showshare", "pubshow");
                    _share.show();
                }
            } else {
                if (!roleTips) {
                    roleTips = new tips({
                        ele: _op.rely,
                        con: '<p>' + role.value + '账号不能进行站内分享操作！<br><a href="#" class="login" style="color: #4fa2d6;">重新登录</a></p>',
                        direction: 'tc',
                        offset: {
                            top: -5
                        },
                        callBack: function () {
                            this.$tipsBox.on("click", ".login", function () {
                                loginBox();
                                return false;
                            });
                        }
                    });
                }
                roleTips.show();
            }
        }
        return false;
    };
    var hide = function (paeent) {
        paeent = paeent || "body"
        $(paeent).find("[showshare='pubshow']").each(function () {
            var $this = $(this), _shareBox;
            _shareBox = $this.removeAttr("showshare").data("shareBox");
            _shareBox && _shareBox.hide();
        });
    };
    exports.show = function (op) {
        lib.verificationLogin(function () {

            show(op);

        });

    };
    exports.init = function (op) {
        if (typeof op === "string") {
            i = op;
            op = {
                rely: $(i)
            }
        }
        if (op instanceof $) {
            i = op;
            op = {
                rely: i
            }
        }
        op.rely.on("click", function () {
            show(op);
            return false;
        });
    };
    exports.hide = function (paeent) {
        hide(paeent);
    };

});
