define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        box = require("wmbox"),
        verification = require("verification"),
        juicer = require("juicer"),
        page = require("wmpage"),
        api = require("api")
    ;

    var init = function () {
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        var call_state = {
            "1": [
                { id: 1, name: "良好" },
                { id: 2, name: "无意向" }
            ],
            "0": [
                { id: 3, name: "挂断" },
                { id: 4, name: "无人接听" },
                { id: 5, name: "占号" },
                { id: 6, name: "空号" },
                { id: 7, name: "停机" },
                { id: 8, name: "关机" }
            ]
        };
        var _markbox = juicer([
            '<div class="inset_head">',
                    '<h3>通话标记</h3>',
                    '<a href="#" class="iconfont close">&#xf00b3;</a>',
                '</div>',
                '<div class="inset_main">',
                    '<ul class="wm_form">',
                        '<li class="form_row">',
                            '<label class="row_key">通话状态：</label>',
                            '<select class="form_sel call_state">',
                                '<option value="1">已通话</option>',
                                '<option value="0">未通话</option>',
                            '</select>',
                            '<select class="form_sel return_state">',
                                '<option value="1">良好</option>',
                                '<option value="2">无意向</option>',
                            '</select>',
                        '</li>',
                        '<li class="form_row">',
                            '<label class="row_key">备注：</label>',
                            '<textarea class="form_textarea"></textarea>',
                        '</li>',
                    '</ul>',
                    '<div class="btns">',
                        '<a href="#" class="close">取消</a><a href="#" class="submit">确定</a>',
                    '</div>',
                '</div>'
        ].join(''));
        var createMarkBox = function (data) {
            return box.invBox({
                boxCls: 'markbox',
                content: _markbox.render(data),
                callback: function () {
                    this.close = this.hide;
                    var self = this,
                        $call_state = this.wmBox.find(".call_state"),
                        $return_state = this.wmBox.find(".return_state");
                    this.wmBox.on("click", ".submit", function () {
                        api.markuser({
                            id: global_setting.id,
                            called: self.wmBox.find(".call_state").val() - 0,
                            call_mark: self.wmBox.find(".return_state").val() - 0,
                            remark: self.wmBox.find(".form_textarea").val(),
                            success: function (data) {
                                if (data.response) {
                                    window.location.reload();
                                } else {
                                    alert(data.error || "系统繁忙，请稍候再试");
                                }
                            },
                            error: function () {
                                alert("系统繁忙，请稍候再试");
                            }
                        });
                        return false;
                    });
                    $call_state.on("change", function () {
                        var _id = $(this).val(), _arr = [];
                        for (var i in call_state[_id]) {
                            _arr.push('<option value="' + call_state[_id][i].id + '">' + call_state[_id][i].name + '</option>');
                        }
                        $return_state.empty().append(_arr.join(''));
                    });
                }
            });
        };
        //标记
        $page.on("click", ".markuser", function () {
            var $this = $(this);
            var $this = $(this),
               markBox = $this.data("markBox");
            if (!markBox) {
                markBox = createMarkBox();
                $this.data("markBox", markBox);
            }
            markBox.show();

            return false;
        });
        //发送短信
        $page.on("click", ".send_sms", function () {
            var $this = $(this);
            if (confirm("确定发送激活短信？")) {
                api.sendSMS({
                    id: global_setting.id,
                    success: function (data) {
                        if (data.response) {
                            alert("发送成功！");
                        } else {
                            alert("系统繁忙，请稍候再试");
                        }
                    },
                    error: function () {
                        alert("系统繁忙，请稍候再试");
                    }
                });
            }
            return false;
        });
        //发送邮箱
        $page.on("click", ".send_eail", function () {
            var $this = $(this), insetbox = $this.data("insetbox");
            if (!insetbox) {
                insetbox = box.invBox({
                    boxCls: "inset_mail",
                    content: [
                        '<div class="inset_head">',
                            '<h3>发送邮箱</h3>',
                            '<a href="#" class="iconfont close">&#xf00b3;</a>',
                        '</div>',
                        '<div class="inset_main">',
                            '<input type="text" class="ipt_mail" wmv="empty|email" wmvmsg="无效的邮箱地址！|无效的邮箱地址！" />',
                            '<div class="btns">',
                                '<a href="#" class="close">取消</a><a href="#" class="submit">确定</a>',
                            '</div>',
                        '</div>'
                    ].join(''),
                    callback: function () {
                        verification.minZIndex = this.wmBox.css("z-index") - 0 + 100;
                        var self = this;
                        this.close = this.hide;
                        this.wmBox.find(".ipt_mail").val(global_setting.mail || "");
                        this.wmBox.on("click", ".submit", function () {
                            var _mail;
                            if (verification.verify(self.wmBox)) {
                                _mail = self.wmBox.find(".ipt_mail").val();
                                self.setCon([
                                    '<div class="inset_head">',
                                        '<h3>发送邮箱</h3>',
                                        '<a href="#" class="iconfont close">&#xf00b3;</a>',
                                    '</div>',
                                    '<div class="inset_main">',
                                        '<p style="font-size: 16px;text-align: center;"><i class="wm_ico loading18_18_1" style="margin-left: -10px;margin-right: 4px;"></i>邮件发送中</p>',
                                        '<p style="color: #999;text-align: center;padding:6px 0">(' + _mail + ')</p>',
                                    '</div>'
                                ].join(''));
                                self.position();
                                global_setting.mail = _mail
                                api.sendMail({
                                    id: global_setting.id,
                                    email: _mail,
                                    success: function (data) {
                                        if (data.response) {
                                            self.setCon([
                                               '<div class="inset_head">',
                                                   '<h3>发送邮箱</h3>',
                                                   '<a href="#" class="iconfont close">&#xf00b3;</a>',
                                               '</div>',
                                               '<div class="inset_main">',
                                                   '<p style="font-size: 16px;text-align: center;"><i class="wm_ico hook7" style="margin-left: -10px;margin-right: 4px;"></i>发送成功！</p>',
                                                   '<p style="color: #999;text-align: center;padding:6px 0">(' + _mail + ')</p>',
                                               '</div>'
                                            ].join(''));
                                            self.position();
                                            setTimeout(function () {
                                                window.location.reload();
                                            }, 1500);
                                        } else {
                                            self.setCon([
                                                '<div class="inset_head">',
                                                    '<h3>发送邮箱</h3>',
                                                    '<a href="#" class="iconfont close">&#xf00b3;</a>',
                                                '</div>',
                                                '<div class="inset_main">',
                                                    '<p style="font-size: 16px;text-align: center;"><i class="wm_ico ban1" style="margin-left: -10px;margin-right: 4px;"></i>发送失败！</p>',
                                                    '<p style="color: #999;text-align: center;padding:6px 0">(' + _mail + ')</p>',
                                                '</div>'
                                            ].join(''));
                                            self.position();
                                            setTimeout(function () {
                                                self.setCon([
                                                '<div class="inset_head">',
                                                    '<h3>发送邮箱</h3>',
                                                    '<a href="#" class="iconfont close">&#xf00b3;</a>',
                                                '</div>',
                                                '<div class="inset_main">',
                                                    '<input type="text" class="ipt_mail" value="' + _mail + '" wmv="empty|email" wmvmsg="无效的邮箱地址！|无效的邮箱地址！" />',
                                                    '<div class="btns">',
                                                        '<a href="#" class="close">取消</a><a href="#" class="submit">确定</a>',
                                                    '</div>',
                                                '</div>'
                                                ].join(''));
                                                self.position();
                                            }, 1000);
                                        }
                                    },
                                    error: function () {
                                        self.setCon([
                                                '<div class="inset_head">',
                                                    '<h3>发送邮箱</h3>',
                                                    '<a href="#" class="iconfont close">&#xf00b3;</a>',
                                                '</div>',
                                                '<div class="inset_main">',
                                                    '<p style="font-size: 16px;text-align: center;"><i class="wm_ico ban1" style="margin-left: -10px;margin-right: 4px;"></i>发送失败！</p>',
                                                    '<p style="color: #999;text-align: center;padding:6px 0">(' + _mail + ')</p>',
                                                '</div>'
                                        ].join(''));
                                        self.position();
                                        setTimeout(function () {
                                            self.setCon([
                                            '<div class="inset_head">',
                                                '<h3>发送邮箱</h3>',
                                                '<a href="#" class="iconfont close">&#xf00b3;</a>',
                                            '</div>',
                                            '<div class="inset_main">',
                                                '<input type="text" class="ipt_mail" value="' + _mail + '" wmv="empty|email" wmvmsg="无效的邮箱地址！|无效的邮箱地址！" />',
                                                '<div class="btns">',
                                                    '<a href="#" class="close">取消</a><a href="#" class="submit">确定</a>',
                                                '</div>',
                                            '</div>'
                                            ].join(''));
                                            self.position();
                                        }, 1000);
                                    }
                                });
                            }
                            return false
                        });
                        this.wmBox.on("click", ".close", function () {
                            verification.hideTips(self.wmBox);
                        });
                    }
                });
                $this.data("insetbox", insetbox);

            }
            insetbox.show();
            return false;
        });
    };
    init();
});
