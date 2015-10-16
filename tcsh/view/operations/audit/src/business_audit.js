define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        brand_box = require('brand_box'),
        lib = require('lib');
   
    var init = function () {

        bind();
    };
    var bind = function () {
        var $page = $("#page");

        $page.on("click", ".set_brand", function () {
            var $this = $(this), _brand_box = $this.data("brand_box");
            if (!_brand_box) {
                _brand_box = brand_box.Create(function (data) {
                    alert("id = " + data.id);
                });
            }
            _brand_box.show();
            return false;
        });
    };
    init();
});
