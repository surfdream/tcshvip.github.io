define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        upload = require('wmupload'),//上传模块
        juicer = require("juicer");
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
                '<label class="row_key">ICO：</label>',
                '<div class="floatleft"><img src="${icon}" class="ico_img" width="20" height="20" style="float:left"><a href="#" class="iconfont edit_ico">&#xf0022;</a><input type="file" class="form_file up_ico" /></div>',
            '</li>',
            '<li class="form_row">',
                '<label class="row_key">昵称：</label>',
                '<input type="text" class="form_txt w150 nickname" value="${nickname}" />',
            '</li>',
            '<li class="form_row">',
                '<label class="row_key">优先级：</label>',
                '<input type="text" class="form_txt txt_index w30" value="${sort}"><b class="emphasis">0，表示不展示该大类</b>',
            '</li>',
            '<li class="form_row">',
                '<label class="row_key">上移背景色：</label>',
                '<input type="text" class="form_txt hover_color w80" value="${bgcolor}">',
                '<span class="bg_color" style="background: ${bgcolor}"></span>',
            '</li>',
            '<li class="form_row">',
                '<label class="row_key">子目录：</label><a herf="#" class="showhide">收起</a>',
                '<p class="emphasis">列：目前只支持1和2</p>',
                '<p class="emphasis">顺序：表示在该列中的先后顺序</p>',
                '<p class="emphasis">列和顺序，<=0表示不显示该项</p>',
                '<ul class="floatleft sub_list list1">',
                    '{@each itemList as list}',
                    '<li>',
                        '<input type="text" class="form_txt w30 row_txt" value="${list.row}" placeholder="列"><input type="text" class="form_txt w30 sort_txt" value="${list.sort}" placeholder="顺序"><input type="text" class="form_txt w100 edit_txt" value="${list.nickname}" data_id="${list.id}" />',
                        '<ul class="floatleft sub_list" parent_id="${list.id}">',
                            '{@each list.itemList as sublist}',
                            '<li>',
                                '<input type="checkbox" class="form_chk" value="${sublist.id}" {@if sublist.sort>0}checked="checked"{@/if}><input type="text" class="form_txt w100 edit_txt" value="${sublist.nickname}" />',
                            '</li>',
                            '{@/each}',
                        '</ul>',
                    '</li>',
                    '{@/each}',
                '</ul>',
            '</li>',
        '</ul>'
    ].join(''));
    var initData = function (callback) {
        $.ajax({
            url: domains.api+"/category/nav",
            type: "get",
            dataType: "jsonp",
            success: function (data) {
                gData = data;
                typeof callback === "function" && callback();
            }, error: function () {
                alert("getSubordinateList  Error !");
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
    var init = function () {
        var $set_nav = $(".set_nav");
        document.domain="wumeiwang.com"
        initData(function () {
            initClassList();
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
            postData.key = $page.find(".class_list").val() - 0;
            if (!postData.key) {
                alert("请选择大类");
                return false;
            }
            postData.nickname = $page.find(".nickname").val();
            postData.index = $page.find(".txt_index").val();
            postData.hover_color = $page.find(".hover_color").val();
            postData.itemlist = {};
            postData.icon = $page.find(".ico_img").attr("src");
            $page.find(".row_txt").each(function () {
                var $this = $(this),
                    _v = $this.val() - 0,
                    $li,
                    $edit_txt,
                    $sort_txt, _id;
                if (_v) {
                    $li = $this.closest("li");
                    $sort_txt = $li.find(".sort_txt");
                    $edit_txt = $li.find(".edit_txt");
                    _id = $edit_txt.attr("data_id");
                    postData.itemlist[_id] = {
                        id: _id,
                        nickname: $edit_txt.val(),
                        row: _v,
                        sort: $sort_txt.val(),
                        itemList: {}
                    }
                    $li.find(".form_chk:checked").each(function () {
                        var $this = $(this),
                            _v = $this.val() - 0,
                            $li = $this.closest("li"),
                            $edit_txt = $li.find(".edit_txt");
                        postData.itemlist[_id].itemList[_v] = {
                            id: _v,
                            nickname: $edit_txt.val()
                        };
                    });
                }
            });
            postData.itemlist = JSON.stringify(postData.itemlist);
            $.ajax({
                url: "http://operator.wumeiwang.com/api/category/nav",
                type: "post",
                dataType: "json",
                data: postData,
                success: function (data) {
                    alert(data.message);
                    window.location.reload();
                },
                error: function () {
                    alert("保存异常！");
                    window.location.reload();
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
        $page.on("change", ".up_ico", function () {
            var $this = $(this);
            upload.upload($this, function (data) {
                if (data.response) {
                    this.closest(".floatleft").find("img").attr("src", data.response.imgurl);
                }
            });
        });
    };
    init();
});
