define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
        lib = require("http://s.tcsh.me/tcsh/model/lib/dist/lib.js"),
        loginBox = require("http://s.tcsh.me/tcsh/model/wmloginbox/dist/wmloginbox.js"),
        compatible = require('http://s.tcsh.me/tcsh/model/wmcompatible/dist/wmcompatible.js');
    require("http://s.tcsh.me/tcsh/view/public/font-face/css/font-face.css#");
    var $page = $("#page");
    var init = function () {
        var $op_nav_top = $page.find(".op_nav_top"),
            $onm_item_head = $page.find(".onm_item_head");
        $page.find(".op_nav_main .curr").removeClass("curr");
        $page.find(".op_nav_main [data_key='" + global_setting.menuKey + "']").addClass("curr");
        var tracknick = lib.cookie("wm.user.username"),
            userId = lib.cookie("wm.brand.id") || 0,
            userLogo = lib.cookie("wm.brand.logo");
        if (tracknick) {
            $page.find(".head_top .user_data span").empty().append(tracknick + ',欢迎你！');
        }
        if (userId) {
            $op_nav_top.find("a").attr("href", "http://s.wumeiwang.com/pinpai/" + userId + ".html");
            $op_nav_top.find("img").attr("src", userLogo);
        }
        $.ajax({
            url:domains.i+ "/asyn/user/profile",
            dataType: "jsonp",
            type: "get",
            success: function (data) {
                //卖家title
                var busLvTitle;
                if (data.response) {
                    busLvTitle = {
                        '0': "初级商家",
                        '1': "1级商家",
                        '2': "2级商家",
                        '3': "3级商家"
                    };
                    $page.find(".uesr_data_lv").empty().append('等级：<img title="' + busLvTitle[data.response.Level] + '" style="vertical-align: middle;" src="http://s.tcsh.me/tcsh/view/public/img/LVIMGV1/lv' + data.response.Level + '.png">')
                }
            },
            error: function () { }
        });
        bind();
        compatible.placeholder();
        //每11分钟，检测登录,存在不检测登录的页面（做了特殊的登录检测）直接取消计时器
        _setInterval = setInterval(function () {
            if (global_setting.no_v_login) {
                clearInterval(_setInterval);
                return false;
            }
            lib.verificationLogin(0, function () {
                clearInterval(_setInterval);
                loginBox(function () {
                    this.close = this.hide = function () {
                        //这种方式谷歌会有问题
                        window.location.reload();
                        //这种方式存在锚点的时候会有问题
                        //window.document.location.href = window.document.location.href;
                    }
                });
            });
        }, 605000);//605000
        //导航前缩放
        $onm_item_head.each(function () {
            $(this).prepend('<a href="#" class="iconfont">&#xe621;</a>')
        });
        $onm_item_head.toggle(function () {
            var $this = $(this);
            $this.next(".onm_item_list").css({
                display: "none"
            });
            $this.find(".iconfont").empty().append('&#xe622;');
            
        }, function () {
            var $this = $(this);
            $this.next(".onm_item_list").css({
                display: "block"
            });
            $this.find(".iconfont").empty().append('&#xe621;');
        });
    };
    var bind = function () {
        if ($.browser.msie && $.browser.version === "6.0") {
            $page.find(".btn_list").hover(function () {
                $(this).addClass("btn_list_hover");
            }, function () {
                $(this).removeClass("btn_list_hover");
            });
        }
    };
    init();
});
