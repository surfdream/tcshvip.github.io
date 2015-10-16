define(function(require,exports,module){
	"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
	var $ = require("jquery"),
		box = require("wmbox"),
		lib = require("lib")
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
		
		var _html={
			cancelHtml:[
				'<div class="sure_cancel">',
					'<ul>',
						'<li class="sure_cancel_item">取消订单后，无法恢复！</li>',
						'<li class="sure_cancel_item">',
							'<b>请选择取消订单理由：</b>',
							'<div class="choose_reason">',
								'<select name="" id="" class="slt">',
									'<option value="0">请选择理由</option>',
									'<option value="1">我不想买了</option>',
									'<option value="2">信息填写错误</option>',
									'<option value="3">卖家缺货</option>',
									'<option value="4">其他原因</option>',
								'</select>',
							'</div>',
						'</li>',
						'<li class="sure_cancel_item sure_cancel_btn"><a href="#" class="sure_btn cancel_sure">确定</a><a href="#" class="close">取消</a></li>',
					'</ul>',
					'<a href="#" class="wm_ico fork7 close_btn close"></a>',
				'</div>'
			].join(''),
			delayHtml:[
				'<div class="sure_cancel">',
					'<ul>',
						'<li class="sure_cancel_item">延长收货时间，避免超时未确认收货，订单自动确认收货打款给商家！</li>',
						'<li class="sure_cancel_item">',
							'<b>延长“确认收货”时限：</b>',
							'<div class="choose_reason">',
								'<select name="" id="" class="slt limit_slt">',
									'<option value="0">时间</option>',
									'<option value="3">3天</option>',
									'<option value="5">5天</option>',
									'<option value="7">7天</option>',
									'<option value="10">10天</option>',
								'</select>',
							'</div>',
						'</li>',
						'<li class="sure_cancel_item sure_cancel_btn"><a href="#" class="sure_btn delay_sure">确定</a><a href="#" class="close">取消</a></li>',
					'</ul>',
					'<a href="#" class="wm_ico fork7 close_btn close"></a>',
				'</div>'
			].join('')
		};
		
		
		var _BoxCon = function(k){
			return  box.invBox({
				boxcls:"order_invBox1",
				content:_html[k],
				callback:function(){
					var self = this;
					this.close = this.hide;
					this.wmBox.find(".choose_reason").hover(function(){
						var _this = $(this);
						_this.find(".reason").addClass("reason_block");	
					},function(){
						var _this = $(this);
						_this.find(".reason").removeClass("reason_block");
					});
					
					/* 下拉选择 */
					this.wmBox.find(".reason").on("click",".reason_item",function(){
						var _this = $(this),
							_thisTxt = _this.text()
						;
						_this.closest(".choose_reason").find("option").text(_thisTxt);
						_this.closest(".reason").removeClass("reason_block");							
						
						return false;	
					});
					
					/* 取消订单 确定 */
					this.wmBox.find(".cancel_sure").on("click",function(){
						var $this = $(this),
							voption = $this.closest(".sure_cancel").find(".slt")
						;
						if(voption.val() != 0){ 
							$.ajax({
								url:"",
								type:"get",
								dataType:"jsonp",
								success:function(){},
								error:function(){
									alert("系统错误，请稍后再试！")	
								}
							});	
						}else{
							alert("请选择取消订单理由！");	
						}
						
						return false;
					});
					
					/* 延长收货时间 确定 */
					this.wmBox.find(".delay_sure").on("click",function(){
						var $this = $(this),
							voption = $this.closest(".sure_cancel").find(".slt")
						;
						if(voption.val() != 0){ 
							$.ajax({
								url:"",
								type:"get",
								dataType:"jsonp",
								success:function(){},
								error:function(){
									alert("系统错误，请稍后再试！")	
								}
							});	
						}else{
							alert("请选择延迟收货时间！");	
						}
						
						return false;		
					})
				}	
			});	
		};
		/* 各种功能弹层 */
		$page.on("click",".box_show",function(){
			var $this=$(this),
				thisBox=$this.data("thisBox"),
				_thisHtml = $this.attr("data_k")
			;
			if(!thisBox){
				thisBox=_BoxCon(_thisHtml);
				$this.data("thisBox",thisBox);
			}
			thisBox.show()
			
			return false;
		});
		
		/* 提醒商家发货 */
		$page.on("click",".remind",function(){
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
		
		/* 提醒买家付款 */
		$page.on("click",".remind_buyer",function(){
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
	};
	
	init();
	
})