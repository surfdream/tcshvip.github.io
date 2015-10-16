define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
		box = require("wmbox"),
		juicer = require("juicer"),
		lib = require("lib")
    ;

    var init = function () {

        bind();
    };
    var bind = function () {
        var $page = $("#page"),
            $all_chk = $page.find(".all_chk");
        $page.on("click", ".member_item", function () {
            var $this = $(this), confirm_box = $this.data("confirm_box");
            if (!confirm_box) {
                confirm_box = box.alert({
                    boxCls: "crowd_box transfer_confirm",
                    content: [
                        '<div style="width: 400px;text-align: center;line-height: 34px;color:#666;font-size: 14px;padding: 30px 0 0 0;">',
                            '<p><span class="iconfont" style="color:#ffce55;margin-right: 6px;">&#xf0142;</span>你确定要把公社“死兔帮”转让</p>',
                            '<p>给愤怒的屌丝！</p>',
                            '<p>确认后不可更改</p>',
                            '<p style="padding: 34px 0 0 0;">',
                                '<a href="#" class="ui_btn ui_btn_h26blue2 sure_btn"><span class="ui_btn_txt">确定</span></a>   ',
                                '<a href="#" class="ui_btn ui_btn_h26white6 close"><span class="ui_btn_txt">取消</span></a>',
                            '</p>',
                        '</div>'
                    ].join(''),
                    btns: [],
                    callback: function () {
                        var self = this;
                        this.close = this.hide;
                        this.wmBox.on("click", ".sure_btn", function () {
                            $.ajax({
                                url: domains.commune + "/transfer/commune.json",
                                dataType: "json",
                                data: {
                                    memberId: $this.closest(".member_item").attr("data_id")
                                },
                                success: function (data) {
                                    if (data.success) {
                                        window.location.href = "http://www.tcsh.me/";
                                    } else {
                                        alert(data.error || "转让失败！");
                                    }
                                },
                                error: function () {
                                    alert(data.error || "系统繁忙！");
                                }
                            });
                            self.close();
                            return false;
                        });
                    }
                });
                $this.data("confirm_box", confirm_box);
            }
            confirm_box.show();
            return false;
        });
    };
    init();
});