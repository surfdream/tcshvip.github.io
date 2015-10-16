define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        juicer = require('http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js');
    var shareOpenUrl = {
        "tx": function (title, url, pic) {
            return "http://share.v.t.qq.com/index.php?c=share&a=index&site=www.tcsh.me&assname=wumei2013&" + $.param({
                title: title,
                url: encodeURIComponent(url),
                pic: pic
            });
        },
        "sina": function (title, url, pic) {
            return "http://service.weibo.com/share/share.php?content=utf8&" + $.param({
                sourceUrl: encodeURIComponent(domains.www),
                source: encodeURIComponent("同城生活"),
                title: encodeURIComponent(title),
                url: encodeURIComponent(url),
                pic: pic
            });
        },
        "renren": function (url) {
            return "http://share.renren.com/share/buttonshare.do?" + $.param({
                link: encodeURIComponent(url)
            });
        },
        "qzone": function (title, url, pic) {
            return "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + $.param({
                summary: encodeURIComponent(title),
                title: title,
                url: encodeURIComponent(url),
                site: encodeURIComponent("同城生活"),
                pics: pic
            });
        }
    }
    var _init = function (ele) {
        var $ele = $(ele);
        $ele.each(function () {
            var $this = $(this);
            var type = $this.attr("data_type"),
                title = $this.attr("data_title"),
                pic = $this.attr("data_pic"),
                url = $this.attr("data_url") || window.location.href;
            $this.attr("href", shareOpenUrl[type](title, url, pic));
        });
    }
    exports.init = function (ele) {
        _init(ele);
    }
});
