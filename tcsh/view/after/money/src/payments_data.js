define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        page = require('wmpage');
    var _global_setting = {};
    _global_setting.current = {};
    _global_setting.current.page = {};
    
    var init = function () {
        if (_global_setting.current.page.totalcount) {
            var _page = page.Create({
                url: (_global_setting.current.page.url || domains.order+"/orders/myorders"),
                index: (_global_setting.current.page.pageindex) || 1,
                size: (_global_setting.current.page.pagesize) || 10,
                sum: (_global_setting.current.page.totalcount) || 0,
                pagekey: _global_setting.current.page.pagekey || "pageindex",
                front: true
            });
        }
        bind();
    };
    var bind = function () { };
    init();
});
