define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
        area = require("wmarea"),
        verification = require("wmverification");
    var init = function () {
        verification.strikingError = false;
        verification.strikingSuccess = false;
        area();
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        $page.on("click", "#submit", function () {
            var $form = $(this).closest("form"),
                $selProvince, $selCity, $selDistricts,
                _remark
            ;
            $selProvince = $form.find("#selProvince_rent");
            $selCity = $form.find("#selCity_rent");
            $selDistricts = $form.find("#selDistricts_rent");
            _remark = $.trim(($selProvince.find(":selected").html() + " " + $selCity.find(":selected").html() + " " + $selDistricts.find(":selected").html()).replace(/请选择/g, ""));
            if (!verification.verify($form) || !_remark) {
                alert("请完整填写收货地址！");
                return false
            }
            
            $form.find(".remark").val(_remark);
            return true
        });

    };
    init();
});
