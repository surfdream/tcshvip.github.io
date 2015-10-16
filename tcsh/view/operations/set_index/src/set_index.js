define(function (require, exports, module) {
    var $ = require("jquery"),
        juicer = require("juicer"),
        box = require("wmbox"),
        page = require("wmpage");
    var _html = juicer([
        '<div class="shop_main">',
            '<div class="shop_main">',
                '<p class="msg">选中总数：<b>${currlist.length}</b>个</p>',
                '<ul class="curr_list">',
                    '{@each currlist as item}',
                    '<li class="curr_item" title="${item.name}" data_id="${item.id}" data_name="${item.name}"><span class="shop_name">${item.name}</span><a href="#" class="wm_ico fork2 remove_item" title="移除该项"></a></li>',
                    '{@/each}',
                '</ul>',
                '<hr />',
                '<ul class="shop_list">',
                    '{@each alllist as item}',
                    '<li class="shop_item" title="${item.name}" data_id="${item.id}" data_name="${item.name}"><span class="shop_name">${item.name}</span><i class="wm_ico hook3"></i></li>',
                    '{@/each}',
                '</ul>',
                '<div class="wm_page"></div>',
            '</div>',
        '</div>'
    ].join(''));
    var init = function () {

        bind();
    };
    var bind = function () {
        var $page = $("#page");
        var currList = [
                { id: "1", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店1" },
                { id: "2", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店2" },
                { id: "3", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店3" },
                { id: "11", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店11" },
                { id: "12", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店12" },
                { id: "13", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店13" },
                { id: "14", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店14" },
                { id: "21", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店21" },
                { id: "22", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店22" },
                { id: "23", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店23" },
                { id: "24", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店24" },
                { id: "50", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店50" },
                { id: "100", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店100" },
                { id: "200", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店200" },
                { id: "300", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店300" },
                { id: "500", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店500" },
                { id: "700", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店700" },
                { id: "900", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店900" },
                { id: "1000", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店1000" },
                { id: "10001", name: "怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店10001" }
        ];
        var allList = [];
        var i = 40;
        for (var _i = 0; _i < i; _i++) {
            allList.push({
                id: _i,
                name: '怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店怪叔叔旗舰店' + _i
            });
        }
        $page.on("click", ".add", function () {
            var $this = $(this), _box = $this.data("box");
            if (!_box) {
                _box = box.alert({
                    boxId: "shop_box",
                    titleText: "优先展示店铺",
                    content: _html.render({
                        currlist: currList,
                        alllist: allList
                    }),
                    callback: function () {
                        var self = this;
                        this.close = this.hide;
                        for (var i in currList) {
                            this.wmBox.find(".shop_item[data_id='" + currList[i].id + "']").addClass("curr");
                        }
                        this.wmBox.on("click", ".shop_item", function () {
                            var $this = $(this),_name,_id;
                            $this.toggleClass("curr");
                            if (!$this.hasClass("curr")) {
                                self.wmBox.find(".curr_list .curr_item[data_id='" + $this.attr("data_id") + "']").find(".remove_item").click();
                            } else {
                                _name = $this.attr("data_name");
                                _id = $this.attr("data_id");
                                self.wmBox.find(".curr_list").prepend('<li class="curr_item" title="' + _name + '" data_id="' + _id + '"><span class="shop_name">' + _name + '</span><a href="#" class="wm_ico fork2 remove_item" title="移除该项"></a></li>');
                            }
                            return false;
                        });
                        this.wmBox.on("click", ".remove_item", function () {
                            var $this = $(this).closest(".curr_item");
                            $this.addClass("curr_item_remove");
                            setTimeout(function () {
                                $this.remove();
                            }, 300)
                            return false;
                        });
                    }
                });
                $this.data("box", _box);
            }
            _box.show();
            return false;
        });
    };
    init();
});
