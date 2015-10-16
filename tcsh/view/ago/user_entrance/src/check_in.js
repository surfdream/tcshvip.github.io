define(function (require, exports, module) {
		"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
		var $ = require("jquery"),
			box=require("wmbox"),
			verification = require('wmverification'),
			tips = require("wmtips")
		;
		var init=function(){
			var $check_in_form=$(".check_in_form"),
				$login_name=$("#login_name")
			;
			
			/*
			 * 验证提示信息
			 */	
			verification.init($check_in_form,function(){
				this.setTipSkin("white1").setDirection("tl").setOffSet({
					left:296,
					top:-5	
				});		
			})
			
			/*
			 *
			 *   密码不符规则
			 *
			 */
			 
			 if (global_setting && global_setting.current && global_setting.current.initmsg) {
				box.alert({
					boxCls: "errbox",
					content: "<p>" + global_setting.current.initmsg + "</p>"
				});
			}
			
			/*
			 *自定义key  two_domain_name
		     */
			verification.addRule([
				{
					key: "two_domain_name", fun: function () {
						return /^[A-Za-z0-9]+$/.test(this.val());
					}
				}
			]);
			
			
			/*
			 *  检测用户名
			 */
			$login_name.focus();
			$login_name.after('<span id="v_mask" style="display: none;background: #ccc; position: absolute;width: 307px;line-height: 40px;height: 38px;padding-left: 10px;top: 0px;left:90px;">正在检测用户名<i class="loading18_18_1 chrysanthemum" style="float: right;margin: 10px;"></i></span>');
			
			bind();
		};
		var bind=function(){
			var v_name = function (_v , callback){
				$.ajax({
				    url:domains.account+'/accountExists',
					data:{
						username:encodeURI(_v)	
					},
					type:'get',
					dataType:'json',
					success: function (data){
						typeof callback === "function" && callback(data);	
					}
				});
			};
			/*var v_code = function (_v , callback){
				$.ajax({
					url:domains.account+'/CheckAuthCode',
					data:{
						vcode:_v
					},	
					type:'get',
					dataType:'json',
					success: function (data){
						typeof callback === "function" && callback(data);	
					}
				});	
			};*/
			
			var $form=$(".check_in_form"),
				_invBox,
				$page=$("#page")
			;
			
			/*检测二级域名*/
			var vTwoDomain = function (callback) {
				if (!_invBox) {
					_invBox = box.invBox({
						content: '<p style="text-align: center;line-height: 70px;"><img src="http://s.tcsh.me/tcsh/view/public/img/loading/loading18_18_1.gif" style="vertical-align: middle;" /> 正在检测二级域名是否可用！</p>',
						btns: []
					});
				}
				_invBox.show();
				$.ajax({
				    url: domains.account+"/seller/keyExists",
					type: "get",
					timeout: 3000,
					data: {
						key: $form.find(".two_domain_name").val()
					},
					dataType: "jsonp",
					success: function (data) {
						if (!data.response) {
							_invBox.hide();
							typeof callback === "function" && callback();
						} else {
							_invBox.setCon('<p style="text-align: center;line-height: 70px;">' + (data.msg || "域名已存在！") + '</p>');
							setTimeout(function () {
								_invBox.hide();
							}, 3000)
						}
					},
					error: function () {
						var i = 5;
						_invBox.setCon('<p style="text-align: center;line-height: 70px;">服务器繁忙请稍后再试！' + i + '秒后刷新</p>');
						setInterval(function () {
							_invBox.setCon('<p style="text-align: center;line-height: 70px;">服务器繁忙请稍后再试！' + --i + '秒后刷新</p>');
							if (!i) {
								window.location.href = window.location.href;
							}
						}, 1000)
					}
           		});
        	};
			
			/**
			 *
			 *   失焦时检测用户名是否存在
			 *
			**/
			
			$form.on("blur" , "#login_name" , function (){
				var $this = $(this),
					v = $.trim($this.val()),
					v_name_tips,
					$v_mask = $page.find("#v_mask")
				;
				issubmit = false;
				if (verification.verify($this.closest("li"))){
					$this.attr("disabled","disabled");    //  原来的不可用
					$v_mask.css("display","block");       //  显示正在检测文字
					v_name(v , function (data){
						if(data.response){
							v_name_tips = $this.data("v_name_tips");
							if(!v_name_tips){
								v_name_tips = new tips({
									ele:$this,
									con:'用户名已存在',
									skin:'white1',
									direction:'tl',
									offset:{
										left:270,
										top:-5	
									}	
								});
								$this.data("v_name_tips", v_name_tips);	
							}	
							v_name_tips.show();
						}
						$this.removeAttr("disabled");
						$v_mask.css("display" , "none");	
					});
				}
			});	
			
			$form.on("focus", "#login_name", function () {
				var $this = $(this), 
					v_name_tips;
				v_name_tips = $this.data("v_name_tips");
				v_name_tips && v_name_tips.hide();
				
			});
			
			$form.on("click",":submit",function(){
				if ($form.find(".two_domain_name").length) {
					if (verification.verify($form)) {
						vTwoDomain(function () {
							$form.submit();
                    	});
                	}
                	return false;
           	 	}
				return verification.verify($form);
			});
		}
		init();
   
});
