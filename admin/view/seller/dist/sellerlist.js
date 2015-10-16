define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        page = require('wmpage');
    var init = function () {
        var $search_form = $(".search_form");
        var _page = page.Create({
            url: window.location.href + "?" + $search_form.serialize(),
            index: (adminConfig.pageIndex) || 1,
            size: (adminConfig.pageSize) || 10,
            sum: (adminConfig.pageSum) || 0,
            pagekey: "pageindex",
            front: true
        });
        bind();
    };
    var bind = function () { };
    init();
});