/*
抓取淘宝数据
 */
define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge";
    var $ = require('http://s.tcsh.me/out_lib/dist/sea_jquery.js');
    var printData = function () {
        var printArr = [];
        var $page = $("#J_module-property");
        $page.find(".J_spu-property").each(function () {
            var $this = $(this), $main, _item = [], _x = true;
            printArr.push("<p>chinaName：" + $this.find(".label-title").html().replace(/\：/g, "") + "</p>");
            $main = $this.find('[data-transtype="dropbox"]');
            if ($main.length) {
                _x = false;
                printArr.push("<p>type：下拉框</p>");
                $main.find("option").each(function () {
                    if ($.trim($(this).html())) {
                        _item.push($.trim($(this).html()));
                    }

                });
                printArr.push('<p>选项：' + _item.join('，') + '</p>');
            }
            $main = $this.find('.checkbox');
            if ($main.length) {
                _x = false;
                printArr.push("<p>type：复选框</p>");
                $main.each(function () {
                    var $this = $(this);
                    if ($.trim($this.closest("li").find("label").html())) {
                        _item.push($.trim($this.closest("li").find("label").html()));
                    }
                });
                printArr.push("<p>选项：",_item.join('，')+"</p>");
            }
            if (_x) {
                printArr.push("type：文本框");
            }
        });
        $page.empty().append(printArr.join(''));
    };
    exports.init = function () {
        $(function () {
            printData();
        });
    };
});