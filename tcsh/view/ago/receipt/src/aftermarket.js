define(function(require,exports,mudule){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		showartwork = require("wmshowartwork"),
		box = require("wmbox"),
		upload = require("wmupload"),
		verification = require("wmverification"),
		logistics_data = require("wmlogistics_data"),
		juicer = require("juicer"),
		lib = require("lib"),
		addad_box = require("addad_box")
	;
	var init = function(){
		var $page = $("#page"),
			$order_time = $page.find(".order_time")
		;
		
		if($order_time.length){
			/* 获取时间 */
			var _time = lib.turnTime(parseInt(global_setting.countdown*1000)),
				_day = $page.find(".day"),
				_hour = $page.find(".hour"),
				_minute = $page.find(".minute"),
				_second = $page.find(".second")
			;
			
			_day.empty().append(_time.d);
			_hour.empty().append(_time.h);
			_minute.empty().append(_time.m);
			_second.empty().append(_time.s);
			
			/* 倒计时 */
			setInterval(function(){
				var tday = 	_day.text(),
					thour = _hour.text(),
					tminute = _minute.text(),
					tsecond = _second.text()
				;
				
				if(tday==0&&thour==0&&tminute==0&&tsecond==0){
					window.location.reload();	
				}else if(_time.s--){
					_day.empty().append(_time.d);
					_hour.empty().append(_time.h);
					_minute.empty().append(_time.m);
					_second.empty().append(_time.s);	
				} else{
					_time.s = 59;
					if(_time.m--){
						_day.empty().append(_time.d);
						_hour.empty().append(_time.h);
						_minute.empty().append(_time.m);
						_second.empty().append(_time.s);	
					}else{
						_time.m = 59;
						if(_time.h--){
							_day.empty().append(_time.d);
							_hour.empty().append(_time.h);
							_minute.empty().append(_time.m);
							_second.empty().append(_time.s);	
						}else{
							_time.h=23;
							if(_time.d--){
								_day.empty().append(_time.d);
								_hour.empty().append(_time.h);
								_minute.empty().append(_time.m);
								_second.empty().append(_time.s);	
							}
						}	
					}
				}	
			},1000);
		}
		bind();	
		
	};
	
	var bind = function(){
		var $page = $("#page");
		
		/*  放大图片 上移 效果  */
		$page.find(".proof a").hover(function(){
			var $this = $(this);
			$this.find(".look_proof").addClass("look_proof_hover");
				
		},function(){
			var $this = $(this);
			$this.find(".look_proof").removeClass("look_proof_hover");	
		});	
		
		/* 图片放大  */
		$page.find(".proof").on("click","a",function(){
			var $this = $(this),
				_showartwork = $this.data("showartwork")
			;
			
			if(!_showartwork){
				_showartwork = showartwork.create($this.find("img").attr("src"));
				$this.data("showartwork",_showartwork);
			};
			_showartwork.show();
			
			return false;
		});
		
		
		/* 填写物流信息 html */
		var	_wuliuHtml = [
			'<div class="aftermarket_infor_detail wuliu_infor">',
				'<ul>',
					'<li class="aftermarket_infor_item"><em class="must">*</em><label for="wuliu_company" class="item_title">物流公司：</label><input type="text" id="wuliu_company" class="wuliu_txt" wmv="empty" wmvmsg="物流公司不能为空！" name="empty_txt" disabled /><input type="button" class="wuliu_btn" value="选择物流公司" /><span for="empty_txt"></span></li>',
					'<li class="aftermarket_infor_item"><em class="must">*</em><label for="wuliu_number" class="item_title">物流单号：</label><input type="text" id="wuliu_number" class="wuliu_txt" wmv="empty" wmvmsg="物流单号不能为空！" name="empty_txt1" /><span for="empty_txt1"></span></li>',
					'<li class="aftermarket_infor_item"><label for="message" class="item_title">备注：</label><textarea name="" id="" cols="30" rows="10" id="message" class="wuliu_tar"></textarea></li>',
					'<li class="aftermarket_infor_item">',
						'<span class="item_title">上传凭证：</span>',
						'<span class="proof wuliu_proof">',
							'<input type="file" class="change_file" />',
						'</span>',
					'</li>',
					'<li class="aftermarket_infor_item img_msg"><span class="item_title"></span>每张图片大小不超过5m，支持gif、jpg、png、bmp格式，最多3张</li>',
					'<li class="aftermarket_infor_item box_btn"><span class="item_title"></span><a href="#" class="bgred certain">确定</a><a href="#" class="close">取消</a></li>',
			   '</ul>',
			   '<a href="#" class="wm_ico fork7 close"></a>',
			'</div>'
		].join('');
			
		var imghtml = [
			'<a href="#" class="wuliu_img refund_img">',
				'<img src="" />',
				'<span class="iconfont look_proof">删除图片</span>',
			'</a>'
		].join('');
		/* 创建退货地址LI */
		var return_address = function(data){
			return '<li class="address_item" data_id="'+data.id+'"><input type="radio" name="radio" class="radio return_addr" />'+(data.areaTxt+'，'+data.address+'，'+data.consigneeName+'，'+data.phone+'，'+data.chinaZip)+'</li>';
			
		};	
		/* 选择物流 html */
		var wuliuChange = juicer([
			'<div class="change_wuliu">',
				'<ul class="wuliu_list" unselectable="on" onselectstart="return false;">',
					'{@each list as item}',
					'<li class="clearfix">',
						'<span class="wuliu_kinds">${item.key}</span>',
						'<div class="wuliu_con">',
							'{@each item.list as subItem}',
							'<span class="wuliu_name" data_key="${subItem.key}">${subItem.name}</span>',
							'{@/each}',
						'</div>',
					'</li>',
					'{@/each}',
				'</ul>',
				'<div class="change_wuliu_btn box_btn">',
					'<a href="#" class="bgred change_sure">确定</a>',
					'<a href="#" class="close">取消</a>',
				'</div>',
			'</div>'
		].join(''));
		
		
		/* 填写物流信息 */
		$page.on("click",".write_wuliu",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
				;
			
			if(!_thisBox){
				_thisBox = box.invBox({
					boxCls:"wuliu_box",
					content:_wuliuHtml,
					callback:function(){
						var self=this
						var $wuliu_infor = this.wmBox.find(".wuliu_infor");
						this.close =this.hide;
						/*  确定 */
						this.wmBox.find(".certain").on("click",function(){
							var $self = $(this)
							;
							if(verification.verify($wuliu_infor)){
								$.ajax({
									url:"",
									type:"get",
									dataType:"json",
									success:function(){},
									error:function(){
										alert("操作成功！");
										$self.closest(".wmBox").hide();
										$(".wmBox-mask").hide();
									}	
								});	
							}
							return false;
						});	
						/* 上传图片 */
						this.wmBox.find(".change_file").on("change",function(){
							var $this = $(this);
							$this.before(imghtml);
							 upload.upload($this,function(data){
								var $wuliu_img = this.prev(".wuliu_img");
								if(data.response){
									$wuliu_img.find("img").attr("src",data.response.imgurl);	
								}	
							});
						});
						/* 删除图片 */
						this.wmBox.find(".wuliu_proof").on("click",".wuliu_img",function(){
							var $this = $(this)
							;
							$this.hide();
							
							return false;	
						});
						/* 验证 */
						verification.init($wuliu_infor,function () {
							this.setTipSkin("white1").setOffSet({
								top: 5,
								left: 5
							});
							this.minZIndex = 20000;
							this.strikingSuccess = false;
						});
						
						/* 选择物流公司 */
						this.wmBox.find(".wuliu_btn").on("click",function(){
							var $this = $(this),
								_thisBox = $this.data("thisBox")
							;
							if(!_thisBox){
								_thisBox = box.invBox({
									boxCls:"change_wuliu_box",
									content:wuliuChange.render(logistics_data),
									mask:false,
									callback:function(){
										var self=this;
										var $wuliu_name = this.wmBox.find(".wuliu_name");
										this.close = this.hide;
										$wuliu_name.on("click",function(){
											var $this = $(this);
											$wuliu_name.removeClass("wuliu_name_click");
											$this.addClass("wuliu_name_click");
										});	
										$wuliu_name.on("dblclick",function(){										
											self.wmBox.find(".change_sure").click();
										});
										this.wmBox.find(".change_sure").on("click",function(){
											var $this = $(this),
												_wuliu =$this.closest(".change_wuliu").find(".wuliu_name_click"),
												dwuliu = _wuliu.attr("data_key"),
												$wuliu_company = $this.closest(".change_wuliu_box").siblings(".wuliu_box").find("#wuliu_company") 
											;
											
											$(".change_wuliu_box").hide();
											$wuliu_company.val(_wuliu.text());
											$wuliu_company.attr("data_key",dwuliu);	
											
											return false;
										});
									}
								});
								$this.data("thisBox",_thisBox);		
							}
							_thisBox.show();
							return false;
						});
						
					}	
				});
				$this.data("thisBox",_thisBox);	
			}
			_thisBox.show();
			
			return false;	
		});
		
		/* 取消退款申请 */
		$page.on("click",".cancel_refund",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox") 
			;
			if(!_thisBox){
				_thisBox = box.invBox({
					boxCls:"cancel_box",	
					content:'<div class="cancel_infor"><b>取消退款申请后，该笔退款申请将关闭，无法恢复！</b><p class="box_btn"><a href="#" class="bgred certain">确定</a><a href="#" class="close">取消</a></p><a href="#" class="wm_ico fork7 close"></a></div>',
					callback:function(){
						this.close = this.hide;
						this.wmBox.find(".certain").on("click",function(){
							$.ajax({
								url:"",
								type:"get",
								dataType:"json",
								success:function(){},
								error:function(){
									alert("取消退款成功！");
									$(".wmBox").fadeOut();
									$(".wmBox-mask").fadeOut();		
								}	
							});
							return false;	
						});	
					}
				});
				$this.data("thisBox",_thisBox);	
			}
			_thisBox.show();
			return false;	
		});
		
		/* 提醒商家退款处理 */
		$page.on("click",".remind_refund",function(){
			$.ajax({
				url:"",
				type:"get",
				dataType:"jsonp",
				success:function(){},
				error:function(){
					alert("提醒成功！");	
				}	
			});	
			return false;
		});
		
		
		/* 商家同意退款申请 */
		$page.on("click",".agree_refund",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			var agreeHtml = [
				'<div class="agree_con">',
                	'<b>如果您确定同意该笔不退货退款申请，将退款给买家<span class="red">￥19.00</span></b>',
                   '<p>同城生活将在3个工作日内，将退款金额退还到买家原先支付的账户内！</p>',
                    '<p class="box_btn"><a href="#" class="bgred certain">确定</a><a href="#" class="close">取消</a></p>',
					'<a href="#" class="wm_ico fork7 close"></a>',
                '</div>'
			].join('');
			if(!_thisBox){
				_thisBox = box.invBox({
					boxCls:"agree_refund_box",
					content:agreeHtml,
					callback:function(){
						this.close = this.hide;
						this.wmBox.find(".certain").on("click",function(){
							$.ajax({
								url:"",
								type:"get",
								dataType:"jsonp",
								success:function(){},
								error:function(){
									alert("系统繁忙，请稍后再试！");	
								}	
							});
							return false;
						});	
					}	
				});
				$this.data("thisBox",_thisBox);
			};
			_thisBox.show();
			return false;	
		});	
		
		/* 商家拒绝退款申请 */
		$page.on("click",".refuse_refund",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			var refuseHtml = [
				'<div class="refuse_con">',
					'<ul>',
						'<li><b>如果<span class="red">“拒绝退款”</span>，该售后可申请将由同城生活进行仲裁处理！请慎重！</b></li>',
					   '<li class="aftermarket_infor_item"><label for="message" class="item_title">拒绝原因：</label><textarea name="empty_txt1" id="" cols="30" rows="10" id="message" class="refund_tar" id="refuse_reason" wmv="empty" wmvmsg="拒绝理由不能为空！"></textarea><span for="empty_txt1" class="wmv_error"></span></li>',
						'<li class="aftermarket_infor_item">',
							'<span class="item_title">上传凭证：</span>',
							'<span class="proof wuliu_proof">',
								'<input type="file" class="change_file" />',
							'</span>',
						'</li>',
						'<li class="aftermarket_infor_item img_msg"><span class="item_title"></span>每张图片大小不超过5m，支持gif、jpg、png、bmp格式，最多3张</li>',
						'<li class="aftermarket_infor_item box_btn"><span class="item_title"></span><a href="#" class="bgred certain">确定</a><a href="#" class="close">取消</a></li>',
					'</ul>',
					'<a href="#" class="wm_ico fork7 close"></a>',
                '</div>'
			].join('');
			if(!_thisBox){
				_thisBox = box.invBox({
					boxCls:"refuse_refund_box",
					content:refuseHtml,
					callback:function(){
						var self = this,
							$refuse_con = this.wmBox.find(".refuse_con")
						;
						this.close = this.hide;
						
						/* 上传图片 */
						this.wmBox.find(".change_file").on("change",function(){
							var $this = $(this);
							$this.before(imghtml);
							 upload.upload($this,function(data){
								var $wuliu_img = this.prev(".wuliu_img");
								if(data.response){
									$wuliu_img.find("img").attr("src",data.response.imgurl);	
								}	
							});
						});
						
						/* 删除图片 */
						this.wmBox.find(".wuliu_proof").on("click",".wuliu_img",function(){
							var $this = $(this)
							;
							$this.hide();
							
							return false;	
						});
						
						/* 确定 */
						this.wmBox.find(".certain").on("click",function(){
							var $this = $(this),
								
								$refund_tar = $refuse_con.find("refund_tar")
							;
							if(verification.verify($refuse_con)){
								$.ajax({
									url:"",
									type:"get",
									dataType:"jsonp",
									success:function(){},
									error:function(){
										alert("系统繁忙，请稍后再试！");	
									}	
								});
							}
							return false;
						});	
						/* 验证 */
						verification.init($refuse_con,function () {
							this.setTipSkin("white1").setOffSet({
								top: 5,
								left: 5
							});
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
		
		/* 商家同意退货申请 */
		var _active = function(){
				var refuseHtml = [
					'<div class="refuse_con">',
						'<ul>',
						   '<li class="aftermarket_infor_item">',
								'<span class="item_title">退货地址：</span>',
								'<ul class="address">',
									'<li class="address_item add_do"><span class="add_address">+</span><a href="#" class="add_address_con">添加退货地址</a></li>',
								'</ul>',
						   '</li>',
							'<li class="aftermarket_infor_item box_btn"><span class="item_title"></span><a href="#" class="bgred certain">确定</a><a href="#" class="close">取消</a></li>',
						'</ul>',
						'<a href="#" class="wm_ico fork7 close"></a>',
					'</div>'
				].join('');
				
				var _thisBox = $(this).data("thisBox");
				
				if(!_thisBox){
					_thisBox = box.invBox({
						boxCls:"agree_returns_box",
						content:refuseHtml,
						callback:function(){
							var self = this,
								$refuse_con = this.wmBox.find(".refuse_con"),
								$add_do=this.wmBox.find(".add_do")
							;
							this.close = this.hide;
							var data={
							list:[
									{
										id:"1",
										areaTxt:"浙江 杭州 拱墅区",
										address:"祥园路33号5楼",
										consigneeName:"同城生活同城生活",
										phone:"18767104781",
										chinaZip:"310011"
									},{
										id:"2",
										areaTxt:"浙江 杭州 拱墅区",
										address:"祥园路33号5楼",
										consigneeName:"同城生活同城生活",
										phone:"18767104781",
										chinaZip:"310011"
									},{
										id:"3",
										areaTxt:"浙江 杭州 拱墅区",
										address:"祥园路33号5楼",
										consigneeName:"同城生活同城生活",
										phone:"18767104781",
										chinaZip:"310011"
									}
								]	
							},_arr=[];
							for(var i in data.list){
								_arr.push(return_address(data.list[i]));
							}
							$add_do.before(_arr.join(''));
							/* 添加退货地址 */
							this.wmBox.find(".add_address_con").on("click",function(){
								var $this = $(this),
									_thisBox = $this.data("thisBox"),
									$add_do = $this.closest(".add_do")
								;
								addad_box.show({
									saveCallBack:function(data){
										$add_do.before(return_address(data));
									}
								});
								return false;	
							});
							/* 确定 */
							this.wmBox.find(".certain").on("click",function(){
								var $this = $(this),
									$refuse_con = $this.closest(".refuse_con"),
									_checked = $refuse_con.find(".return_addr:checked")
								;
								/* 判断是否选中地址，没选中提示 */
								if(_checked.length){
									$.ajax({
										url:"",
										type:"get",
										dataType:"jsonp",
										success:function(){},
										error:function(){
											alert("系统繁忙，请稍后再试！");	
										}	
									});	
								}else{
									alert("请选择地址！");		
								}
								
								return false;
							});	
						}	
					});
					$(this).data("thisBox",_thisBox);
				};
				_thisBox.show();
			};
		$page.on("click",".agree_returns",function(){
			var $this = $(this)
			;
			$.ajax({
				url:"",
				type:"get",
				dataType:"jsonp",
				success:function(){},
				error:function(){
					_active();	
				}	
			});
			return false;	
		});	
		
		/* 商家拒绝退货申请 */
		$page.on("click",".refuse_returns",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			var refuseHtml = [
				'<div class="refuse_con1">',
					'<ul>',
					   '<li class="aftermarket_infor_item"><label for="message" class="item_title">拒绝原因：</label><textarea name="empty_txt1" id="" cols="30" rows="10" id="message" class="refund_tar" id="refuse_reason" wmv="empty" wmvmsg="拒绝理由不能为空！"></textarea><span for="empty_txt1"></span></li>',
						'<li class="aftermarket_infor_item box_btn"><span class="item_title"></span><a href="#" class="bgred certain">确定</a><a href="#" class="close">取消</a></li>',
					'</ul>',
					'<a href="#" class="wm_ico fork7 close"></a>',
                '</div>'
			].join('');
			if(!_thisBox){
				_thisBox = box.invBox({
					boxCls:"refuse_refund_box",
					content:refuseHtml,
					callback:function(){
						var self = this,
							$refuse_con = this.wmBox.find(".refuse_con")
						;
						this.close = this.hide;
						this.wmBox.find(".certain").on("click",function(){
							var $this = $(this),
								
								$refund_tar = $refuse_con.find("refund_tar")
							;
							if(verification.verify($refuse_con)){
								$.ajax({
									url:"",
									type:"get",
									dataType:"jsonp",
									success:function(){},
									error:function(){
										alert("系统繁忙，请稍后再试！");	
									}	
								});
							}
							return false;
						});	
						/* 验证 */
						verification.init($refuse_con,function () {
							this.setTipSkin("white1").setOffSet({
								top: 5,
								left: 5
							});
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
	
		
	};
	
	init();
	
})