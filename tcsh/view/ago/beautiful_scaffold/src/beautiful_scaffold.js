define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        box = require("wmbox"),
        lib = require("lib"),
        out_share = require('out_share');
    forImg = require("wmforimg");
    var init = function () {
        new forImg.Fade({
            forImgBoxEle: ".big_ads",
            interval: 5000,
            callback: function () {
                var that = this;
                var i = this.forImgItem.length
                var $indexBox = this.forImgBox.find(".indexBox"), indexItem = [];
                $indexBox.empty().append('<ul></ul>');
                $indexBox = $indexBox.find("ul");
                while (i--) {
                    indexItem[i] = '<li class="index_item">' + (i + 1) + '</li>'
                }
                $indexBox.append(indexItem.join(''));

                this.indexs = $indexBox.find('.index_item');
                this.indexs.eq(0).addClass("curr");
                this.indexs.click(function () {
                    that.setIndex(this);
                });
                this.automatic(true);
            }
        });
        new forImg.Shuffle({
            forImgBoxEle: ".activity_return",
            forImgBoxListEle: ".activity_return_list",
            forImgItemEle: "li",
            direction: true,
            interval: 5000,
            callback: function () {
                this.automatic();
            }
        });
        bind();
    };
    var bind = function () {
        var role = lib.getRole();//角色，1 = 买家，2 = 卖家，3 = 买家+卖家(测试用，正常数据不会有)，4 = 管理员， 8 = 运营
        var $page = $("#page"),
            shipShoppingHtml = juicer([
            '<div class="ship_shopping_main">',
                '<div class="ship_shopping_head"><h3>发起导购</h3><span>导购成功，会有额外收益哦~</span></div>',
                '<div class="fun_list">',
                    '<fieldset class="fun_item">',
                        '<legend>发送专有链接</legend>',
                        '<input type="text" class="exclusive_link" disabled="disabled" value="${userLink}">',
                        '<a href="#" class="ui_btn ui_btn_h27red9 copy"><span class="ui_btn_txt">复制</span></a>',
                    '</fieldset>',
                    '<fieldset  class="fun_item">',
                        '<legend>发送微博分享</legend>',
                        '<div class="min_blog_list">',
                            '<a href="#" class="wm_ico tx_wb32_32 min_blog" data_type="tx" data_title="刚刚在同城生活看到了这个商品，挺不错的，小伙伴们快来买吧~" data_pic="${dataPic}" data_url="${userLink}" target="_blank"></a>',
                            '<a href="#" class="wm_ico sina_wb32_32 min_blog" data_type="sina" data_title="刚刚在同城生活看到了这个商品，挺不错的，小伙伴们快来买吧~" data_pic="${dataPic}" data_url="${userLink}" target="_blank"></a>',
                        '</div>',
                    '</fieldset>',
                '</div>',
            '</div>'
            ].join(''));
        $page.on("click", ".ship_shopping", function () {
            var $this = $(this), shipShoppingBox, $li, roleBox;
            lib.verificationLogin(function () {
                if (role.key == 1) {
                    shipShoppingBox = $this.data("shipShoppingBox");
                    if (!shipShoppingBox) {
                        $li = $this.closest("li");
                        shipShoppingBox = box.alert({
                            titleText: "同城生活导购",
                            boxCls: "ship_shopping_box",
                            content: shipShoppingHtml.render({
                                userLink: "http://click.wumeiwang.com/goandbuy?" + $.param({
                                    productid: $li.attr("data_id"),
                                    from: lib.cookie("wm.user.id")
                                }),
                                dataPic: $li.attr("data_pic")
                            }),
                            btns: [],
                            callback: function () {
                                var self = this;
                                this.wmBox.on("click", ".copy", function () {
                                    var $url = self.wmBox.find(".exclusive_link");
                                    $url[0].select();
                                    document.execCommand("Copy");
                                    alert("已复制好，可贴粘。部分浏览器不支持复制，请手动操作！");
                                    return false;
                                });
                                out_share.init(this.wmBox.find(".min_blog"));
                                this.close = function () {
                                    self.hide();
                                };
                            }
                        });
                        $this.data("shipShoppingBox", shipShoppingBox);
                    }
                    shipShoppingBox.show();
                } else {
                    roleBox = $this.data("roleBox");
                    if (!roleBox) {
                        roleBox = box.alert({
                            boxCls: "roleBox",
                            content: [
                                '<h3 style="text-align: left;width: 310px;font-size: 14px;padding-top: 20px;color: #505050; padding-left: 50px;"><i class="wm_ico sigh2" style="margin-right:10px"></i>只有买家账号才能使用该推广</h3>',
                                '<p style="padding-left: 92px;color: #999;">其他账号请联系客服获取其他推广方式！</p>'
                            ].join(''),
                            btns: [
                                { cls: "ui_btn ui_btn_h46red8 again_login", res: "close", text: "重新登录" },
                                { cls: "returnindex", res: "close", text: "返回首页" }
                            ],
                            callback: function () {
                                var self = this;
                                this.wmBox.on("click", ".again_login", function () {
                                    $.ajax({
                                        url:domains.account+ "/logout",
                                        type: "get",
                                        dataType: "jsonp",
                                        success: function () {
                                            lib.verificationLogin();
                                        },
                                        error: function () {
                                            lib.verificationLogin();
                                        }
                                    })
                                    return false;
                                });
                                this.wmBox.on("click", ".returnindex", function () {
                                    window.location.href = domains.www;
                                    return false;
                                });
                                this.close = function () {
                                    self.hide();
                                };
                            }
                        });
                        $this.data("roleBox", roleBox);
                    }
                    roleBox.show();
                }
            });
            return false;
        });
    };
    init();
});