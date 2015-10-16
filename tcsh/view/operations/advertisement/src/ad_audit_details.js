define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        tips = require("wmtips"),
        lib = require("lib"),
        juicer = require("juicer"),
        lazyload = require("wmlazyload"),
        qq_server = require("qq_server"),
        box = require("wmbox");
    var user_data = {};
    var init = function () {
        lazyload.init({
            lazyloadEle: "img"
        });
        qq_server.getData(function (data) {
            user_data = data
        });
        bind();
        var $ad_img_clone = $(".ad_img").clone(true, true).css({
            'width': "auto",
            'height': "auto",
            'max-width': 'auto',
            'max-height': 'auto',
            'visibility': 'hidden',
            'position': 'absolute',
            'top': 0
        });
        $("body").append($ad_img_clone);
        lib.imgLoad($ad_img_clone.attr("src"), function () {
            $(".actual").empty().append($ad_img_clone.outerWidth() + "*" + $ad_img_clone.outerHeight());
        });

    };
    var bind = function () {
        var $page = $("#page"), _tips_hover = false, _name_hover = false;
        $page.on("click", ".allow", function () {
            var $this = $(this), thisRelyBox = $this.data("thisRelyBox");
            if (!thisRelyBox) {
                thisRelyBox = box.relyBox({
                    rely: $this,
                    content: '确定通过广告申请？',
                    callback: function () {
                        this.close = this.hide;
                    },
                    sureCallBack: function () {
                        $.ajax({
                            url: domains.api2 + "/adlocation/api/check.json",
                            data: {
                                tempbeanid: global_setting.tempbeanid,
                                flag: true
                            },
                            dataType: "jsonp",
                            type: "get",
                            success: function (data) {
                                if (data.success) {
                                    alert("提交成功！");
                                    window.document.location.reload();
                                    //window.document.close();
                                } else {
                                    alert(data.error);
                                }
                            },
                            error: function () {

                            }
                        });
                    }
                });
                $this.data("thisRelyBox", thisRelyBox);
            }
            thisRelyBox.show();
            return false;
        });
        $page.on("click", ".not_allow", function () {
            var $this = $(this), notAllowBox = $this.data("notAllowBox");
            if (!notAllowBox) {
                notAllowBox = box.alert({
                    titleText: "请说明理由",
                    content: '<div class="not_allow_msg_mian"><textarea id="not_allow_msg" style="width: 500px;height: 200px;resize: none;"></textarea></div>',
                    callback: function () {
                        this.close = this.hide;
                    },
                    btns: [
                        {
                            cls: "ui_btn_h26red14", res: "hide", text: "确定", callback: function () {
                                var self = this,
                                    _val = self.wmBox.find("#not_allow_msg").val();
                                if (_val.length < 100) {
                                    $.ajax({
                                        url: domains.api2 + "/adlocation/api/check.json",
                                        data: {
                                            tempbeanid: global_setting.tempbeanid,
                                            describe: _val,
                                            flag: false
                                        },
                                        dataType: "jsonp",
                                        type: "get",
                                        success: function (data) {
                                            if (data.success) {
                                                setTimeout(function () {
                                                    alert("提交成功！");
                                                    window.document.location.reload();
                                                    //window.document.close();
                                                }, 500)
                                            } else {
                                                alert(data.error);
                                            }
                                        },
                                        error: function () {

                                        }
                                    });
                                } else {
                                    alert("字符长度超出！");
                                }
                            }
                        },
                        { cls: "ui_btn_h26gray11", res: "hide", text: "取消", callback: function () { } }
                    ]
                });
                $this.data("notAllowBox", notAllowBox);
            }
            notAllowBox.show();
            return false;
        });
        $page.on("click", ".stop", function () {
            var $this = $(this), stopBox = $this.data("stopBox");
            if (!stopBox) {
                stopBox = box.alert({
                    titleText: "请说明理由",
                    content: '<div class="not_allow_msg_mian"><textarea id="stop_msg" style="width: 500px;height: 200px;resize: none;"></textarea></div>',
                    callback: function () {
                        this.close = this.hide;
                    },
                    btns: [
                        {
                            cls: "ui_btn_h26red14", res: "hide", text: "确定", callback: function () {
                                var self = this,
                                    _val = self.wmBox.find("#stop_msg").val();
                                if (_val.length < 100) {
                                    $.ajax({
                                        url: domains.api2 + "/adlocation/api/put.json",
                                        data: {
                                            tempbeanid: global_setting.tempbeanid,
                                            describe: _val,
                                            flag: true
                                        },
                                        dataType: "jsonp",
                                        type: "get",
                                        success: function (data) {
                                            if (data.success) {
                                                alert("提交成功！");
                                                window.document.location.reload();
                                                //window.document.close();
                                            } else {
                                                alert(data.error);
                                            }
                                        },
                                        error: function () {

                                        }
                                    });
                                } else {
                                    alert("字符长度超出！");
                                }
                            }
                        },
                        { cls: "ui_btn_h26gray11", res: "hide", text: "取消", callback: function () { } }
                    ]
                });
                $this.data("stopBox", stopBox);
            }
            stopBox.show();
            return false;
        });
        $page.on("click", ".end", function () {
            var $this = $(this), endBox = $this.data("endBox");
            if (!endBox) {
                endBox = box.alert({
                    titleText: "请说明理由",
                    content: '<div class="not_allow_msg_mian"><textarea id="end_msg" style="width: 500px;height: 200px;resize: none;"></textarea></div>',
                    callback: function () {
                        this.close = this.hide;
                    },
                    btns: [
                        {
                            cls: "ui_btn_h26red14", res: "hide", text: "确定", callback: function () {
                                var self = this,
                                    _val = self.wmBox.find("#end_msg").val();
                                if (_val.length < 100) {
                                    $.ajax({
                                        url: domains.api2 + "/adlocation/api/put.json",
                                        data: {
                                            tempbeanid: global_setting.tempbeanid,
                                            describe: _val,
                                            flag: false
                                        },
                                        dataType: "jsonp",
                                        type: "get",
                                        success: function (data) {
                                            if (data.success) {
                                                alert("提交成功！");
                                                window.document.location.reload();
                                                //window.document.close();
                                            } else {
                                                alert(data.error);
                                            }
                                        },
                                        error: function () {

                                        }
                                    });
                                } else {
                                    alert("字符长度超出！");
                                }
                            }
                        },
                        { cls: "ui_btn_h26gray11", res: "hide", text: "取消", callback: function () { } }
                    ]
                });
                $this.data("endBox", endBox);
            }
            endBox.show();
            return false;
        });
        $page.on("click", ".restoration", function () {
            var $this = $(this), confirmBox = $this.data("confirmBox");
            if (!confirmBox) {
                confirmBox = box.relyBox({
                    rely: $this,
                    content: '确定恢复投放？',
                    callback: function () {
                        this.close = this.hide;
                    },
                    sureCallBack: function () {
                        $.ajax({
                            url: domains.api2 + "/adlocation/api/restore.json",
                            data: {
                                tempbeanid: global_setting.tempbeanid,
                                flag: true
                            },
                            dataType: "jsonp",
                            type: "get",
                            success: function (data) {
                                if (data.success) {
                                    alert("提交成功！");
                                    window.document.location.reload();
                                    //window.document.close();
                                } else {
                                    alert(data.error);
                                }
                            },
                            error: function () {

                            }
                        });
                    }
                });
                $this.data("confirmBox", confirmBox);
            }
            confirmBox.show();
            return false;
        });
        $page.on("click", ".show_precision", function () {
            var $this = $(this), _locate_key = global_setting.locateKey;
            $this.attr("href", global_setting.url + "?" + $.param({
                locateKey: _locate_key,
                asRemarkImg: global_setting.urlList[global_setting.url].data[_locate_key].asRemarkImg
                //asRemarkImg: $page.find(".ad_img").attr("src")
            }));
        });
        $page.find(".user_name").hover(function () {
            _name_hover = true;
            var $this = $(this), hoverTips = $this.data("hoverTips"), _con;
            if (!hoverTips) {
                _con = juicer([
                    '<ul class="wm_form" style="width:200px">',
                        '{@if linkPhone}',
                        '<li class="form_row">',
                            '<label class="row_key">联系电话：</label>',
                            '<span class="floatleft" style="width:30px">',
                                '{@each linkPhone as item,index}',
                                '<span style="display:block">${linkPhone[index]}</span>',
                                '{@/each}',
                            '</span>',
                        '</li>',
                        '{@/if}',
                        '<li class="form_row">',
                            '<label class="row_key">联系QQ：</label>',
                            '<span class="floatleft" style="width:30px">',
                                '{@each linkQQ as item,index}',
                                '<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=${linkQQ[index]}&amp;site=qq&amp;menu=yes" class="link_qq"><img bshopping_cart="0" src="http://wpa.qq.com/pa?p=2:${linkQQ[index]}:51" alt="点击这里给我发消息" title="点击这里给我发消息"></a>',
                                '{@/each}',
                            '</span>',
                        '</li>',
                    '</ul>'
                ].join(''));
                hoverTips = new tips({
                    ele: $this,
                    con: _con.render(user_data),
                    direction: 'rt',
                    offset: { left: 20, top: 0 },
                    callBack: function () {
                        var self = this;
                        this.$tipsBox.hover(function () {
                            _tips_hover = true;
                        }, function () {
                            _tips_hover = false;
                            setTimeout(function () {
                                !_tips_hover && !_name_hover && self.hide();
                            }, 300);
                        });
                    }
                });
                $this.data("hoverTips", hoverTips);
            }
            hoverTips.position();
            hoverTips.show();

        }, function () {
            _name_hover = false;
            var $this = $(this), hoverTips = $this.data("hoverTips");
            setTimeout(function () {
                !_tips_hover && !_name_hover && hoverTips && hoverTips.hide();
            }, 300);
        });
    };
    init();
});

