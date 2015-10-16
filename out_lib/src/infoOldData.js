/*
抓取淘宝数据
 */
define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge";
    var $ = require('http://s.tcsh.me/out_lib/dist/sea_jquery.js');
    exports.init = function () {
        $(function () {
            var _setInterval = setInterval(function () {
                var _data = list.shift(), _info;
                if (_data&&_data.Id) {
                    _info = $('<div>' + _data.Info + '</div>');
                    _info.find("img").each(function () {
                        var $this = $(this);
                        $this.attr("lazyload_url", $this.attr("src"));
                        $this.attr("src", "http://s.tcsh.me/tcsh/view/public/img/pit.png");
                        $this.addClass("lazyload");
                    });
                    _info = _info.html();
                    $.ajax({
                        url: "http://l.tcsh.me/api/init/setProdct",
                        data: {
                            Id: _data.Id,
                            Info: _info
                        },
                        type: "post"
                    });
                } else {
                    clearInterval(_setInterval);
                    alert("处理完毕！");
                    console.log(list);
                }
            }, 30);
            $("body").append('<a href="#" id="end">end</a>');
            $("#end").click(function () {
                clearInterval(_setInterval);
                return false;
            });
           
        });
    };
});