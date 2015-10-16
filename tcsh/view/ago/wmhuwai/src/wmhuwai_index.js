define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        lazyload = require("wmlazyload"),
         wmas = require("wmas"),
        forImg = require("wmforimg");
    var init = function () {
        var $page = $("#page");
        wmas.init({
            callback: [
                {
                    key: "adv_max_320",
                    fun: function () {
                        if (this.find(".for_img_item").length > 1) {
                            new forImg.Fade({
                                forImgBoxEle: ".adv_max_320",
                                interval: 5000,
                                callback: function () {
                                    var that = this;
                                    var i = this.forImgItem.length
                                    var $indexBox = this.forImgBox.find(".indexBox"), indexItem = [];
                                    while (i--) {
                                        indexItem[i] = '<li>' + (i + 1) + '</li>';
                                    }
                                    $indexBox.append(indexItem.join(''));
                                    this.indexs = $indexBox.find('li');
                                    this.indexs.eq(0).addClass("curr");
                                    this.indexs.click(function () {
                                        that.setIndex(this);
                                    });
                                    this.automatic(true);
                                }
                            });
                        }
                    }
                },
                {
                    key: "adv_220_340",
                    fun: function () {
                        this.find(".spread_brand img[src='']").attr("src", 'http://s.tcsh.me/tcsh/view/ago/wmwomen/img/404logo.png');
                    }
                },
                {
                    key: "adv_180_420_1",
                    fun: function () {
                        this.find(".specialty_brand img[src='']").attr("src", 'http://s.tcsh.me/tcsh/view/ago/wmwomen/img/404logo.png');
                    }
                },
                {
                    key: "adv_180_420_2",
                    fun: function () {
                        this.find(".specialty_brand img[src='']").attr("src", 'http://s.tcsh.me/tcsh/view/ago/wmwomen/img/404logo.png');
                    }
                },
                {
                    key: "adv_180_420_3",
                    fun: function () {
                        this.find(".specialty_brand img[src='']").attr("src", 'http://s.tcsh.me/tcsh/view/ago/wmwomen/img/404logo.png');
                    }
                },
                {
                    key: "adv_180_420_4",
                    fun: function () {
                        this.find(".specialty_brand img[src='']").attr("src", 'http://s.tcsh.me/tcsh/view/ago/wmwomen/img/404logo.png');
                    }
                },
                {
                    key: "adv_180_420_5",
                    fun: function () {
                        this.find(".specialty_brand img[src='']").attr("src", 'http://s.tcsh.me/tcsh/view/ago/wmwomen/img/404logo.png');
                    }
                },
                {
                    key: "adv_180_420_6",
                    fun: function () {
                        this.find(".specialty_brand img[src='']").attr("src", 'http://s.tcsh.me/tcsh/view/ago/wmwomen/img/404logo.png');
                    }
                },
                {
                    key: "adv_180_420_7",
                    fun: function () {
                        this.find(".specialty_brand img[src='']").attr("src", 'http://s.tcsh.me/tcsh/view/ago/wmwomen/img/404logo.png');
                    }
                },
                {
                    key: "adv_180_420_8",
                    fun: function () {
                        this.find(".specialty_brand img[src='']").attr("src", 'http://s.tcsh.me/tcsh/view/ago/wmwomen/img/404logo.png');
                    }
                },
                {
                    key: "adv_180_420_9",
                    fun: function () {
                        this.find(".specialty_brand img[src='']").attr("src", 'http://s.tcsh.me/tcsh/view/ago/wmwomen/img/404logo.png');
                    }
                }
            ],
            otherData: "logo"
        });

        bind();
    };
    var bind = function () {

    };
    init();
});