define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		box = require("wmbox"),
		verification = require("wmverification"),
		upload = require("wmupload"),
		inputdown = require("wminputdown"),
		wmarea = require("wmarea"),
		bankbox = require("bankbox"),
		juicer = require("juicer")
	;
	require('core-css');
	require('theme-css');
	require('datepicker-css');
	require('jquery.ui.core')($);
	require('jquery.ui.widget')($);
	require('jquery.ui.datepicker')($);
	require('datepicker-zh-CN')($);
	
	var init = function(){
		var $page = $("#page");
		
		if (global_setting && global_setting.page && global_setting.page.totalcount) {
			var _page = page.Create({
			    url: domains.sell+'/order/list?' + $(".seleft_box .wm_form").serialize(),
				element: ".wm_page",
				size: global_setting.current.page.pagesize,
				index: global_setting.current.page.pageindex,
				sum: global_setting.current.page.totalcount,
				pagekey: global_setting.current.page.pagekey,
				front: true
			});
		};
		
		verification.addRule([
			{
				key:"img_empty",
				fun:function(){
					return !!this.find("img").attr("src").length;
					
				}	
			},
			{
				key:"bank_empty",
				fun:function(){
					return !!$.trim(this.find(".bank_txt").html());	
				}	
			}
		]);
		
		bind();	
	};
	
	var bind = function(){
		var $page = $("#page"),
			$confirm_con = $page.find(".confirm_con")
		;
		
		/* 提交认证申请 */
		$page.find(".attest_btn").on("click",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = box.relyBox({
					rely:$this,
					offset:{
						top:-32	
					},
					content:'<p class="attest_sub">确定提交银行卡认证申请</p>',
					callback:function(){
						var self = this;
						this.close = this.hide;
						this.wmBox.hover(function(){},function(){
							self.close();	
						});
					},
					sureCallBack:function(){
						window.location.reload();	
					}
				});
				$this.data("thisBox",_thisBox);	
			};
			_thisBox.show();
		});
		
		/* 确认打款金额  */
		$confirm_con.on("click",".confirm_btn",function(){
			verification.verify($confirm_con);
		});
		
		/* 添加个人账户  */
		var _html = [
			'<div class="personalBox_con">',
				'<div class="account_title"><b>个人账户</b></div>',
				'<form action="" class="wm_form">',
					'<ul>',
						'<li class="form_row">',
							'<label for="" class="row_key">银行账户类型：</label><span class="bankCard_kind">储蓄卡(借记卡)</span>',
						'</li>',
						'<li class="form_row">',
							'<label class="row_key"><b class="form_must">*</b>开户人姓名：</label>',
							'<input type="text" class="form_txt owner_name" wmv="empty" wmvmsg="开户名不能为空！" name="empty_txt" /><span for="empty_txt"></span>',
						'</li>',
						'<li class="form_row">',
							'<label class="row_key"><b class="form_must">*</b>银行卡卡号：</label>',
							'<div class="floatleft"><input type="text" class="form_txt bank_number" wmv="empty|numer" wmvmsg="银行卡号不能为空！|请输入正确的银行卡号！" name="empty_txt1" /><span for="empty_txt1"></span>',
							'<span class="form_intr">此银行卡的开户名必须为“开户人姓名”，否则结款提现会失败！</span></div>',
						'</li>',
						'<li class="form_row">',
							'<label class="row_key"><b class="form_must">*</b>银行：</label>',
							'<div class="floatleft" wmv="bank_empty" wmvmsg="银行不能为空！" name="empty_txt2">',
								'<span class="bank_txt" data_id=""></span>',
								'<input type="button" class="bank_choice" value="选择银行" /><span for="empty_txt2"></span>',
							'</div>',
						'</li>',
						'<li class="form_row">',
							'<label class="row_key">开户银行支行所在地：</label>',
							'<div class="floatleft">',
								'<select class="form_sel" id="selProvince_rent"></select>',
								'<select class="form_sel" id="selCity_rent"></select>',
								'<select class="form_sel" id="selDistricts_rent"></select>',
								'<span class="form_intr">如果找不到所在城市，可以选择所在地区或者上级城市</span>',
							'</div>',
						'</li>',
						'<li class="form_row">',
							'<label class="row_key">开户行：</label>',
							'<div class="floatleft opening"><input type="text" class="form_txt opening_bank" /><div class="bank_search"></div>',
						'</li>',
						'<li class="form_row">',
							'<label class="row_key"><b class="form_must">*</b>银行卡授权信息：</label>',
							'<div class="floatleft" wmv="img_empty" wmvmsg="请上传授权凭证照片！" name="empty_txt3">',
								'<img src="" class="upload_img" />',
								'<input type="file" value="上传" class="upload_photo" /><span for="empty_txt3"></span>',
								'<input type="hidden" class="form_hid" value="" />',
							'</div>',
						'</li>',
						'<li class="form_row download_file"><a href="http://s.tcsh.me/tcsh/view/after/cash/同城生活商家个人卡使用授权书.zip" class="doc">下载《商家个人卡使用授权书.doc》</a> 注：下载打印填写，同时盖企业红章。在该页面上传授权书凭证照片！</li>',
						'<li class="form_row form_btns"><a href="#" class="sure_btn">确定</a><a href="#" class="close">取消</a></li>',
					'</ul>',
					'<a href="#" class="wm_ico fork7 close"></a>',
				'</form>',
			'</div>'
		].join('');
		
		$page.on("click",".add_bank_card",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = box.invBox({
					boxCls:"personal_box",
					content:_html,
					callback:function(){
						var self = this,
							$wm_form = this.wmBox.find(".wm_form")	
						;
						new wmarea({
							parent:".floatleft"
						}); 
						this.close = this.hide;
						// 上传凭证图片
						this.wmBox.find(".upload_photo").on("change",function(){
							var $this = $(this),
								$img = $this.prev(".upload_img")
								$form_hid = $this.closest(".form_row").find(".form_hid")
							;
							upload.upload($this,function(data){
								if(data.response){
									$img.css("display","inline-block").attr("src",data.response.imgurl);
									$form_hid.attr("value",data.response.imgurl);
									//this.hide();
									verification.verify(this.closest(".form_row"));
									self.position();
								}	
							})	
						});
						
						// 选择银行
						this.wmBox.find(".bank_choice").on("click",function(){
							var $this = $(this),
								_bankbox = $this.data("bankbox"),
								$bank_txt = self.wmBox.find(".bank_txt")
							;
							if(!_bankbox){
								_bankbox = bankbox.Create({
									chkedCallback:function(){
										self.wmBox.find(".bank_txt").css("display","inline-block").empty().append(this.name);
										self.wmBox.find(".bank_txt").attr("data_id",this.val);	
										verification.verify($bank_txt.closest(".form_row"));
									}	
								});
								
								$this.data("bankbox",_bankbox);
							};
							_bankbox.show();	
						});
						
						// 开户行检索
						var openingHtml = juicer([
							'<ul class="opening_bank_list">',
								'{@each response.Data as item}',
								'<li class="opening_bank_item" data_id="${item.Id}">${item.Name}</li>',
								'{@/each}',
							'</ul>'
						].join(''));
						this.wmBox.find(".opening_bank").on("keyup",function(){
							var $this = $(this),
								$opening = $this.closest(".opening"),
								_bank_id = self.wmBox.find(".bank_txt").attr("data_id"),
								_key = $opening.find(".opening_bank").val()
							;
							$this.on("blur",function(){
								$opening.find(".bank_search").empty();
							});
							$.ajax({
							    url:domains.account+"/actions/bank/list",
								type:"get",
								data:{
									code:_bank_id,
									key:_key
								},
								dataType:"jsonp",
								success:function(data){
									$opening.find(".bank_search").empty().append(openingHtml.render(data));
									$this.closest(".opening").on("click",".opening_bank_item",function(){
										var _this = $(this);
										$opening.find(".opening_bank").val(_this.text());	
										$opening.find(".opening_bank_list").remove();
									});	
								},
								error:function(){
									alert("错误！");	
								}	
							});
							
							
							
						});
						
						// 确定
						this.wmBox.find(".sure_btn").on("click",function(){
							var postData={};
							var $this = $(this);
							if(verification.verify($wm_form)){
								
								var province = self.wmBox.find("#selProvince_rent option:selected").text(),
									city = self.wmBox.find("#selCity_rent option:selected").text(),
									districts = self.wmBox.find("#selDistricts_rent option:selected").text() 	
								;
								
								postData.site= encodeURIComponent(province + city + districts);
								
								postData.name = encodeURIComponent($wm_form.find(".owner_name").val());
								postData.number = $wm_form.find(".bank_number").val();
								postData.bank = encodeURIComponent($wm_form.find(".bank_txt").html());
								postData.bank_id = $wm_form.find(".bank_txt").attr("data_id");
								postData.address = $wm_form.find("#selDistricts_rent").val();
								postData.openingBank = encodeURIComponent($wm_form.find(".opening_bank").val());
								postData.imgurl = encodeURIComponent($wm_form.find(".form_hid").val());
								
								
								$.ajax({
								    url:domains.api2+"/user/addcard.json",
									type:"get",
									dataType:"jsonp",
									data:postData,
									success:function(data){
										if(data.success){
											self.close();
										}else{
											alert(data.error||"提交失败！")
										}
									},
									error:function(){
										alert("系统繁忙");	
									}	
								});
								
							};
							
							return false;	
						});
						verification.init($wm_form,function () {
							this.minZIndex = 20000;
							this.strikingSuccess = false;
						});
					}	
				});
				$this.data("thisBox",_thisBox);	
			};
			_thisBox.show();
			
			return false;
		});
		
		/* 日历插件  */
		$page.find(".record_txt").datepicker({
            onClose: function (data, e) { if (!(/\d{4}-\d{2}-\d{2}/.test(data))) { e.input.val(''); } }
        });
			
	};
	
	init();
})