define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery');

    var init = function () {

        bind();
    };
    var bind = function () {
        var $page = $("#page");
        $page.on("click", ".show_sub", function () {
            var $this = $(this), $li = $this.closest("li"), _data_key = $this.attr("data_key");
            if ($li.hasClass(_data_key)) {
                $li.removeClass(_data_key);
            } else {
                $li.addClass(_data_key);
            }
            return false;
        });
        $page.find(".proportion").on("change", function () {
            var $this = $(this);
            $.ajax({
                url: domains.api+"/category/cash",
                type: "get",
                data: {
                    id: $this.attr("data_id"),
                    discount:$this.val()? (parseFloat($this.val()).toFixed(1) + ""):""
                },
                dataType: "jsonp",
                success: function (data) {
                    $this.val(data.success);
                },
                error: function () {
                    alert('修改失败！');
                }
            });
        });
    };
    init();
});
