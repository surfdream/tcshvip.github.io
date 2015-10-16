define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
		juicer = require("juicer"),
		upload = require("wmupload"),
		verification = require("wmverification"),
		box = require("wmbox")
    ;

    var init = function () {

        var $form = $(".wm_form");
        verification.addRule([
			 {
			    key: "imgEmpty",
			    fun: function () {
			        //判断是否删除
			        if (!this.closest(".form_row_img").find(".del_mask").length) {
			            //正常情况下，判断img的src
			            return (this.find("img").attr("src") || "").length > 0;
			        } else {
			            //删除情况下，相当于不验证
			            return true;
			        }
			    }
			}
        ]);
        verification.init($form);

        bind();
    };

    var bind = function () {

        var $page = $("#page"),
			$form = $page.find(".wm_form"),
			$chat_con = $form.find(".chat_con")
        ;
        var _domHtml = [
			'<ul class="chat_con">',
				'<li class="form_row">',
					'<label>名称：</label>',
					'<input type="text" id="chat_kind" class="form_txt" wmv="empty" wmvmsg="名称不能为空！" />',
				'</li>',
				'<li class="form_row_add">',
					'<a href="#" class="add_new_img">添加图片</a>',
				'</li>',
				'<li class="iconfont chat_btn">',
					'<a href="#" class="chat_save">&#xf0131;</a>',
					'<a href="#" class="chat_show" title="显示图片">&#xf00e9;</a>',
					'<a href="#" class="chat_del">&#xf00b3;</a>',
				'</li>',
			'</ul>'
        ].join('');

        var _addImgHtml = [
			'<div class="form_row_img">',
				'<a href="#" class="chat_img" wmv="imgEmpty" wmvmsg="请上传图片！">+<span>图片比例为<em>970*150</em></span><img src="" class="upload_img" /></a>',
				'<input type="file" class="form_file" title="点击上传"  />',
				'<input type="hidden" class="file_url">',
				'<span class="img_operate">',
					'<a href="#" class="del_img">删除</a>',
				'</span>',
			'</div>'
        ].join('');
		
        $page.on("change", ".form_row_img .form_file", function () {
            var $this = $(this);
            upload.upload($this, function (data) {
                var $form_row_img = this.closest(".form_row_img")
                ;
                if (data.response) {
                    $form_row_img.find("img").show().attr("src", data.response.imgurl).css("display", "block");
                    $form_row_img.find(".file_url").val(data.response.imgurl);
                }
            })
        });

        /* 添加类目 */
        $page.on("click", ".add_img", function () {
            var $domhtml = $(_domHtml);

            $page.find(".chat_item").append($domhtml);


            return false;
        });

        /* 添加图片 */

        $form.on("click", ".add_new_img", function () {
            var $this = $(this),
				$form_row_add = $this.closest(".form_row_add"),
				$addImgHtml = $(_addImgHtml),
				$chat_con = $this.closest(".chat_con")
            ;
			$chat_con.find(".chat_show").click();
            $this.before($addImgHtml);
			
				
            $addImgHtml.find(".form_file").on("change", function () {
                var $this = $(this);
                upload.upload($this, function (data) {
                    var $form_row_img = this.closest(".form_row_img")
                    ;
                    if (data.response) {
                        $form_row_img.find("img").show().attr("src", data.response.imgurl).css("display", "block");
                        $form_row_img.find(".file_url").val(data.response.imgurl);
                    }
                })
            });
            return false;
        });


        /* 删除 */
        $form.on("click", ".chat_del", function () {
            var $this = $(this),
				$chat_con = $this.closest(".chat_con")
            ;
            verification.hideTips($chat_con);
			
			$chat_con.find(".chat_hide").click();
			
            if ($chat_con.attr("data_id")) {
				var _mask = '<div class="del_mask"><ul><li>确认删除？，<span>删除后无法恢复！</span></li><li><span class="del_mask_btn"><a href="#" class="sure_del">确定</a><a href="#" class="cancel_del">取消</a></span></li></ul></div>';
                $chat_con.append(_mask);
				
            } else {
                $chat_con.fadeOut();
            }

            return false;
        });
		
		/* 确认删除 */
		$form.on("click",".sure_del",function(){
			var $this = $(this),
				$chat_con = $this.closest(".chat_con"),
				_data = {}
			;
			_data.id = $chat_con.attr("data_id");
			$.ajax({
			    url:domains.api2+"/sns/deletemessagesceneimg.json",
				type:"get",
				data:_data,
				dataType:"jsonp",
				success:function(data){
					if(data.success){
						alert("删除成功！");
						window.location.reload();
					}else{
						alert(data.error)	
					}	
				},
				error:function(){
					alert("系统繁忙，稍后再试！");		
				}	
			});
			
			return false;
		});

        /* 取消删除 */
        $form.on("click", ".cancel_del", function () {
            var $this = $(this);
            $this.closest(".del_mask").remove();
            return false;
        });

        /* 保存 */
        $form.on("click", ".chat_save", function () {
            var $this = $(this),
				$chat_con = $this.closest(".chat_con"),
				$form_row_img = $chat_con.find(".form_row_img"),
				_datas = {}
            ;
            if (verification.verify($chat_con)) {
				_datas.id=$chat_con.attr("data_id")||"";
				_datas.theme=$chat_con.find(".form_txt").val();
                _datas.jsonimg = [];
				
                $form_row_img.each(function () {
                    var $self = $(this);
                   
                    if (!$self.find(".del_mask").length) {
                        _datas.jsonimg.push($self.find(".upload_img").attr("src"));
                    } 
                });
				
				_datas.jsonimg=JSON.stringify(_datas.jsonimg);
				
				$.ajax({
				    url:domains.api2+"/sns/messagesceneimg.json",
					type:"get",
					dataType:"jsonp",
					data:_datas,
					success:function(data){
						if(data.success){
							alert("保存成功！");
							window.location.reload();
						}else{
							alert(data.error)	
						}
					},
					error:function(){
						alert("系统繁忙，稍后再试！");	
					}
				});
				
            }
            return false;
        });
		
		/* 隐藏/显示添加的图片 */
		$form.on("click",".chat_show",function(){
			var $this = $(this),
				$chat_con = $this.closest(".chat_con")
			;
			$this.replaceWith('<a href="#" class="chat_hide" title="隐藏添加的图片">&#xf00ea;</a>');	
			$chat_con.find(".form_row_img").css({
				"display":"block"	
			});
			
			return false;
		});
		$form.on("click",".chat_hide",function(){
			var $this = $(this),
				$chat_con = $this.closest(".chat_con")
			;
			$this.replaceWith('<a href="#" class="chat_show" title="显示添加的图片">&#xf00e9;</a>');	
			$chat_con.find(".form_row_img").css({
				"display":"none"	
			});
			
			return false;
		});
		
		/* 保存图片 */
		$form.on("click",".save_img",function(){
			var $this = $(this),
				$form_row_img = $this.closest(".form_row_img")
				img = [],
				$upload_img = $form_row_img.find(".upload_img")
			;
			if (verification.verify($form_row_img)){
				img.push({
					imgid:$upload_img.attr("data_id")||"",
					imgsrc:$upload_img.attr("src")
				});	
			}
			return false;	
		});
		
		/* 删除图片 */
		$form.on("click",".del_img",function(){
			var $this = $(this),
				$form_row_img = $this.closest(".form_row_img")
			;
			verification.hideTips($form_row_img);
			
			if ($form_row_img.find(".upload_img").attr("data_id")) {
				var _mask = '<div class="del_mask" style="line-height:' + $form_row_img.outerHeight() + 'px;">保存后彻底删除，<a href="#" class="cancel_del">撤销删除</a></div>';
                $form_row_img.append(_mask);
				
            } else {
                $form_row_img.remove();
            }
			return false;	
		});

    };

    init();


})