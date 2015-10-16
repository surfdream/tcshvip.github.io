define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        forImg = require("wmforimg");
    var init = function () {
        new forImg.Fade({
            forImgBoxEle: ".new_in_box",
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
        bind();
    };
    var bind = function () { };
    init();
});
