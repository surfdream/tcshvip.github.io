define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        verification = require("verification");
    require('core-css');
    require('theme-css');
    require('datepicker-css');
    require('jquery.ui.core')($);
    require('jquery.ui.widget')($);
    require('jquery.ui.datepicker')($);
    require('datepicker-zh-CN')($);
    var init = function () {
        var $page = $("#page");
        verification.init($page);
        bind();
        $page.find(".time_type").change();
    };
    var bind = function () {
        var $page = $("#page");
        //var _longHtml = '<input type="text" class="form_txt w30" />%<a href="#" class="ui_btn ui_btn_h27gray8 save"><span class="ui_btn_txt">提交</span></a><span class="frequency"><input type="text" class="form_txt w30 " />次</span>',
        //    _shortHtml = '';
        $page.find(".date_txt").datepicker({
            onClose: function (data, e) { if (!(/\d{4}-\d{2}-\d{2}/.test(data))) { e.input.val(''); } }
        });
        $page.find(".time_type").on("change", function () {
            var $this = $(this), $option = $this.find(":selected"), $parend = $this.closest(".form_row");
            $parend.find(".time_type_item").css({
                display: "none"
            });
            verification.hideTips($this.closest(".form_row"));
            $parend.find("." + $option.attr("changekey")).css({
                display: "block"
            });
        });
        $page.on("click", ".save", function () {
            var $this = $(this), $form = $this.closest("form");
            return verification.verify($this.closest(".form_row"));
        });
    };
    init();
});
