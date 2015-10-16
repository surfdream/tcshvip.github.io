define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');

    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        juicer = require('http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js'),
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js');
    require('http://s.tcsh.me/tcsh/view/public/wm_brand_box/css/style.css#');
    var gData = {}, brandsBox;
    var _createBrandsList = function () {
        if (gData.BrandsList) {
            return juicer([
            '<div class="confirm_brands_mian">',
                '<div class="brands_selectt">',
                    '<label>品牌类别：</label>',
                    '<select class="sel_class">',
                        '<option value="0">全部</option>',
                        '{@each ClassList as classlist}',
                        '<option value="${classlist.value}">${classlist.name}</option>',
                        '{@/each}',
                    '</select>',
                    '<label>关键词：</label>',
                    '<input type="text" class="sel_key" />',
                    '<a href="#" class="ui_btn ui_btn_h33gray15 select"><span class="ui_btn_txt">筛选</span></a>',
                '</div>',
                '<ul class="brands_list">',
                    '{@each BrandsList as brandslist}',
                    '<li class="brands_item" data_id="${brandslist.id}" data_src="${brandslist.logo}" data_name="${brandslist.name}">',
                        '<a href="#" hidefocus="hidefocus">',
                            '<img src="${brandslist.logo}" title="${brandslist.name}" /></a>',
                        '<span title="${brandslist.name}">${brandslist.name}</span><i class="wm_ico hook4"></i>',
                    '</li>',
                    '{@/each}',
                '</ul>',
            '</div>'
            ].join('')).render(gData);
        } else {
            return juicer([
            '<div class="confirm_brands_mian">',
                '<div class="brands_selectt">',
                    '<label>品牌类别：</label>',
                    '<select class="sel_class">',
                        '<option value="0">全部</option>',
                        '{@each ClassList as classlist}',
                        '<option value="${classlist.value}">${classlist.name}</option>',
                        '{@/each}',
                    '</select>',
                    '<label>关键词：</label>',
                    '<input type="text" class="sel_key" />',
                    '<a href="#" class="ui_btn ui_btn_h33gray15 select"><span class="ui_btn_txt">筛选</span></a>',
                '</div>',
                '<ul class="brands_list">',
                    '<li style="border: 0; width: 720px;">',
                        '<span class="pipes_bg" style=" background: url(http://s.tcsh.me/tcsh/view/public/img/pipes.png) 0 0 no-repeat; width: 181px; height: 11px; display: block; vertical-align: text-top; margin: 0 auto;text-align: left;"><span class="pipes_water" style="background: url(http://s.tcsh.me/tcsh/view/public/img/pipes.png) 0 -40px no-repeat; width: 0%; height: 11px; display: inline-block; vertical-align: top;"></span></span>',
                    '</li>',
                '</ul>',
            '</div>'
            ].join('')).render(gData);
        }
    };
    var getData = function () {
        $.ajax({
            url: domains.api+"/category",
            type: "get",
            dataType: "jsonp",
            success: function (data) {
                gData.ClassList = [], _arr = [];
                for (var i in data) {
                    gData.ClassList.push({
                        value: i,
                        name: data[i].name
                    });
                }
                if (brandsBox) {
                    for (i in gData.ClassList) {
                        _arr.push('<option value="' + gData.ClassList[i].value + '">' + gData.ClassList[i].name + '</option>');
                    }
                    brandsBox.wmBox.find(".brands_selectt .sel_class").append(_arr.join(''));
                }
            }
        });
        $.ajax({
            url: domains.api+"/brand/get",
            type: "get",
            data: {
                category: 0,
                key: ""
            },
            dataType: "jsonp",
            success: function (data) {
                gData.BrandsList = data.list
                if (brandsBox) {
                    brandsBox.setCon(_createBrandsList());
                }
            }
        });
    };
    var _create = function (callback) {
        if(!gData.BrandsList){
            getData();
        }
        return box.alert({
            titleText: "选择经营品牌",
            boxCls: "confirm_brands_box",
            content: _createBrandsList(),
            btns: [
                { cls: "ui_btn_h46red8 chked_btn", res: "hide", text: "确定" },
                { cls: "alink", res: "hide", text: "取消" }],
            callback: function () {
                var self = this, $pipes_water = this.wmBox.find(".pipes_water");
                if ($pipes_water.length) {
                    $pipes_water.animate({ "width": "85%" }, 5000);
                }
                this.close = this.hide;
                this.wmBox.on("click", ".select", function () {
                    $.ajax({
                        url: domains.api+"/brand/get",
                        type: "get",
                        data: {
                            category: self.wmBox.find(".sel_class").val(),
                            key: encodeURIComponent(self.wmBox.find(".sel_key").val())
                        },
                        dataType: "jsonp",
                        success: function (data) {
                            var $brands_list = self.wmBox.find(".brands_list")
                            $brands_list.empty();
                            for (var i in data.list) {
                                $brands_list.append([
                                    '<li class="brands_item" data_id="' + data.list[i].id + '" data_src="' + data.list[i].logo + '" data_name="' + data.list[i].name + '">',
                                        '<a href="#">',
                                            '<img src="' + data.list[i].logo + '" title="' + data.list[i].name + '" /></a>',
                                        '<span title="' + data.list[i].name + '">' + data.list[i].name + '</span><i class="wm_ico hook4"></i>',
                                    '</li>'
                                ].join(''))
                            }
                        }
                    });
                    return false;
                });
                this.wmBox.on("click", ".brands_item", function () {
                    self.wmBox.find(".curr").removeClass("curr");
                    $(this).addClass("curr");
                    return false
                });
                this.wmBox.on("dblclick", ".brands_item", function () {
                    self.wmBox.find(".curr").removeClass("curr");
                    $(this).addClass("curr");
                    self.wmBox.find(".chked_btn").click();
                    return false
                });
                this.wmBox.on("click", ".chked_btn", function () {
                    var curr = self.wmBox.find(".curr");
                    typeof callback === "function" && callback({
                        length:curr.length,
                        imgSrc: curr.attr("data_src"),
                        id: curr.attr("data_id"),
                        name: curr.attr("data_name")
                    });                  
                    return false;
                });
                this.wmBox.on("keydown", ".sel_key", function (e) {
                    var $this = $(this), v =$.trim( $this.val());
                    if (v && e.keyCode === 13) {
                        $this.closest(".brands_selectt").find(".select").click();
                    }
                });
            }
        });
    };
    exports.Create = function (callback) {
        brandsBox = _create(callback);
        return brandsBox;
    };
});
