define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        upload = require('wmupload'),//上传模块
        juicer = require("juicer"),
        classbox = require("classbox");

    require('http://s.tcsh.me/tcsh/view/public/font-face/css/font-face.css#')
    var $page = $("#page"),
        gData;
    var _nav_item = juicer([
        '<ul>',
            '<li class="form_row">',
                '<label class="row_key">真实名称：</label>',
                '<span>${name}</span>',
            '</li>',
             '<li class="form_row">',
                '<label class="row_key">昵称：</label>',
                '<input type="text" class="form_txt w150 nickname" value="${nickname}" />',
            '</li>',
            '<li class="form_row">',
                '<label class="row_key">背景色：</label>',
                '<input type="text" class="form_txt bg_color_val w80" value="${bgcolor}">',
                '<span class="bg_color" style="background: ${bgcolor}"></span>',
                '<span class="emphasis">背景色必须与小图的四周颜色接近</span>',
            '</li>',
            '<li class="form_row">',
                '<label class="row_key">小图：</label>',
                '<div class="floatleft"><img src="${small_img}" class="small_img" style="float:left;max-width:200px"><a href="#" class="iconfont edit_ico">&#xf0022;</a><input type="file" class="form_file up_img" /></div>',
                '<span class="emphasis">小图尺寸建议：宽度140~200，高度160 ~ 280</span>',
            '</li>',
            '<li class="form_row">',
                '<label class="row_key">小图链接：</label>',
                '<div class="floatleft"><input type="text" class="form_txt w500 small_img_url" value="${small_img_url}" /></div>',
            '</li>',

            '<li class="form_row">',
                '<label class="row_key">优先级：</label>',
                '<input type="text" class="form_txt txt_index w30" value="${sort}"><b class="emphasis"><=0，表示不展示该大类</b>',
            '</li>',
            '<li class="form_row">',
                '<label class="row_key">展示类目：</label><a href="#" class="iconfont edit_class">&#xf00c6;</a>',
                '<div class="floatleft sub_class_list" style="width:710px;padding-left: 16px;"></div>',
            '</li>',
        '</ul>'
    ].join(''));
    var sub_class_item = juicer([
        '{@each data as item}',
        '<ul class="sub_class_item" data_id="${item.id}">',
            '<li class="form_row">',
                '<label class="row_key">类目昵称：</label>',
                '<input type="text" class="form_txt sub_class_name" value="${item.name}" />',
                '<a href="#" class="iconfont remove_sub_class_item" title="删除此类">&#xf0155;</a>',
            '</li>',
            '<li class="form_row">',
                '<label class="row_key">类目配图：</label>',
                '<img src="${item.big_pic}" class="big_img" style="float:left;width:36px;height:43px"><a href="#" class="iconfont edit_ico">&#xf0022;</a><input type="file" class="form_file up_img" />',
            '</li>',
            '<li class="form_row">',
                '<label class="row_key">跳转地址：</label>',
                '<input type="text" class="form_txt sub_class_url" value="${item.classify_url}" />',
            '</li>',
        '</ul>',
        '{@/each}'
    ].join(''));
    var initData = function (callback) {
        $.ajax({
            url: domains.api+"/category",
            type: "get",
            dataType: "jsonp",
            success: function (data) {
                gData = data;
                typeof callback === "function" && callback();
            }, error: function () {
                alert(domains.api+"/category  Error !");
            }
        });
    };
    var initClassList = function () {
        var $class_list = $page.find(".class_list");
        var _html = [];
        for (var i in gData) {
            _html.push('<option value="' + i + '">' + gData[i].name + '</option>');
        }
        $class_list.empty().append('<option value="0">-请选择-</option>');
        $class_list.append(_html.join(''));
    };
    var initPageData = function () {
        $.ajax({
            url: domains.api2+"/base/defalut/street.json",
            type: "get",
            dataType: "jsonp",
            success: function (data) {
                for (var i in data) {
                    gData[i].nickname = data[i].categoryName;
                    gData[i].bgcolor = data[i].bgColor;
                    gData[i].small_img = data[i].smallPic;
                    gData[i].small_img_url = data[i].url;
                    gData[i].sort = data[i].sort;
                    gData[i].data = data[i].configureHomeStreet3;
                }
                typeof callback === "function" && callback();
            }, error: function (e) {
                throw domains.api2+"/base/defalut/street.json Error"
            }
        });
    };
    var init = function () {
        var $set_nav = $(".set_nav");
        document.domain = "tcsh.me"
        initData(function () {
            initClassList();
            initPageData();
        });
        $set_nav.prepend('<li class="btns fixed_box" style="left:' + ($set_nav.offset().left + $set_nav.outerWidth()) + 'px"><a href="#" class="ui_btn ui_btn_h33gray15 save"><span class="ui_btn_txt">保存</span></a></li>');
        bind();
    };
    var bind = function () {
        var $nav_item = $page.find(".nav_item");
        $page.find(".class_list").on("change", function () {
            var $this = $(this), _v = $this.val();
            if (!(_v - 0)) {
                $nav_item.empty();
                return;
            }
            //var _subList = gData[_v].itemList;
            var _append = _nav_item.render(gData[_v]);
            $nav_item.empty().append(_append);
            $nav_item.find(".sub_class_list").empty().append(sub_class_item.render(gData[_v]));

        });
        $page.on("click", ".showhide", function () {
            var $this = $(this);
            if ($this.attr("hide")) {
                $this.removeAttr("hide").empty().append("收起");
                $this.closest(".form_row").find(".sub_list .sub_list").css("display", "block");
            } else {
                $this.attr("hide", 1).empty().append("展示");;
                $this.closest(".form_row").find(".sub_list .sub_list").css("display", "none");
            }
            return false;
        });
        $page.on("click", ".save", function () {
            var postData = {},
                i;
            //一级分类Id
            postData.category_id = $page.find(".class_list").val() - 0;
            if (!postData.category_id) {
                alert("请选择大类");
                return false;
            }
            postData.itemlist = [];
            $nav_item.find(".sub_class_item").each(function () {
                var $this = $(this);
                postData.itemlist.push({
                    id: $this.attr("data_id"),
                    name: $.trim($this.find(".sub_class_name").val()),
                    big_pic: $this.find(".big_img").attr("src"),
                    classify_url: $.trim($this.find(".sub_class_url").val())
                });
            });
            //分类昵称
            postData.category_name = encodeURIComponent($.trim($nav_item.find(".nickname").val()));
            //小图
            postData.small_pic = encodeURIComponent($nav_item.find(".small_img").attr("src"));
            //小图链接
            postData.product_url = encodeURIComponent($.trim($nav_item.find(".small_img_url").val()));
            //背景色
            postData.bg_color = $.trim($nav_item.find(".bg_color_val").val());
            //优先级
            postData.sort = $.trim($nav_item.find(".txt_index").val());
            //二级列表
            postData.itemlist = JSON.stringify(postData.itemlist);
            $.ajax({
                url: domains.api2+"/base/defalut/savestreet.json",
                type: "get",
                dataType: "jsonp",
                data: postData,
                success: function (data) {
                    if (data.success) {
                        alert("设置成功！");
                        window.location.reload();
                    } else {
                        alert(data.error || "设置失败！");
                    }

                },
                error: function () {
                    alert("保存异常！");
                }
            });
            console.log(postData)
            return false;
        });
        $page.on("keyup", ".hover_color", function () {
            var $this = $(this),
                $bg_color = $this.closest(".form_row").find(".bg_color"),
                _v = $this.val();
            $bg_color.css("background", _v);
        });
        //change冒泡存在兼容问题，运营后台不考虑兼容
        $page.on("change", ".up_img", function () {
            var $this = $(this);
            upload.upload($this, function (data) {
                if (data.response) {
                    this.closest(".form_row").find("img").attr("src", data.response.imgurl);
                }
            });
        });
        //选取分类
        $page.on("click", ".edit_class", function () {
            var $this = $(this),
                thisBox = $this.data("thisBox");
            if (!thisBox) {
                thisBox = classbox.createBox({
                    ischkNo3: false,
                    callback: function () {
                        var ids = [];
                        $nav_item.find(".sub_class_item").each(function () {
                            var $this = $(this);
                            ids.push($this.attr("data_id"));
                        });
                        this.chked(ids);
                    },
                    submitCallback: function () {
                        var data = this.getVal();
                        var $sub_class_list = $nav_item.find(".sub_class_list"),
                            $sub_class_item;
                        for (var i in data.data) {
                            $sub_class_item = $sub_class_list.find(".sub_class_item[data_id='" + i + "']");
                            if ($sub_class_item.length) {
                                data.data[i]["name"] = $.trim($sub_class_item.find(".sub_class_name").val());
                                data.data[i]["big_pic"] = $sub_class_item.find(".big_img").attr("src");
                                data.data[i]["classify_url"] = $.trim($sub_class_item.find(".sub_class_url").val());
                            }
                        }
                        $nav_item.find(".sub_class_list").empty().append(sub_class_item.render(data));
                    }
                });
            }
            thisBox.show();
            return false;
        });
        //单独删除2级菜单
        $page.on("click", ".remove_sub_class_item", function () {
            var $this = $(this);
            $this.closest(".sub_class_item").remove();
            return false;
        });
    };
    init();
});