define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        lib = require('lib'),
        tips = require('wmtips'),
        evaluate = require("wmevaluate");
    var init = function () {
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        $page.on("click", ".evaluate_btn", function () {
            var $evaluate_btn = $(this), repeatTips;
            if ($evaluate_btn.data("no")) {
                return false;
            }
            if ($evaluate_btn.data("isevaluate")) {
                repeatTips = $evaluate_btn.data("repeatTips");
                if (!repeatTips) {
                    repeatTips = new tips({
                        ele: $evaluate_btn,
                        con: '<i class="wm_ico sigh1"></i>请不要重复评价！',
                        close: 3000,
                        direction:"tc"
                    });
                    $evaluate_btn.data("repeatTips", repeatTips);
                }
                repeatTips.show();
                return false;
            }
            evaluate.show({
                orderid: $evaluate_btn.attr("orderid"),
                productid: $evaluate_btn.attr("productid"),
                itemid: $evaluate_btn.attr("itemid"),
                isAjax: true,
                ajaxSuccess: function (data) {
                    var self = this,
                        $successHtml;
                    $evaluate_btn.data("no", true);
                    $evaluate_btn.find(".ui_btn").remove();
                    if (data.response) {
                        $evaluate_btn.addClass('')
                        $evaluate_btn.data("isevaluate", true);
                        $successHtml = $('<div><p style="width:350px;text-align: center;font-size: 14px; padding:50px 30px 10px 30px;line-height: 30px; font-family: simsun;font-weight: 700;color: #e13436;"><i class="wm_ico hook8" style="margin-right:10px;margin-top: -8px;"></i>评价成功！<span class="countdown" style="color: #999;font-weight: 500;font-size: 12px;">3秒钟后自动关闭</span></p></div>');
                        this.setCon($successHtml);
                        this.wmBox.find(".save_comment").remove();
                        this.position();
                        lib.countdown({
                            parent: self.wmBox,
                            ele: ".countdown",
                            countdownModel: '<span class="countdown" style="color: #999;font-weight: 500;font-size: 12px;">${i}秒钟后自动关闭</span>',
                            start: 3,
                            endCallBack: function () {
                                self.close();
                            }
                        });
                    } else {
                        alert('评价失败，请稍后再试！');
                        this.close();
                    }
                },
                ajaxError: function () {
                    alert('评价失败，请稍后再试！');
                    this.close();
                }
            });
            return false;
        });
    };
    init();
});
