define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        lib = require("lib"),
        verification = require('verification');
    var init = function () {
        var $form = $(".ubd_con");
        bind();
        $form.find(".form_row[data_competence_key]").each(function () {
            var $this = $(this), data_competence_key = $this.attr("data_competence_key");
            $this.find(".set_competence[data_competence_key='" + data_competence_key + "']").click();
        });
    };
    var bind = function () {
        $page = $("#page");
        $page.on("click", ".set_competence", function () {
            var $this = $(this),
                $btn_list = $this.closest(".btn_list");
            $btn_list.find(".portal .ui_btn_txt").empty().append($this.html() + '<span class="wm_ico arrow9down"></span>');
            $btn_list.find("ul").addClass("hide");
            $this.closest(".form_row").attr("data_competence_key", $this.attr("data_competence_key"));
            setTimeout(function () { $btn_list.find(".hide").removeClass("hide") }, 500);
            return false;
        });
        $page.on("click", ":submit", function () {
            var $form = $(this).closest(".ubd_con");
            var postData = {};
            if (verification.verify($form)) {
                $form.find(".form_txt").each(function () {
                    var $this = $(this), $row = $this.closest(".form_row");
                    postData[$this.attr("name")] = JSON.stringify({
                        val: $.trim($this.val()) || "",
                        auth: $row.attr("data_competence_key")
                    });
                });
                $.ajax({
                    url: domains.profile + "/user/updatesns",
                    type: "post",
                    data: postData,
                    dataType: "json",
                    success: function (data) {
                        if (data.success) {
                            window.location.reload();
                        }
                        else {
                            alert(data.error || "服务器繁忙，请稍后再试！");
                        }
                    }
                });
            }
            return false;
        });
    };
    init();
});
