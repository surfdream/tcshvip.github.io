define(function(require,exports,module){
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

	
	var init = function(){
		
		 if(global_setting&&global_setting.current&&global_setting.current.page){
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
	var bind = function(){
		var $page = $("#page"),
			$fina_form = $page.find(".fina_form"),
			$cash_infor = $fina_form.find(".cash_infor")
		;
		/* 调整提现数据  */
		$page.on("click",".btn1",function(){
			$fina_form.find(".cash_infor").addClass("changeCon");
			$fina_form.find(".cash_txt").removeAttr("disabled");
			return false;
		});
		$page.on("click",".btn2",function(){
			$fina_form.find(".cash_infor").removeClass("changeCon");
			$fina_form.find(".cash_txt").attr("disabled");
		});
		
		
		/* 日历插件  */
		$page.find(".cash_data").datepicker({
            onClose: function (data, e) { if (!(/\d{4}-\d{2}-\d{2}/.test(data))) { e.input.val(''); } }
        });
	};
	init();
})