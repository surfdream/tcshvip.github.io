define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    require("http://s.tcsh.me/tcsh/model/wmarea/css/style.css");
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
        juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js'),
        relationship = require('http://s.tcsh.me/tcsh/model/wmarea/dist/area_data_relationship.js'),
        area_data = require('http://s.tcsh.me/tcsh/model/wmarea/dist/area_data.js');
    var createBox = function (data) {
        var _html = juicer([
            '<div class="chk_area_head">',
                '<a href="#" class="close">×</a>',
                '<h3>选择区域</h3>',
            '</div>',
            '<div class="area_province">',
                '<ul>',
                '{@each relationship as list,index}',
                    '<li class="area_item clearfix">',
                        '<span class="floatleft w70">',
                            '<input type="checkbox" class="chk_item chkedsub" id="area_${key}_${index}" /><label class="chk_key" for="area_${key}_${index}"><b>${list.name}</b></label>',
                        '</span>',
                        '<div class="floatleft w480 provincelist" data_ids="{@each list.cityList as item}${item},{@/each}">',
                        '</div>',
                    '</li>',
                    '{@/each}',
                '</ul>',
            '</div>',
            '<div class="btns">',
               '<a href="#" class="ui_btn ui_btn_h27gray8 submit"><span class="ui_btn_txt">确定</span></a>',
            '</div>',
        ].join(''));
        _html = $(_html.render(data));
        _html.find(".provincelist").each(function () {
            var $this = $(this);
            var ids = $this.attr("data_ids");
            ids = ids.substr(0, ids.lastIndexOf(",")).split(",");
            $this.empty();
            for (var i in ids) {
                var province_box = $([
                    '<div class="province_box">',
                        '<span>',
                            '<input type="checkbox" class="chk_item province_item" data_name="' + area_data.data_province[ids[i]] + '" data_id="' + ids[i] + '" id="province_' + data.key + '_' + ids[i] + '" />',
                            '<label class="chk_key" for="province_' + data.key + '_' + ids[i] + '">' + area_data.data_province[ids[i]] + '</label>',
                            '<b class="sum"></b>',
                            '<a href="#" class="wm_ico arrow9down showcity"></a>',
                        '</span>',
                        '<div class="city_list"><ul><a href="#" class="cityhide">×</a></ul></div>',
                    '</div>'
                ].join(''));
                var $append = province_box.find(".city_list ul");
                var _data = area_data.data_city[ids[i]];
                for (var j in _data) {
                    $append.append('<li><input type="checkbox" class="city_item" id="city_' + data.key + "_" + _data[j].value + '" data_name="' + _data[j].name + '" data_id="' + _data[j].value + '" /><label for="city_' + data.key + "_" + _data[j].value + '">' + _data[j].name + '</label></li>');
                }
                $this.append(province_box);
            }
        });
        return _html;
    };
    var _box = function (op) {
        var self = this;
        var _op = $.extend({}, op);
        var data = {
            key: parseInt(Math.random() * 999) + 100,
            relationship: relationship
        }
        var invBox = box.invBox({
            boxCls: 'chk_area_box',
            content: createBox(data),
            callback: function () {
                var _this = this;
                this.close = function () { _this.hide(); }
            }
        });
        invBox.close = function () {
            self.hide();
        }
        invBox.wmBox.on("change", ".chkedsub", function () {
            var $this = $(this), $area_item = $this.closest(".area_item");
            if ($this.attr("checked")) {
                $area_item.find(".province_item:enabled").attr("checked", "checked").change();
            } else {
                $area_item.find(".province_item:enabled").removeAttr("checked").change();
            }
        });
        invBox.wmBox.on("click", ".showcity", function () {
            var $this = $(this), $area_province = $this.closest(".area_province");
            $area_province.find(".province_box_showcity").removeClass("province_box_showcity");
            $this.closest(".province_box").addClass("province_box_showcity");
            return false;
        });
        invBox.wmBox.on("change", ".province_item", function () {
            var $this = $(this), cityList = $this.closest(".province_box").find(".city_list"), $area_item = $this.closest(".area_item");
            if ($this.attr("checked")) {
                cityList.find(".city_item:enabled").attr("checked", "checked");
            } else {
                cityList.find(".city_item:enabled").removeAttr("checked");
            }
            if ($area_item.find(".province_item").length === $area_item.find(".province_item:checked").length) {
                $area_item.find(".chkedsub").attr("checked", "checked");
            } else {
                $area_item.find(".chkedsub").removeAttr("checked");
            }
        });
        invBox.wmBox.on("change", ".city_item", function () {
            var $this = $(this), $province_box = $this.closest(".province_box");
            if ($this.attr("checked") && $province_box.find(".city_item").length === $province_box.find(".city_item:checked").length) {
                $province_box.find(".province_item:enabled").attr("checked", "checked");
            } else {
                $province_box.find(".province_item:enabled").removeAttr("checked");
            }
        });
        invBox.wmBox.on("change", ".province_item,.city_item", function () {
            var $this = $(this), $province_box = $this.closest(".province_box"), $sum = $province_box.find(".sum"), _length = $province_box.find(".city_item:checked").length;
            $sum.empty();
            if (_length) {
                $sum.append("(" + _length + ")");
            }
        });
        invBox.wmBox.on("click", ".cityhide", function () {
            var $this = $(this);
            $this.closest(".province_box").removeClass("province_box_showcity");
            return false;
        });
        invBox.wmBox.on("click", ".submit", function () {
            var $this = $(this);
            self.hide();
            typeof _op.submitCallback === "function" && _op.submitCallback.call(self);
            return false;
        });
        this.Box = invBox.wmBox;
        this.getVal = function () {
            var _data = {};
            _data.cityList = [];
            _data.provinceList = [];
            invBox.wmBox.find(".city_item:checked").each(function () {
                var $this = $(this);
                _data.cityList.push({ id: $this.attr("data_id"), name: $this.attr("data_name") });
            });
            invBox.wmBox.find(".province_item:checked").each(function () {
                var $this = $(this);
                _data.provinceList.push({ id: $this.attr("data_id"), name: $this.attr("data_name") });
            });
            return _data
        };
        this.show = function (cb) {
            typeof _op.callback === "function" && _op.callback.call(self);
            typeof cb === "function" && cb.call(self);
            invBox.show();
        };
        this.hide = function () {
            invBox.hide();
        };
        this.close = function () {
            invBox.close();
        };
        this.empty = function () {
            self.Box.remove();
            invBox.mask.remove();
        };
        this.provinceList = invBox.wmBox.find('.province_box');
        this.areaBoxList = invBox.wmBox.find('.area_item');
        typeof _op.callback === "function" && _op.callback.call(this);
    };
    return function (op) {
        return new _box(op);
    };

});
