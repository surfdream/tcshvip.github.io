define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        upload = require("wmupload");
    var init = function () {
        var $channel_form = $(".channel_form ");
        window.document.domain = "tcsh.me";
        $channel_form.find("ul:eq(0)").prepend('<li class="btns fixed_box" style="left:' + ($channel_form.offset().left + $channel_form.outerWidth()) + 'px"><a href="#" class="add" title="添加广告位">+</a></li>')
        $channel_form.find(".upimg:not([src=''])").css({
            "display": "block"
        });
        bind();
        $channel_form.find(".aswh").change();
    };
    var bind = function () {
        var $page = $("#page"), $channel_form_main = $page.find(".channel_form_main");
        var location_item_html = [
            '<li class="form_row location_item">',
                '<label class="row_key"><b>广告位</b></label>',
                '<ul>',
                    '<li class="form_row">',
                        '<label class="row_key ">广告位位置：</label><a href="#" class="ui_btn ui_btn_h27gray8 go_locate" target="_blank"><span class="ui_btn_txt">定位</span></a><span></span></li>',
                    '<li class="form_row">',
                        '<label class="row_key">广告类型：</label>',
                        '<select class="form_sel as_type">',
                            '<option value="1" selected="selected">商品</option>',
                            '<option value="2">店铺</option>',
                            '<option value="3">活动</option>',
                        '</select>',
                    '</li>',
                    '<li class="form_row">',
                        '<label class="row_key">是否限制类别：</label>',
                        '<select class="form_sel is_limit">',
                            '<option value="1">是</option>',
                            '<option value="0" selected="selected">否</option>',
                        '</select>',
                    '</li>',
                    '<li class="form_row">',
                        '<label class="row_key ">广告位名称：</label><input type="text" class="form_txt w550 as_name" /></li>',
                    '<li class="form_row">',
                        '<label class="row_key ">广告展示类型描述：</label>',
                        '<input type="text" class="form_txt as_remark" />',
                    '</li>',
                    '<li class="form_row">',
                        '<label class="row_key ">广告尺寸：</label>',
                        '<input type="text" class="form_txt aswh" /><span>格式：width*height</span>',
                    '</li>',
                    '<li class="form_row">',
                        '<label class="row_key ">配图：</label>',
                        '<input type="file" class="with_map" />',
                        '<img class="upimg" />',
                    '</li>',
                '</ul>',
            '</li>'
        ];
        $page.on("click", ".go_locate", function () {
            var $this = $(this), _lk = "lk_" + parseInt(Math.random() * 9999999) + 1000;
            $this.attr("locate_key", _lk);
            var _locate_url = $.trim($(".locate_url").val());
            if (!_locate_url) {
                alert("目标地址，不能为空！");
                return false;
            }
            $this.attr("href", _locate_url + "?" + $.param({
                "is_as_locate": "t",
                "lk": _lk
            }));
        });
        //管理员页面，没有做兼容，change有些浏览器是不冒泡的
        $page.on("change", ".with_map", function () {
            upload.upload($(this), function (data) {
                var $this = this;
                $this.closest(".form_row").find("img").attr("src", data.response.imgurl).css("display", "block");
            });
        });
        $page.on("change", ".aswh", function () {
            var $this = $(this),
                _v = $.trim($this.val()).split('*'),
                $img = $this.closest(".location_item").find(".upimg");
            $img.css({
                width: _v[0],
                height: _v[1]
            });
        });
        $page.on("click", ".add", function () {
            $channel_form_main.append(location_item_html.join(''));
            return false;
        });
        $page.on("click", ".save", function () {
            var postData = {}, _locateKeyArr = [], _imgArr = [];
            postData.adchannelid = lib.queryString("id");
            postData.channelName = encodeURIComponent($channel_form_main.find(".channel_name").val());
            postData.channelURL = $channel_form_main.find(".locate_url").val();
            postData.asList = [];
            $channel_form_main.find(".location_item").each(function () {
                var $this = $(this), _key = $this.attr("data_pagekey"), $upimg;
                if (_key) {
                    $upimg = $this.find(".upimg")
                    _locateKeyArr.push(_key);
                    _imgArr.push($upimg.attr("src"));
                    postData.asList.push({
                        id: $this.attr("data_id"),
                        adChannelId: $this.attr("data_id"),
                        adLocation: _key,
                        adType: $this.find(".as_type").val(),
                        adLimit: $this.find(".is_limit").val(),
                        adLocationName: encodeURIComponent($this.find(".as_name").val()),
                        describe: encodeURIComponent($this.find(".as_remark").val()),
                        adSize: encodeURIComponent($this.find(".aswh").val()),
                        figure: $upimg.attr("src")
                    });
                }
            });
            postData.data = _locateKeyArr.join(',') + "|" + encodeURIComponent(_imgArr.join(','));
            postData.asList = JSON.stringify(postData.asList);
            $.ajax({
                url: domains.x + "/adlocation/api/channel",
                type: "post",
                dataType: "json",
                data: postData,
                success: function (data) {
                    if (data.success) {
                        alert("设置成功！");
                        window.location.reload();
                    } else {
                        data.error && alert(data.error);
                    }
                },
                error: function () {
                    alert("设置异常！");
                }
            });
            return false;
        });
        $page.find(".locate_url").on("change", function () {
            var $this = $(this), _v = $this.val();
            //正则比较水，所以用了这种方式...
            if (_v[_v.length - 1] === "/") {
                $this.val(_v.substr(0, _v.length - 1));
                $this.change();
            }
        });
        window.dw = function (key, lk) {
            var $this = $page.find(".go_locate[locate_key='" + lk + "']");
            $this.next("span").empty().append("页面标记：" + key);
            $this.closest(".location_item").attr("data_pagekey", key);
        };
    };
    init();
});