define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		upload = require("wmupload"),
        tips = require("wmtips"),
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
	
	global_setting.seldata = {
		key1:[
			{
				"id":"1",
				"msg":"7天无理由退款"	
			},
			{
				"id":"2",
				"msg":"收到商品有质量问题"	
			},
			{
				"id":"3",
				"msg":"购买商品错发/漏发"	
			},
			{
				"id":"4",
				"msg":"收到商品与描述不符"	
			},
			{
				"id":"5",
				"msg":"收到假货"	
			}
		],
		key2:[
			{
				"id":"1",
				"msg":"退运费"	
			},
			{
				"id":"2",
				"msg":"收到商品有质量问题"	
			},
			{
				"id":"3",
				"msg":"购买商品错发/漏发"	
			},
			{
				"id":"4",
				"msg":"收到商品与描述不符"	
			},
			{
				"id":"5",
				"msg":"未收到货"	
			}
		]
	};
	var init = function(){
		var $page = $("#page"),
			$form = $page.find(".after_form"),
			$tar = $form.find(".tar")
			
		;
		
		verification.init($form);
		
		/* 自定义验证 */
		verification.addRule([
			{
				key:"radioEmpty",
				fun:function(){
					return this.find(".rad:checked").length===1;
				}		
			},{
				key:"selectEmpty",
				fun:function(){
					return this.val()!=0;
				}	
			}
		]);
		
		/*字数计算*/
		$tar.keydown(check);
		
		function check(){
			var con = $tar.val().length,
				i = 140
			;
			if(con>i){
				var maxnum = $tar.val().substr(0,i);
				$tar.val(maxnum);
				alert("字数超过限制！");
			}
		};
		
		/*分页*/
		if (global_setting && global_setting.page && global_setting.page.totalcount) {
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
			$form = $page.find(".after_form")
		;
		
		/* 退款原因切换 */
		$form.on("click",".rad",function(){
			var $this=$(this),
				_key=$this.attr("data_key"),
				_data=global_setting.seldata[_key],
				_arr=[],
				$slt=$form.find(".slt")
			;
			$slt.empty();
			if(_key=="key1"){
				$slt.append('<option value="0">选择退货退款原因</option>');
			}
			else{
				$slt.append('<option value="0">选择不退货退款原因</option>');
			}
			for(var i in _data){
				_arr.push('<option value="'+_data[i].id+'">'+_data[i].msg+'</option>');
			}
			$slt.append(_arr.join(''));
		});
		
		
		$form.on("click",".sub_btn",function(){
			if(verification.verify($form)){
				$.ajax({
					type:"get",
					dataType:"jsonp",
					success:function(){},
					error:function(){
						alert("提交申请成功！")	
					}	
				});	
			}
			
			return false;	
		});
		
		/* 上传图片 */
		$form.find(".img_upload").on("change",function(){
			var $this = $(this);
			upload.upload($this,function(data){
				var $certificate_con = this.closest(".certificate_con");
				
				if(data.response){
					$certificate_con.find("img").show().attr("src",data.response.imgurl).css("display","block");
					$certificate_con.find(".hid_input").val(data.response.imgurl);
				}
			});	
		});
		
		$page.find(".order_date").datepicker();
		
	};
	
	init();
	
})