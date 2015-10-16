define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        upload = require("wmupload"),
        tips = require("wmtips"),
        box = require("wmbox"),
        area = require("area"),
        verification = require("wmverification");
    var init = function () {
        verification.init($(".refund_box"));
        verification.addRule([
            {
                key: "emptySel", fun: function () {
                    return !!(this.val() - 0);
                }
            },
            {
                key: "emptyRadio", fun: function () {
                    return !!this.closest(".form_row").find(":radio:checked").length;
                }
            }
        ]);
        new area({
            provincesEle: ".sel_province",
            cityEle: ".sel_city",
            districtsEle: ".sel_districts"
        });
        bind();
    };
    var bind = function () {
        var $form = $(".refund_box"),
            $return_goods = $form.find(".return_goods"),
            $sel_list = $form.find(".sel_list"),
            $sel_disabled = $form.find(".sel_disabled"),
            $show_certificate = $form.find(".show_certificate");
        var refundmsg_html = juicer([
            '<div class="refund_msg">',
                '<h3>您已申请退款，商家会在7个工作日内处理本项申请，请耐心等待。</h3>',
                '<span>逾期未处理则自动退款给您。</span>',
                '<p></p>',
                '<a href="' + domains.order + '/order/edit_rejection?orderid=${orderid}" class="ui_btn ui_btn_h27gray8 updaterefund"><span class="ui_btn_txt">修改退款申请</span></a>',
                '<table>',
                    '<tbody>',
                        '<tr>',
                            '<td>退款编号：</td><td class="w175">${orderid}</td>',
                            '<td>申请时间：</td><td class="w175">${date}</td>',
                        '</tr>',
                        '<tr>',
                            '<td>退款类型：</td><td class="w175"><b class="red">${return_type}</b></td>',
                            '<td>退款状态：</td><td class="w175">退款确认中</td>',
                        '</tr>',
                        '<tr>',
                            '<td>退款金额：</td><td class="w175"><b class="red">${return_money}</b>元</td>',
                            '<td>退款原因：</td><td class="w175">${reason_txt}</td>',
                        '</tr>',
                        '<tr>',
                            '<td>退款说明：</td>',
                            '<td colspan="3">${remark}</td>',
                        '</tr>',
                    '</tbody>',
                '</table>',
                '<div class="btns"><a href="#" class="ui_btn ui_btn_h46red8 close"><span class="ui_btn_txt">确定</span></a></div>',
            '</div>'].join(''))
        var uploadTips;
        //$form.on("change", ".isreturngoods", function () {
        //    var isShowReturnGoods = $form.find(".isreturngoods:checked[isshow]").length;
        //    if (isShowReturnGoods) {
        //        $return_goods.show();
        //    } else {
        //        $return_goods.hide();
        //    }
        //    verification.hideTips();
        //});
        $form.on("click", ".logistics_type", function () {
            var $this = $(this), _name = $this.attr("logistics_name");
            if (_name) {
                $sel_list.css("display", "none");
                $sel_disabled.css("display", "block").empty().append('<option value="0">' + _name + '</option>').attr("disabled", "disabled");
            } else {
                $sel_list.css("display", "block");
                $sel_disabled.css("display", "none");
            }
        });
        $form.on("click", ":submit", function () {
            var $this = $(this), imgList = [], $imgList, _d = new Date(), errtips;
            if (verification.verify($form)) {
                $imgList = $form.find("#imgList");
                $form.find(".show_certificate").find("img").each(function () {
                    imgList.push($(this).attr("src"));
                });
                $imgList.val(imgList.join(','));
                $.ajax({
                    url: $form.find("form").attr("action") + "?" + $form.find("form").serialize(),
                    dataType: "json",
                    success: function (data) {
                        if (data.response) {
                            box.alert({
                                boxCls: "refund_msg_box",
                                content: refundmsg_html.render({
                                    orderid: $form.find("[name='OrderId']").val(),
                                    date: _d.getFullYear() + "-" + (_d.getMonth() + 1) + "-" + _d.getDate() + " " + _d.getHours() + ":" + _d.getMinutes() + ":" + _d.getSeconds(),
                                    return_type: ($form.find(".isreturngoods:checked").val() - 0) ? "退货退款" : "不退货",
                                    return_money: ($form.find(".RejectionPrice").val() - 0).toFixed(2),
                                    reason_txt: $.trim($form.find(".ReasonId :selected").text()),
                                    remark: $form.find(".Remark").val()
                                }),
                                btns: [],
                                callback: function () {
                                    this.close = function () {
                                        window.location.href = domains.order+"/order/edit_rejection?orderid=" + $form.find("[name='OrderId']").val();
                                    }
                                }
                            });
                        } else {
                            errtips = $this.data("errtips");
                            if (!errtips) {
                                errtips = new tips({
                                    ele: $this,
                                    con: "系统繁忙，请稍候再试！<br>@码农，赶紧处理！",
                                    direction: "tc",
                                    offset: { top: -5 },
                                    close: 2000
                                });
                                $this.data("errtips", errtips);
                            }
                            data.errmsg="你妹"
                            data.errmsg && errtips.setCon(data.errmsg);
                            errtips.show();
                        }
                    },
                    error: function () {
                        errtips = $this.data("errtips");
                        if (!errtips) {
                            errtips = new tips({
                                ele: $this,
                                con: "系统繁忙，请稍候再试！<br>@码农，赶紧处理！",
                                direction: "tc",
                                offset: { top: -5 },
                                close: 2000
                            });
                            $this.data("errtips", errtips);
                        }
                        errtips.show();
                    }
                });
            }
            return false;
        });
        $form.find(".up_certificate").on("change", function () {
            var $this = $(this);
            upload.upload($this, function (data) {
                if (data.response && data.upLoadSuccess) {
                    $show_certificate.append('<li><a href="#" class="wm_ico fork2 del_upimg" title="删除此图"></a><img src="' + data.response.imgurl + '" title="凭证"><input type="hidden" value="' + data.response.imgurl + '" name="Images"></li>');
                } else {
                    if (!uploadTips) {
                        uploadTips = new tips({
                            ele: ".uploadimg_btn",
                            con: "凭证上传失败，请重新上传！",
                            skin: "red2",
                            direction: "tc",
                            offset: { top: -5 },
                            close: 2000
                        });
                    }
                    uploadTips.show();
                }
            });
        });
        $form.on("click", ".del_upimg", function () {
            var $this = $(this);
            $this.closest("li").remove();
            return false;

        });
    };
    init();
});
