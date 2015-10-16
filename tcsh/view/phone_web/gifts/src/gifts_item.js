define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        lazyload = require("wmlazyload"),
        box = require('wmbox'),
        lib = require('lib'),
        forimg = require("wmforimg");
    require('jquerymobile')($);
    var init = function () {
        var $img_box = new forimg.Shuffle({
            forImgBoxEle: ".img_box",
            callback: function () {
                var $img_box = $(".img_box");
                var that = this;
                var i = this.forImgItem.length;
                var $indexBox = this.forImgBox.find(".indexBox"), indexItem = [];
                while (i--) {
                    indexItem[i] = '<li class="index_item"></li>'
                }
                $indexBox.append(indexItem.join(''));
                this.indexs = $indexBox.find(".index_item");
                this.indexs.eq(0).addClass("curr");
                //this.automatic(true);//开启自动，参数表示从前往后还是从后往左
                this.forImgBox.on("swipeleft", function () {
                    that.next();
                });
                this.forImgBox.on("swiperight", function () {
                    that.prev();
                });

            }
        });
        $("table,img").removeAttr("width").removeAttr("height").css({
            width: "auto",
            height: "auto"
        });
        lazyload.init();
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        $page.on("click", "img", function () {
            var $this = $(this), _showartwork;
            _showartwork = $this.data("showartwork");
            if (!_showartwork) {
                _showartwork = box.invBox({
                    boxCls: "showartwork",
                    content: '<div class="img_bg" style="background:#000;text-align: center;height: 100%;"><img src="' + $this.attr("src") + '" style="max-width:100%;max-height:100%;vertical-align: middle;" /></div>',
                    callback: function () {
                        var self = this;
                        this.close = this.hide;
                        this.wmBox.find(".img_bg").css({
                            'line-height': this.wmBox.height() + "px"
                        });
                        this.wmBox.on("swipe", function () {
                            return false;
                        });
                        this.wmBox.on("click", function () {
                            self.close();
                            return false;
                        });
                    }
                });
                $this.data("showartwork", _showartwork);
            }
            _showartwork.show();
            return false;
        });
        var _initBuyAttr = function () {
            return juicer([
                '<form class="wm_form" action="http://m.tcsh.me/present/pre_order">',
                   '<div class="attr_box_head">',
                        '<h3>礼物规格选择</h3>',
                        '<a href="#" class="close">×</a>',
                   '</div>',
                   '<ul>',
                       '{@each relation as item}',
                       '<li class="form_row" >',
                           '<label class="row_key">${item.key}：</label>',
                           '<ul class="floatleft options_list">',
                               '{@each item.itemList as list}',
                               '<li class="options_item" data_id="${list.id}">',
                                   '<a href="#" hidefocus="true" style="{@if list.src}padding:0;{@/if}" title="${list.name}" data_key="${item.key}" data_value="${list.name}" data_id="${list.id}" class="buy_attr">{@if list.src}<img src="${list.src}" class="showbigimg" />{@else}${list.name}{@/if}</a>',
                               '</li>',
                               '{@/each}',
                           '</ul>',
                       '</li>',
                       '{@/each}',
                   '</ul>',
                   '<div class="btns"><input type="submit" value="填写地址，准备收货" id="submit" /></div>',
                   '<input type="hidden" name="id" value="' + global_setting.data.id + '"/>',
                   '<input type="hidden" name="productid" value="' + global_setting.data.productId + '"/>',
                   '<input type="hidden" name="active_phone" value="' + lib.queryString("active_phone") + '"/>',
                   '<input type="hidden" name="sign" value="' + lib.queryString("sign") + '"/>',
                   '<input type="hidden" class="patternstr" name="PatternStr" value=""/>',
                 '</form>'
            ].join(''), SpecificationData);
        };
        $page.on("click", ".receive_btn", function () {
            box.invBox({
                boxId: 'attr_box',
                content: _initBuyAttr(),
                callback: function () {
                    var self = this;
                    this.wmBox.on("click", ".options_item", function () {
                        var $this = $(this), $list = $this.closest(".options_list");
                        $list.find(".curr").removeClass("curr");
                        $this.addClass("curr");
                        return false;
                    });
                    this.wmBox.on("click", "#submit", function () {
                        var patternArr = [];
                        $(".options_item.curr").each(function () {
                            patternArr.push($(this).attr("data_id"));
                        });
                        self.wmBox.find(".patternstr").val(patternArr.join(','));
                        if ($(".options_list").length !== $(".options_item.curr").length) {
                            alert("请选择属性");
                            return false;
                        }
                    });
                }
            });
            return false;
        });

    };
    init();

});


