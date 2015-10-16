define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        lib = require('lib');
    var init = function () {

        bind();
    };
    var bind = function () {
        var $page = $("#page"), $table_list = $page.find(".table_list tbody");
        $page.on("click", ".audit_btn", function () {
            var $this = $(this), $tr = $this.closest("tr");
            lib.verificationLogin(function () {
                $.ajax({
                    url: domains.api+"/productsale/audit",
                    type: "get",
                    dataType: "jsonp",
                    data: {
                        id: $tr.attr("data_id"),
                        flag: $this.attr("data_key")
                    },
                    success: function (data) {
                        if (data.success) {
                            $tr.remove();
                            if (!$table_list.find("tr").length) {
                                $table_list.append('<tr><td colspan="6"><a href="#" class="ui_btn ui_btn_h28yellow2 reload"><span class="ui_btn_txt">获取数据</span></a></td></tr>');
                            }
                        }
                    },
                    error: function () {

                    }
                });
            });
           
            return false;
        });
        $page.on("click", ".reload", function () {
            window.location.reload();
            return false;
        });
    };
    init();
});
