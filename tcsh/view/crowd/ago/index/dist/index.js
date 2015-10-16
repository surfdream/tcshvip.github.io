define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		box = require("wmbox"),
		juicer = require("juicer"),
		tips = require("wmtips"),
		page = require("wmpage"),
		denounce = require("denounce"),
		comment = require("comment")
	;
	
	var init = function(){
		var $page = $("#page");
		
		// 分页
		if (global_setting && global_setting.totalcount) {
			var _page = page.Create({
				url: global_setting.pageURL,
				element: ".order_page",
				size: global_setting.pageSize,
				index: global_setting.pageIndex,
				sum: global_setting.totalcount,
				pagekey: global_setting.pageKey,
				front: true
			});
		};
		
		bind();	
	};
	
	var bind = function(){
		var $page = $("#page");
		
		// 评论
		$page.on("click",".comments",function(){
			var $this = $(this),
				$sdi_btns_sub = $this.closest(".sdi_btns_sub"),
				$sns_data_box = $this.closest(".sns_data_box")
			;
			if($sdi_btns_sub.hasClass("sdi_btns_sub_cur")){
				$sdi_btns_sub.removeClass("sdi_btns_sub_cur");
				$sns_data_box.find(".sdi_btns_subCon").removeClass("dis_none");
				if(!$sns_data_box.find(".comment_list").length && !$sns_data_box.find(".more_btns").length){
					comment.creatCommHtml({
						appendBox:$sns_data_box.find(".comment")
					});
					
				};
			}else{
				$sdi_btns_sub.addClass("sdi_btns_sub_cur");
				$this.closest(".sns_data_box").find(".sdi_btns_subCon").addClass("dis_none");		
			}
			return false;	
		});
		
		// 举报
		$page.on("click",".denounce",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = 	denounce.DenounceBox({
					callback:function(){
						var self = this,
							$sns_data_con = $this.closest(".sns_data_con"),
							name,
							title,
							article_con 
						;
						name = $sns_data_con.find(".user_name").html();
						title = $sns_data_con.find(".sns_data_title").text();
						
						this.Odenounce(name);
						this.article('<h3>'+title+'</h3>');
						$sns_data_con.find(".article_main p").each(function(){
							var _this = $(this),
								_txt = _this.text()
							;
							self.article('<p>'+_txt+'</p>');	
						});
						$sns_data_con.find("img").each(function(){
							var _this = $(this);
							self.article('<p>'+'[图片]'+'</p>')	
						});
					}	
				});
				
				$this.data("thisBox",_thisBox);	
			};
			_thisBox.show();
			
			return false;	
		});
			
	};
	
	init();
	
})