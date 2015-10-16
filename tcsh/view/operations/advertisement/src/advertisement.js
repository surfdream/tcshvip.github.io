define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        upload = require("wmupload"),
        verification = require("verification");
    var setImgWH = function ($box, wh) {
        var $page = $("#page");
        var _wh = wh.split('*');
        $box.find(".default_img").css({
            width: _wh[0],
            height: _wh[1]
        });
    };
    var init = function () {
        var $page = $("#page");
        verification.addRule([
            {
                key: "dataComplete",
                fun: function () {
                    var _adNmae = this.find(".ad").val(),
                        _adURL = this.find(".ad_url").val(),
                        _adImg = this.find(".default_img").attr("src");
                    return !!(_adNmae && _adURL && _adImg);
                }
            }
        ]);
        $page.find(".sub_ad_item").each(function () {
            var $this = $(this);
            setImgWH($this, global_setting.urlList[global_setting.url].data[$this.find(".go_precision").attr("attr_locate_key")].adWH);
        });
        bind();
        $page.find(".min_length").each(function () {
            var $this = $(this), $box = $this.closest(".sub_ad_item"), _v = $this.val() - 0, _gap = _v - $box.find(".sub_location_item").length;
            if (_gap) {
                $box.append('<span class="iconfont" style="position: absolute;top: 10px;right: 10px;color: #b30004;font-size: 30px;cursor: pointer;" title="默认设置不全">&#xf0142;</span>');
                $this.change();
            }

        });
    };
    var bind = function () {
        var $page = $("#page"), $min_length = $page.find(".min_length");
        $page.on("click", ".go_precision", function () {
            var $this = $(this), _locate_key = $this.attr("attr_locate_key");
            $this.attr("href", global_setting.url + "?" + $.param({
                locateKey: _locate_key,
                asRemarkImg: global_setting.urlList[global_setting.url].data[_locate_key].asRemarkImg
            }));
        });
        $page.on("click", ".show_all", function () {
            $page.find(".sub_location_item").addClass("sub_location_item_hover");
            return false;
        });
        $min_length.on("focus", function () {
            var $this = $(this);
            $this.attr("old_val", $this.val());
        });
        $min_length.on("change", function () {
            var $this = $(this),
                $parent = $this.closest('.sub_ad_item'),
                $sub_location_list = $parent.find(".sub_location_list"),
                _v = $this.val(),
                _arr,
                i = _v - 0 - $parent.find(".sub_location_item:visible").length,
                old_val,
                $firstHidden;
            if (i >= 0) {
                _arr = [];
                while (i--) {
                    $firstHidden = $parent.find(".display_none:first");
                    if ($firstHidden.length) {
                        $firstHidden.removeClass("display_none").css({
                            display: "block"
                        })
                    } else {
                        _arr.push('<li class="sub_location_item sub_location_item_hover" wmv="dataComplete" wmvmsg="广告位默认数据不完整！"><ul><li class="form_row"><label class="row_key">广告词：</label><input type="text" class="form_txt ad" /></li><li class="form_row hide"><label class="row_key">URL：</label><input type="text" class="form_txt ad_url" /></li><li class="form_row hide"><label class="row_key">图片：</label><div class="floatleft"><input type="file" class="up_img" /><img class="default_img" src="" /></div></li></ul></li>');
                    }
                }
                _arr.push('<li class="btns"><a href="#" class="show_all">全部展示</a></li>');
                $sub_location_list.append(_arr.join(''));
            } else {
                i = Math.abs(i);
                while (i--) {
                    $parent.find(".sub_location_item:not(.display_none):last:visible").addClass("display_none").css({
                        display: "none"
                    });
                }
            }
            setImgWH($parent, global_setting.urlList[global_setting.url].data[$parent.attr("data_locate_key")].adWH);
        });
        $page.on("change", ".up_img", function () {
            upload.upload($(this), function (data) {
                this.closest(".form_row").find(".default_img").attr("src", data.response.imgurl);
            });
        });
        $page.on("click", ".del_sub_location_item", function () {
            var $this = $(this);
            $this.closest(".sub_location_item").slideUp(function () {
                $max_length.val($max_length.val() - 0 - 1);
                $(this).remove();
            });
            return false;
        });
        $page.on("click", ":submit", function () {
            var $this = $(this), $form = $this.closest(".sub_ad_item"), postData = {};
            if (!verification.verify($form)) {
                return false;
            }
            postData.id = global_setting.urlList[global_setting.url].data[$form.attr("data_locate_key")].id;
            postData.asName = encodeURIComponent($form.find(".as_name").val());
            postData.asRemark = encodeURIComponent($form.find(".as_remark").val());
            postData.min_length = $form.find(".min_length").val();
            postData.max_length = $form.find(".max_length").val();
            postData.min_date_length = $form.find(".min_date_length").val();
            postData.max_date_length = $form.find(".max_date_length").val();
            postData.unitMoney = $form.find(".unitMoney").val();
            postData.defaultList = [];
            $form.find(".sub_location_item:visible").each(function () {
                var $this = $(this);
                postData.defaultList.push({
                    id: $this.attr("data_id"),
                    adTitle: $this.find(".ad").val(),
                    adUrl: $this.find(".ad_url").val(),
                    adPic: $this.find(".default_img").attr("src")
                });
            });
            postData.removeIds = [];
            $form.find(".sub_location_item:hidden").each(function () {
                var _id = $(this).attr("data_id");
                if (_id) {
                    postData.removeIds.push(_id);
                }
            });
            postData.removeIds = postData.removeIds.join(',');
            postData.defaultList = JSON.stringify(postData.defaultList);
            $.ajax({
                url: domains.api2 + "/adlocation/api/location.json",
                type: "get",
                dataType: "jsonp",
                data: postData,
                success: function (data) {
                    if (data.success) {
                        alert("保存成功！");
                        window.location.href = window.location.href;
                    } else {
                        data.error && alert(data.error);
                    }
                },
                error: function () {
                    alert("系统繁忙！");
                }
            });
            return false;
        });
        $page.find(".update").toggle(function () {
            var $this = $(this);
            $this.attr("title", "隐藏信息").empty().append("&#xf00ea;");
            $this.closest(".sub_ad_item").css({
                height: "initial"
            });
            verification.hideTips();
            return false;
        }, function () {
            var $this = $(this);
            $this.attr("title", "查看完整信息").empty().append("&#xf00e9;");
            $this.closest(".sub_ad_item").css({
                height: "40px"
            });
            verification.hideTips();
            return false;
        });
    };
    init();
});