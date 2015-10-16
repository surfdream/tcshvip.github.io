define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
		verification = require("wmverification"),
		page = require("wmpage"),
		bankbox = require("bankbox"),
		box = require("wmbox")
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
            var $attest_content = $page.find(".attest_content"),
				$cash_chk = $attest_content.find(".cash_chk"),
				_array = new Array()
            ;
			/* 全选 */
            $cash_chk.on("click", function () {
                var $this = $(this),
					_chklength = $attest_content.find(".chk_item"),
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
            $attest_content.on("click", ".chk_item", function () {
                var _allchknum = $attest_content.find(".chk_item").length,
					_chknum = $attest_content.find(".chk_item:checked").length
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
		
		
		/* 选择其他银行 */
		$page.on("click",".other_bank",function(){
			var $this = $(this),
				_bankbox = $this.data("bankbox")
			;
			if(!_bankbox){
				_bankbox = bankbox.Create({
					chkedCallback:function(){
						$page.find(".bank_name").empty().append('—— '+this.name);	
					}
				});
				$this.data("bankbox",_bankbox);	
			}
			_bankbox.show();
		});
		
		/* 处理  */
		$page.on("click",".dispose",function(){
			var $this = $(this),
			
			m,
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				m=parseInt (Math.random()*999999)+999999;
				_thisBox = box.relyBox({
					rely:$this,
					boxCls:"dispose_box",
					offset:{
						top:-20	
					},
					content:'<div class="dispose_con"><ul><li><span class="status_change"><input type="radio" class="pay_rad pay_success" name="radio" id="pay_success'+m+'" /><label for="pay_success'+m+'" class="status_txt">打款成功</label></span><span class="write_money"><label for="payNum">打款金额</label><input type="text" class="pay_txt" id="payNum" disabled /></span></li><li><span class="status_change"><input type="radio" class="pay_rad" name="radio" id="pay_fail'+m+'" /><label for="pay_fail'+m+'" class="status_txt">打款失败</label></span></li></ul></div>',
					callback:function(){
						var self = this,
							$pay_rad = this.wmBox.find(".pay_rad"),
							_chk = this.wmBox.find(".pay_success")
						;
						this.close = this.hide;
						this.wmBox.hover(function(){},function(){
							self.close();	
						});	
						$pay_rad.on("change",function(){
							var _this = $(this);
							if(_chk.attr("checked")){
								_this.closest(".dispose_con").find(".pay_txt").removeAttr("disabled");
							}else{
								_this.closest(".dispose_con").find(".pay_txt").attr("disabled","disabled");	
							}
						})
					},
					sureCallBack:function(){
						var _status = this.wmBox.find(".pay_rad:checked").siblings(".status_txt").text(),
							_vtxt = this.wmBox.find(".pay_txt").val(),
							_chk = this.wmBox.find(".pay_success")
						;
						if(_chk.attr("checked")&&_vtxt==""){
							alert("请输入打款金额！")	
						}else{
							$this.closest("tr").find(".pay_money").empty().append(_vtxt);
							$this.closest("tr").find(".status").empty().append(_status);	
						}
						
					}
				});
				$this.data("thisBox",_thisBox);	
			}
			_thisBox.show();
			return false;	
		});
		
		/* 查看 */
		var _hlookfor = [
			'<div class="lookfor_con">',
            	'<div class="lookfor_intr">',
                	'<ul class="company_infor">',
                    	'<li><span>公司名称：</span>杭州同城生活络科技有限公司</li>',
                        '<li><span>联系人：</span>胡总</li>',
                        '<li><span>联系方式：</span>15288896898</li>',
                        '<li><span>处理状态：</span>打款成功</li>',
                    '</ul>',
                '</div>',
                '<div class="lookfor_intr border_l">',
                	'<ul class="bank_infor">',
                    	'<li><span>银行公司开户名：</span>杭州同城生活络科技有限公司</li>',
                        '<li><span>开户银行：</span>中国工商银行</li>',
                        '<li><span>公司银行帐号：</span>62261202115511241</li>',
                        '<li><span>开户银行支行名称：</span>中国工商银行拱墅区支行</li>',
                        '<li><span>开户银行支行所在地：</span>浙江杭州拱墅区祥园路33号</li>',
                    '</ul>',
                '</div>',
				'<a href="#" class="wm_ico fork7 close"></a>',
             '</div>'	
		].join('');
		$page.on("click",".lookfor",function(){
			var $this = $(this),
				_thisBox = $this.data("thisBox")
			;
			if(!_thisBox){
				_thisBox = box.invBox({
					boxCls:"lookfor_box",
					content:_hlookfor,
					callback:function(){
						this.close = this.hide;	
					}	
				});
				$this.data("thisBox",_thisBox);	
			}
			_thisBox.show();
			return false;
		});
		
		/* 批量操作打款  */
		var hpay = [
			'<div class="pay_success">',
				'<ul>',
					'<li><span class="w80">打款成功</span>请输入打款金额<input type="text" class="pay_txt" name="pay" wmv="empty|numer" wmvmsg="打款金额不能为空！|请输入数字！" /><span for="pay"></span></li>',
					'<li class="tishi"><span class="w80"></span>输入1元以下的汇款确认金额！</li>',
					'<li class="pay_btn"><a href="#" class="save">保存</a><a href="#" class="close">取消</a></li>',
				'</ul>',
				'<a href="#" class="wm_ico fork7 close"></a>',
			'</div>'
		].join('');
		$page.on("click",".attest_sub1",function(){
			var $this = $(this),
				chk = $page.find(".chk_item:checked")
				_thisBox = $this.data("thisBox")
			;
			if(chk.length){
				if(!_thisBox){
					_thisBox = box.relyBox({
						rely:$this,
						offset:{
							top:-35	
						},
						content:hpay,
						callback:function(){
							var self = this,
								$pay_success = this.wmBox.find(".pay_success")
							;
							this.close = this.hide;	
							this.wmBox.find(".wmBox-botton").remove();
							this.wmBox.find(".save").on("click",function(){
								if(verification.verify($pay_success)){
									var _this = $(this),
										_chk = $page.find(".chk_item:checked"),
										_vmoney
									;
									_vmoney = self.wmBox.find(".pay_txt").val();
									_chk.closest("tr").find(".pay_money").empty().append(_vmoney);
									_chk.closest("tr").find(".status").text("打款成功");
									self.wmBox.fadeOut();
								};
								return false;	
							});
							this.wmBox.hover(function(){},function(){
								self.close();	
							});
							verification.init($pay_success,function () {
								this.minZIndex = 20000;
								this.strikingSuccess = false;
							});
						}
					});
					$this.data("thisBox",_thisBox);
				}
				_thisBox.show();
			}else{
				alert("请选择批量处理内容！")
			}
		});
		
		/* 日历控件 */
        $page.find(".data_txt").datepicker({
            onClose: function (data, e) { if (!(/\d{4}-\d{2}-\d{2}/.test(data))) { e.input.val(''); } }
        });
    };
    init();
})