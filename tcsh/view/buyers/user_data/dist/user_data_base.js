define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        upload = require('wmupload'),
        verification = require('verification'),
        wmarea = require('wmarea');
    require('core-css');
    require('theme-css');
    require('datepicker-css');
    require('jquery.ui.core')($);
    require('jquery.ui.widget')($);
    require('jquery.ui.datepicker')($);
    require('datepicker-zh-CN')($);
    var init = function () {
        var $page = $("#page");
        window.document.domain = "tcsh.me";
        var hometownArea, currResidenceArea, _hometownAreav = $page.find("#BornLocation").val(), _currResidenceAreav = $page.find("#LiveLocation").val();
        hometownArea = new wmarea({
            parent: ".hometownarea",
            provincesEle: ".selProvince_rent",
            cityEle: ".selCity_rent",
            districtsEle: ".selDistricts_rent"
        });
        currResidenceArea = new wmarea({
            parent: ".currresidencearea",
            provincesEle: ".selProvince_rent",
            cityEle: ".selCity_rent",
            districtsEle: ".selDistricts_rent"
        });
        $page.find(".hometownarea .selProvince_rent").val(_hometownAreav.substring(0, 2) + "0000").change();
        $page.find(".hometownarea .selCity_rent").val(_hometownAreav.substring(0, 4) + "00").change();
        $page.find(".hometownarea .selDistricts_rent").val(_hometownAreav);

        $page.find(".currresidencearea .selProvince_rent").val(_currResidenceAreav.substring(0, 2) + "0000").change();
        $page.find(".currresidencearea .selCity_rent").val(_currResidenceAreav.substring(0, 4) + "00").change();
        $page.find(".currresidencearea .selDistricts_rent").val(_currResidenceAreav);
        verification.init();
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        $page.find(".birthday").datepicker({
            onClose: function (data, e) { if (!(/\d{4}-\d{2}-\d{2}/.test(data))) { e.input.val(''); } },
            changeYear: true,
            changeMonth: true,
            maxDate: new Date(),
            yearRange:"1790:"+new Date().getFullYear()
        });
        $page.find(".form_file").on("change", function () {
            var $this = $(this);
            upload.upload($this, function (data) {
                if (data.response) {
                    var $up_user_img = this.closest(".up_user_img");
                    $up_user_img.find(".user_picture img").attr("src", data.response.imgurl).css("display", "block");
                    $up_user_img.find("#user_name_img").val(data.response.imgurl);
                }
            });
        });
        $page.on("click", ":submit", function () {
            $page.find("#BornLocation").val($page.find(".hometownarea .selDistricts_rent").val());
            $page.find("#LiveLocation").val($page.find(".currresidencearea .selDistricts_rent").val());
            return verification.verify($(this).closest("form"));
        });
    };
    init();
});
