define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        upload = require('wmupload'),
        verification = require('verification'),
        wm8gua = require('wm8gua'),
        wmarea = require('wmarea');
    require('core-css');
    require('theme-css');
    require('datepicker-css');
    require('jquery.ui.core')($);
    require('jquery.ui.widget')($);
    require('jquery.ui.datepicker')($);
    require('datepicker-zh-CN')($);
    var init8gua = function (v) {
        var $page = $("#page"),
            $birthday = $page.find(".birthday"),
            $constellation = $page.find(".constellation"),
            $zodiac = $page.find(".zodiac"),
            $constellation_data = $page.find(".constellation_data"),
            $constellation_data_list,
            _data1,
            _data2;
        v = $.trim(v);
        $birthday.val(v);
        if (v) {
            v = v.split('-');
            _data1 = wm8gua.getConstellation(v[1], v[2]);
            _data2 = wm8gua.getZodiac(v[0]);
            $constellation.empty().append('星座：<b class="iconfont">' + _data1.ico + '</b><b>' + _data1.name + '</b>')
            $zodiac.empty().append('<span class="zodiac">生肖：<b class="iconfont">' + _data2.ico + '</b><b>' + _data2.name + '</b></span>');
            $constellation_data.empty().append('<div class="constellation_data_title"><b class="iconfont">' + _data1.ico + '</b>星座运势</div><ul class="constellation_data_list" style="display:none"></ul>');
            $constellation_data_list = $constellation_data.find(".constellation_data_list");
            wm8gua.getConstellation8gua("day", _data1.id, function (arr) {
                var _arr = [], i = 6;
                if (arr) {
                    _arr.push('<li class="form_row"><label class="row_key">健康指数：</label><span class="pipes_bg"><span class="pipes_water" style="width:' + arr[4].value + '"></span></span><b class="value">' + arr[4].value + '</b></li>');
                    _arr.push('<li class="form_row"><label class="row_key">商谈指数：</label><span class="pipes_bg"><span class="pipes_water" style="width:' + arr[5].value + '"></span></span><b class="value">' + arr[5].value + '</b></li>');
                    for (; i < 8; i++) {
                        _arr.push('<li class="form_row notrow"><label class="row_key">' + arr[i].title + '：</label>' + arr[i].value + '</li>');
                    }
                    _arr.push('<li class="form_row"><label class="row_key">速配星座：</label>' + arr[i].value + '</li>');
                }
                wm8gua.getConstellation8gua("week", _data1.id, function (arr) {
                    if (arr) {
                        _arr.push('<li class="form_row"><label class="row_key">整体运势：</label><p class="remark floatleft w200">' + arr[0].value + '</p></li>');
                        _arr.push('<li class="form_row"><label class="row_key">性欲指数：</label><p class="remark floatleft w200">' + arr[4].value + '</p></li>');
                        _arr.push('<li class="form_row"><label class="row_key"><i class="wm_ico bulb1"></i>小提示：</label><p class="remark floatleft w200">' + arr[7].value + '</p></li>');
                    }
                    $constellation_data_list.empty().append(_arr.join(''));
                    $constellation_data_list.fadeIn();
                });
            });
        } else {
            $constellation_data.empty().append('<div class="constellation_data_title"><b class="iconfont"></b>星座运势</div>');
        }
    };
    var init = function () {
        var $page = $("#page");
        window.document.domain = "tcsh.me";
        var hometownArea,
            currResidenceArea,
            $perfect_box = $page.find(".perfect_box"),
            _hometownAreav = global_setting.hometownarea || "",
            _currResidenceAreav = global_setting.currresidencearea || "",
            _perfect = (global_setting.perfect || 0) + "%"
        ;
        hometownArea = new wmarea({
            parent: ".hometownarea",
            provincesEle: ".selProvince_rent",
            cityEle: ".selCity_rent",
            districtsEle: ".selDistricts_rent"
        });
        currResidenceArea = new wmarea({
            parent: ".currresidencearea",
            provincesEle: ".selProvince_rent",
            cityEle: ".selCity_rent",
            districtsEle: ".selDistricts_rent"
        });
        $page.find(".hometownarea .selProvince_rent").val(_hometownAreav.substring(0, 2) + "0000").change();
        $page.find(".hometownarea .selCity_rent").val(_hometownAreav.substring(0, 4) + "00").change();
        $page.find(".hometownarea .selDistricts_rent").val(_hometownAreav);

        $page.find(".currresidencearea .selProvince_rent").val(_currResidenceAreav.substring(0, 2) + "0000").change();
        $page.find(".currresidencearea .selCity_rent").val(_currResidenceAreav.substring(0, 4) + "00").change();
        $page.find(".currresidencearea .selDistricts_rent").val(_currResidenceAreav);
        verification.init();
        bind();
        $perfect_box.find(".perfect").empty().append(_perfect);
        $perfect_box.find(".pipes_water").animate({
            width: _perfect
        }, 1000);
        init8gua($page.find(".birthday").val());
        if (global_setting.gender) {
            $(".sex[value='" + global_setting.gender + "']").attr("checked", "checked");
        } else {
            $(".sex:last").attr("checked", "checked");
        }
    };
    var bind = function () {
        var $page = $("#page"),
            $birthday = $page.find(".birthday"),
            $constellation = $page.find(".constellation"),
            $zodiac = $page.find(".zodiac")
        ;
        $birthday.datepicker({
            onClose: function (data, e) {
                var _data;
                if (!(/\d{4}-\d{2}-\d{2}/.test(data))) {
                    e.input.val('');
                } else {
                    init8gua(data);
                }
            },
            changeYear: true,
            changeMonth: true,
            maxDate: new Date(),
            yearRange: "1790:" + new Date().getFullYear()
        });
        $page.find(".form_file").on("change", function () {
            var $this = $(this);
            upload.upload($this, function (data) {
                if (data.response) {
                    var $up_user_img = this.closest(".user_picture");
                    $up_user_img.find("img").attr("src", data.response.imgurl);
                    $page.find("#user_name_img").val(data.response.imgurl);
                }
            });
        });
        $page.on("click", ":submit", function () {
            var postData = {},
                $this = $(this),
                $form = $this.closest("form");
            if (verification.verify($form)) {
                postData.user_img = $form.find(".user_picture img").attr("src");
                postData.nickname = $form.find(".nickname").val();
                postData.name = $form.find(".name").val();
                postData.sex = $form.find(".sex:checked").val();
                postData.english_name = $form.find(".english_name").val();
                postData.birthday = $form.find(".birthday").val();
                postData.born_location = $page.find(".hometownarea .selDistricts_rent").val();
                postData.live_location = $page.find(".currresidencearea .selDistricts_rent").val();
                console.log(postData);
                $.ajax({
                    url: domains.profile + "/user/updatebase",
                    data: postData,
                    dataType: "json",
                    type: "post",
                    success: function (data) {
                        if (data.success) {
                            window.location.reload();
                        } else {
                            alert(data.error || "服务器繁忙，请稍后再试！");
                        }
                    }
                });
            }
            return false;
        });
    };
    init();
});
