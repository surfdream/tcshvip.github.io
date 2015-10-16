define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        areaBox = require('area_box');


    var init = function () {
        bind();
    };
    var bind = function () {
        var $page = $("#page"), _areaBox;
        $page.on("click", ".set_city_btn", function () {
            if (!_areaBox) {
                _areaBox = new areaBox();
            }
            _areaBox.show();
            return false;
        });
    };
    init();
});
