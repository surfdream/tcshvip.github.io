define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        lib = require('lib'),
        box = require('wmbox'),
        out_share = require('out_share');
    var init = function () {
        var role = lib.getRole();//角色，1 = 买家，2 = 卖家，3 = 买家+卖家(测试用，正常数据不会有)，4 = 管理员， 8 = 运营
        if (role.key != 1) {
            box.alert({
                boxId: "roleBox",
                content: [
                    '<h3 style="text-align: left;width: 310px;font-size: 14px;padding-top: 20px;color: #505050; padding-left: 50px;"><i class="wm_ico sigh2" style="margin-right:10px"></i>只有买家账号才能使用该推广</h3>',
                    '<p style="padding-left: 92px;color: #999;">其他账号请联系客服获取其他推广方式！</p>'
                ].join(''),
                btns: [
                    { cls: "ui_btn ui_btn_h46red8 again_login", res: "close", text: "重新登录" },
                    { cls: "returnindex", res: "close", text: "返回首页" }
                ],
                callback: function () {
                    this.wmBox.on("click", ".again_login", function () {
                        $.get(domains.account+"/logout", function () {
                            window.location.reload();
                        });
                        return false;
                    });
                    this.wmBox.on("click", ".returnindex", function () {
                        window.location.href = domains.www;
                        return false;
                    });
                    this.wmBox.find(".wmBox-head .close").remove();
                }
            });
            return false;
        }
        var $page = $("#page"),
            exclusive_link = $page.find(".exclusive_link").val() || domains.www;
        $page.find(".wm_ico[data_type]").each(function () {
            var $this = $(this);
            $this.attr("data_title", "同城生活买东西，更便宜哦~");
            $this.attr("data_pic", "http://s.tcsh.me/tcsh/view/public/img/wm_logo.png");
            $this.attr("data_url", exclusive_link);
            $this.attr("target", "_blank");
        });
        out_share.init($page.find(".wm_ico[data_type]"));
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        $page.on("click", ".copy", function () {
            var $url = $page.find(".exclusive_link");
            $url[0].select();
            document.execCommand("Copy");
            alert("已复制好，可贴粘。部分浏览器不支持复制，请手动操作！");
            return false;
        });
    };
    lib.verificationLogin(function () {
        init();
    });
});