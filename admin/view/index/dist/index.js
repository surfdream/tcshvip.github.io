define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        page = require('wmpage');
    var init = function () {
        var $search_form = $(".search_form");
        var _page = page.Create({
            url: domains.z+"/brand/list" + "?" + $search_form.serialize(),
            index: (adminConfig.pageindex) || 1,
            size: (adminConfig.pagesize) || 10,
            sum: (adminConfig.totalcount) || 0,
            pagekey: adminConfig.pageKey,
            front: true
        });
        bind();
    };
    var bind = function () { };
    init();
});