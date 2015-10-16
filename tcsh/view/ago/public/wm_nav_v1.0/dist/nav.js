define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
        juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js");
    require('http://s.tcsh.me/tcsh/view/ago/public/wm_nav_v1.0/css/style.css#');
    var mode = "block";
    var _navData = {
        main_nav: [],
        sub_nav: []
    };
    var _nav_html = juicer([
        '<div class="j_range">',
            '<ul class="nav_entrance_list">',
                '{@each main_nav as item}',
                '<li class="nav_entrance_item" data_map_k="${item.map_k}">',
                    '<div class="nav_entrance_item_head"><h3><a href="http://s.wumeiwang.com/list/${item.id}.html">${item.name}</a></h3></div>',
                    '<ul class="nav_entrance_item_sub">',
                        '{@each item.itemList as sub_item}',
                        '<li><a href="http://s.wumeiwang.com/list/${sub_item.id}.html">${sub_item.name}</a></li>',
                        '{@/each}',
                    '</ul>',
                '</li>',
                '{@/each}',
            '</ul>',
            '<div class="nav_entrance_list_sub">',
                '{@each sub_nav as item}',
                '<ul class="nelss_main" data_map_k="${item.map_k}">',
                    '<li class="nelss_row">',
                        '<ul>',
                        '{@each item.itemList.row1 as row}',
                            '<li class="nelss_item">',
                                '<h3><a href="http://s.wumeiwang.com/list/${row.id}.html">${row.name}</a></h3>',
                                '<ul>',
                                    '{@each row.itemList as sub_row}',
                                        '<li><a href="http://s.wumeiwang.com/list/${sub_row.id}.html">${sub_row.name}</a></li>',
                                    '{@/each}',
                                '</ul>',
                            '</li>',
                        '{@/each}',
                        '</ul>',
                    '</li>',
                    '<li class="nelss_row">',
                        '<ul>',
                        '{@each item.itemList.row2 as row}',
                            '<li class="nelss_item">',
                               '<h3><a href="http://s.wumeiwang.com/list/${row.id}.html">${row.name}</a></h3>',
                                '<ul>',
                                    '{@each row.itemList as sub_row}',
                                        '<li><a href="http://s.wumeiwang.com/list/${sub_row.id}.html">${sub_row.name}</a></li>',
                                    '{@/each}',
                                '</ul>',
                            '</li>',
                        '{@/each}',
                        '</ul>',
                    '</li>',
                    '<li class="nelss_row">',
                        '<ul>',
                        '{@each item.itemList.row3 as row}',
                            '<li class="nelss_item">',
                                '<h3><a href="http://s.wumeiwang.com/list/${row.id}.html">${row.name}</a></h3>',
                                '<ul>',
                                    '{@each row.itemList as sub_row}',
                                        '<li><a href="http://s.wumeiwang.com/list/${sub_row.id}.html">${sub_row.name}</a></li>',
                                    '{@/each}',
                                '</ul>',
                            '</li>',
                        '{@/each}',
                        '</ul>',
                    '</li>',
                '</ul>',
                '{@/each}',
            '</div>',
        '</div>'
    ].join(''));
    var initData = function () {
        var _sourceData = global_setting.navData,
            i, j, k, z = 0,
            _average,
            _main_nav_data,
            _sub_nav_data,
            _main_nav_data_sub_data,
            _sub_nav_data_sub_data,
            _min_item,
            _key,
            _row_index = 0;
        for (i in _sourceData) {
            _key = Math.random() * 9999999;
            _main_nav_data = {};
            _sub_nav_data = {};
            _main_nav_data.name = _sourceData[i].name;
            _sub_nav_data.name = _sourceData[i].name;
            _sub_nav_data.map_k = _main_nav_data.map_k = _key;
            _main_nav_data.id = i;
            _main_nav_data.itemList = [];
            _sub_nav_data.itemList = {
                all: [],
                row1: [],
                row2: [],
                row3: []
            };
            for (j in _sourceData[i].itemList) {
                _main_nav_data_sub_data = {};
                _sub_nav_data_sub_data = {};
                _main_nav_data_sub_data.name = _sourceData[i].itemList[j].name;
                _sub_nav_data_sub_data.name = _sourceData[i].itemList[j].name;
                _sub_nav_data_sub_data.id = _main_nav_data_sub_data.id = j;

                _sub_nav_data_sub_data.itemList = [];
                z = 0;
                for (k in _sourceData[i].itemList[j].itemList) {
                    z++;
                    _min_item = {};
                    _min_item.name = _sourceData[i].itemList[j].itemList[k].name;
                    _min_item.id = k;
                    _sub_nav_data_sub_data.itemList.push(_min_item);
                    if (z >= 5) {
                        break;
                    }
                }
                _main_nav_data.itemList.push(_main_nav_data_sub_data);
                _sub_nav_data.itemList.all.push(_sub_nav_data_sub_data)
            }
            _row_index = 0;
            for (j in _sub_nav_data.itemList.all) {
                ++_row_index;
                _sub_nav_data.itemList["row" + _row_index].push(_sub_nav_data.itemList.all[j]);
                if (_row_index >= 3) {
                    _row_index = 0;
                }
            }
            _navData.main_nav.push(_main_nav_data);
            _navData.sub_nav.push(_sub_nav_data);
        }
    };
    var init = function () {
        var $all_nav_item = $(".all_nav_item");
        initData();
        $all_nav_item.append(_nav_html.render(_navData));
        $all_nav_item.find(".nav_entrance_item:odd").addClass("even")
        //$all_nav_item.find(".nav_entrance_item_sub").each(function () {
        //    var $this = $(this), _h = $this.outerHeight();
        //    $this.attr("data_h", _h).css("height", _h);
        //});
        bind();
    };
    var bind = function () {
        var $all_nav_item = $(".all_nav_item"),
            $nav_entrance_item = $all_nav_item.find(".nav_entrance_item"),
            $nav_entrance_list_sub = $all_nav_item.find(".nav_entrance_list_sub"),
            $nav_entrance_list = $all_nav_item.find(".nav_entrance_list");
        var _nav_entrance_item_offset,
            _nav_entrance_itemH,
            _nav_entrance_itemTop,
            _nav_entrance_listH = $nav_entrance_list.outerHeight();
        $nav_entrance_item.hover(function () {
            var $this = $(this), $hover = $all_nav_item.find(".hover");
            $hover.removeClass("hover");
            if (mode == "list") {
                $hover.find(".nav_entrance_item_sub").css({
                    height: 0
                });
                $hover = $this.find(".nav_entrance_item_sub").css({ "height": "auto", "display": "block" });
            }
            $this.addClass("hover");
            $hover.css("height", $hover.attr("data_h"));
            _nav_entrance_item_offset = $this.position();
            $nav_entrance_list_sub.css({
                "display": "block"
            });
            $nav_entrance_list_sub.find(".nelss_main").css("display", "none");
            $nav_entrance_list_sub.find(".nelss_main[data_map_k='" + $this.attr("data_map_k") + "']").css("display", "block");
            _nav_entrance_itemH = $nav_entrance_list_sub.outerHeight();
            _nav_entrance_itemTop = _nav_entrance_item_offset.top;
            if (_nav_entrance_itemTop + _nav_entrance_itemH >= _nav_entrance_listH) {
                _nav_entrance_itemTop = _nav_entrance_listH - _nav_entrance_itemH;
            }
            $nav_entrance_list_sub.stop(true, true).animate({
                top: _nav_entrance_itemTop + 31
            }, 200);
        });
        $all_nav_item.find(".j_range").on("mouseleave", function () {
            $nav_entrance_list_sub.css({
                "display": "none"
            });
        });
        $all_nav_item.on("click", ".all_nav_show_type_item", function () {
            var $this = $(this), $parent = $this.closest(".all_nav_show_type_box");
            if ($this.hasClass("curr")) { return false; }
            var $nav_entrance_item_sub = $all_nav_item.find(".nav_entrance_item:not(.hover) .nav_entrance_item_sub");
            $parent.find(".curr").removeClass("curr");
            $this.addClass("curr");
            if ($this.attr("data_key") - 0) {
                $nav_entrance_item_sub.slideUp();
                mode = "list";
            } else {
                mode = "block";
                $nav_entrance_item_sub.css({ "display": "none", "height": "auto" }).slideDown();
            }
            return false;
        });
        if ($.browser.msie && $.browser.version === "6.0") {
            $all_nav_item.hover(function () {
                $nav_entrance_list.css("display", "block");
            }, function () {
                $nav_entrance_list.css("display", "none");
            });
        }
    };
    global_setting && global_setting.navData && init();
});
