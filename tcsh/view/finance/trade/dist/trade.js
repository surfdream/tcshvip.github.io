define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
		verification = require("wmverification"),
		page = require("wmpage")
    ;
    require('core-css');
    require('theme-css');
    require('datepicker-css');
    require('jquery.ui.core')($);
    require('jquery.ui.widget')($);
    require('jquery.ui.datepicker')($);
    require('datepicker-zh-CN')($);


    var init = function () {
        if (global_setting && global_setting.current && global_setting.current.page) {
            var _page = page.Create({
                url: global_setting.current.page.url || domains.member+"/collect/markets",
                index: (global_setting.current.page.pageindex) || 1,
                size: (global_setting.current.page.pagesize) || 10,
                sum: (global_setting.current.page.totalcount) || 0,
                pagekey: "pageindex",
                front: true
            });
        }
        bind();
    };
    var bind = function () {
        var $fina_login_form = $(".fina_login_form"),
			$page = $("#page")
        ;


        var statId = function () {
            var _arr = [],
				$cash_hid = $("#cash_hid")
            ;
            $page.find(".chk_item").each(function () {
                var $this = $(this),
					$tr = $this.closest("tr")
                ;
                if ($this.attr("checked")) {
                    _arr.push($tr.attr("data_id"));
                }
            });
            $cash_hid.val(_arr.join(','));
        }
        function chkall() {
            var $cash_table = $page.find(".cash_table"),
				$cash_chk = $cash_table.find(".cash_chk"),
				_array = new Array()
            ;
            $cash_chk.on("click", function () {
                var $this = $(this),
					_chklength = $cash_table.find(".chk_item"),
					_checked = $this.attr("checked")
                ;
                if (_checked) {
                    _chklength.attr("checked", "checked");
                }
                else {
                    _chklength.removeAttr("checked");
                }
                statId();
            });
            $cash_table.on("click", ".chk_item", function () {
                var _allchknum = $cash_table.find(".chk_item").length,
					_chknum = $cash_table.find(".chk_item:checked").length
                ;
                if (_chknum !== _allchknum) {
                    $cash_chk.removeAttr("checked");
                }
                else {
                    $cash_chk.attr("checked", "checked");
                }
                statId();
            });

        }
        chkall();

        $page.find(".data_txt").datepicker({
            onClose: function (data, e) { if (!(/\d{4}-\d{2}-\d{2}/.test(data))) { e.input.val(''); } }
        });
    };
    init();
})