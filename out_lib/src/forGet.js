/*

 */
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var $ = require('http://s.tcsh.me/out_lib/dist/sea_jquery.js');
    exports.init = function () {
        $(function () {
            var postData = {};
            postData.str = [];
            var _setInterval= setInterval(function () {
                var i = 100;
                while (i--) {
                    postData.str.push(1);
                }
                $.ajax({
                    url: "http://commune.tcsh.me/test/length.json",
                    dataType:"jsonp",
                    data: {
                        str: postData.str.join()
                    },
                    success: function () {
                        console.log(postData.str.length + ":正常返回！");
                    },
                    error: function () {
                        console.log(postData.str.length + ":异常返回！");
                        clearInterval(_setInterval);
                    }
                });
            }, 20);
        });
    };
});
