define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
		box = require("wmbox"),
		juicer = require("juicer"),
		tips = require("wmtips"),
		page = require("wmpage"),
		inquire = require("inquire"),
		lib = require("lib"),
		zan = require("zan"),
		modules = require("modules"),
		lazyload = require("lazyload"),
		friends = require("friends")
    ;
    var init = function () {
        var $page = $("#page");

        lazyload.init();

        // 分页
        if (global_setting && global_setting.totalcount) {
            var _page = page.Create({
                url: global_setting.pageUrl,
                element: ".wm_page",
                size: global_setting.pageSize,
                index: global_setting.pageIndex,
                sum: global_setting.totalcount,
                param: {
                    hostId: global_setting.hostId
                },
                front: true
            });
        };

        $page.find(".sns_data_detail").each(function () {
            var $this = $(this),
				con = $this.closest(".sns_data_main").find(".quesContent").html(),
				$con
            ;
            $con = $(con);
            _con = $con.text().replace(/\s+/g, "");
            if (_con.length > 200) {
                _con = _con.substr(0, 200);
                $this.find(".appendCon").append(_con + "……");
            } else {
                $this.find(".appendCon").append(_con);
            };

        });

        //  回答编辑器
        if ($page.find("#answer_editor").length) {
            var editor = new UE.ui.Editor();
            editor.render("answer_editor");
            editor.ready(function () {
                editor.setHeight(200);
                // 发布按纽
                $page.on("click", ".send_ans", function () {
                    var $this = $(this),
						$left = $this.closest(".main_left"),
						$box = $(".recommend_box"),
						postData = {}
                    ;
                    postData.userId = lib.cookie("wm.user.id");
                    postData.hostId = global_setting.hostId;
                    postData.questionId = $left.find(".mlh_title").attr("data_id");
                    postData.answerContent = encodeURIComponent(editor.getContent());
                    postData.recommendProduct = [];
                    $box.find(".hook2").each(function () {
                        var $this = $(this),
							_Vlink
                        ;
                        _Vlink = $this.siblings(".recommend_txt").val();
                        postData.recommendProduct.push(encodeURIComponent(_Vlink || ""));
                    });
                    postData.recommendProduct = JSON.stringify(postData.recommendProduct);
                    lib.verificationLogin(function () {
                        if (editor.getContent()) {
                            $.ajax({
                                url: domains.sns + "/answer_question/answer/add",
                                type: "get",
                                dataType: "json",
                                data: postData,
                                success: function () {
                                    window.location.reload();
                                },
                                error: function () {
                                    alert("系统繁忙，请稍后再试！");
                                }
                            });
                        } else {
                            alert("请填写回答内容！");
                        };
                    });

                    return false;
                });
            });
        };

        // 查看更多问答
        var _item = $page.find(".ans_infor_item").length,
			count = $page.find(".count").text()
        ;
        if (count > _item) {
            var loadmore = ('<div class="loadmore"><a href="#" class="loadmore_sub">查看更多回答>></a></div>');
            $page.find(".question_detail").append(loadmore);
        };

        bind();

    };

    var bind = function () {
        var $page = $("#page"),
			$friends_con_sub = $page.find(".friends_con_sub")
        ;

        var _moreAnswer = juicer([
			'{@each success as item}',
			'<div class="ans_infor_item" data_id="${item.answer_id}" answer_user_id="${item.answer_user_id}">',
				'<span class="ans_time">${item.create_time}</span>',
				'<span class="ans_head"><a href="#" class="ans_head_img"><img src="${item.answer_user_headImg}" /></a><a href="#" class="focus">+ 关注</a></span>',
				'<div class="ans_infor_con">',
					'<h3 class="ans_infor_name"><a href="#">${item.answer_user_name}</a>回答该问题',
						'{@if item.showAdoption == true}',
						'<a href="#" class="adopt">采纳</a>',
						'{@/if}',
					'</h3>',
					'<p class="ans_content">${item.answer_content}</p>',
					'<div class="answer_zan clearfix">',
						'<div class="answer_Ilike">',
							'<a href="#" class="answer_man_like">我喜欢</a>',
							'<div class="anl_con">',
								'<div class="anl_con_triangle"><span class="tri1">◆</span><span class="tri2">◆</span></div>',
								'{@each item.products as list}',
								'<a href="#" class="anl_con_item" data_id="${list.productId}">',
									'<img src="${list.productImgDefault}" />',
									'<span class="anl_con_item_price">￥${list.salePrice}</span>',
								'</a>',
								'{@/each}',
							'</div>',
						'</div>',
						'<span class="zan_people">',
							'<span class="zan_people_sub">',
								'<a href="#" class="zan_people_item zan"><span class="iconfont {@if item.praise_remark == 1}already_zan{@/if} ">&#xe613;</span><span class="zan_num">${item.praiseToral}</span></a>',
							'</span>',
							'<span class="zan_people_sub zan_people_name">',
								'{@each item.users as users}',
								'<a href="#" class="zan_people_item" data_id="${users.userId}">${users.userName}</a>',
								'{@/each}',
							'</span>',
							'等人表示赞同.',
						'</span>',
					'</div>',
				'</div>',
			'</div>',
			'{@/each}'
        ].join(''));
        // 查看更多问答
        $page.on("click", ".loadmore_sub", function () {
            var $this = $(this),
				$ans_infor = $page.find(".ans_infor"),
				_data_id
            ;
            _data_id = $ans_infor.find(".ans_infor_item:last").attr("data_id");
            $.ajax({
                url: domains.sns + "/answer_question/answer/page_answers",
                type: "get",
                data: {
                    answerId: _data_id,
                    questionId: global_setting.questionId
                },
                dataType: "jsonp",
                success: function (data) {
                    $ans_infor.append(_moreAnswer.render(data));
                    var _item = $page.find(".ans_infor_item").length,
						count = $page.find(".count").text()
                    ;
                    if (count <= _item) {
                        $page.find(".loadmore").remove();
                    };
                },
                error: function () {
                    alert("系统繁忙，请稍后再试！");
                }
            });
            return false;
        });

        // 问题选中/取消
        $page.on("click", ".setting_chk", function () {
            var $this = $(this),
				_length = $page.find(".question").length,
				_chk_len
            ;
            if (!$this.hasClass("setting_chk_click")) {
                $this.addClass("setting_chk_click");
            } else {
                $this.removeClass("setting_chk_click");
            };
            _chk_len = $page.find(".setting_chk_click").length;
            if (_chk_len == _length) {
                $page.find(".chk_all").html("取消全选").addClass("cancel_chk_all");
            } else {
                $page.find(".chk_all").html("全选").removeClass("cancel_chk_all");
            }

        });

        $page.on("click", ".setting", function () {
            return false;
        });
        // 全选
        $page.on("click", ".chk_all", function () {
            var $this = $(this),
				$setting_chk = $page.find(".setting_chk")
            ;
            if (!$this.hasClass("cancel_chk_all")) {
                $setting_chk.addClass("setting_chk_click");
                $this.html("取消全选").addClass("cancel_chk_all");
            } else {
                $setting_chk.removeClass("setting_chk_click");
                $this.html("全选").removeClass("cancel_chk_all");
            }

            return false;
        });

        // 列表删除
        var _delete = function (url) {
            if (!url) {
                throw "Interface parameters abnormal!";
                return false;
            }
            var $this = $(this),
				_checked = $page.find(".setting_chk_click"),
				postData = {}
            ;
            postData.delIds = [];
            _checked.each(function () {
                var _this = $(this),
					_id = _this.closest(".sns_data_item").attr("data_id")
                ;
                postData.delIds.push(_id);
            });
            postData.delIds = JSON.stringify(postData.delIds);
            postData.hostId = global_setting.hostId;
            if (_checked.length) {
                $.ajax({
                    url: url,
                    type: "get",
                    data: postData,
                    dataType: "json",
                    success: function () {
                        _checked.closest(".sns_data_item").fadeOut();
                        window.location.reload();
                    },
                    error: function () {
                        alert("系统繁忙，请稍后再试！");
                    }
                });
            } else {
                alert("请先选择！");
            };
        };

        // 问答列表删除
        $page.on("click", ".question_del", function () {
            _delete.call(this, domains.sns + "/answer_question/question/del");
            return false;
        });
        // mark列表删除
        $page.on("click", ".mark_del", function () {
            _delete.call(this, domains.sns + "/answer_question/mark/c");
            return false;
        });
        //  删除某一问答
        $page.on("click", ".del_btn", function () {
            var $this = $(this),
				$head = $this.closest(".main_left_head"),
				_thisBox = $this.data("thisBox"),
				postData = {}
            ;
            if (!_thisBox) {
                _thisBox = box.invBox({
                    boxCls: "del_box",
                    content: '<div class="del_box_con"><p class="del_box_content">确定删除该购物经？</p><p class="del_box_btns"><a href="#" class="del_sure">确定</a><a href="#" class="close">取消</a></p><a href="#" class="close wm_ico hook10"></a></div>',
                    callback: function () {
                        var self = this;
                        this.close = this.hide;
                        this.wmBox.find(".del_sure").on("click", function () {
                            var _this = $(this);
                            postData.hostId = global_setting.hostId;
                            postData.delIds = [];
                            postData.delIds.push(String(global_setting.questionId));
                            postData.delIds = JSON.stringify(postData.delIds);
                            $.ajax({
                                url: domains.sns + "/answer_question/question/del",
                                type: "get",
                                dataType: "json",
                                data: postData,
                                success: function (data) {
                                    if (data.success) {
                                        window.location.href = "http://sns.tcsh.me/answer_question/question/getallquestion?" + $.param({
                                            hostId: data.success.hostId,
                                            page: data.success.page
                                        });
                                        self.close();
                                    }
                                },
                                error: function () {
                                    alert("系统繁忙，请稍后再试！");
                                }
                            });
                            return false;
                        });
                    }
                });
                $this.data("thisBox", _thisBox);
            };
            _thisBox.show();
            return false;
        });

        // 编辑问答
        $page.on("click", ".editor", function () {
            var $this = $(this),
				_thisBox = $this.data("thisBox")
            ;
            if (!_thisBox) {
                _thisBox = inquire.EditAsk({
                    titleText: "编辑提问",
                    callback: function (editor) {
                        var $left = $this.closest(".main_left"),
							_title = $left.find(".titleCon").html(),
							_content = $left.find(".ques_content").html(),
							self = this
                        ;
                        editor.setContent(_content);
                        this.wmBox.find(".title").val(_title);
                        this.wmBox.find(".sure_btn").on("click", function () {
                            var _this = $(this),
								_title = _this.closest(".alert_box").find(".title"),
								integration = _this.closest(".alert_box").find(".integral")
                            ;
                            if (_title.val() && editor.getContent()) {
                                modules.EditorIask({
                                    hostId: global_setting.hostId,
                                    questionId: global_setting.questionId,
                                    title: _title.val(),
                                    content: lazyload.decoding(editor.getContent()),
                                    integration: integration.val() || 0,
                                    success: function () {
                                        self.hide();
                                        window.location.reload();
                                    },
                                    error: function () {
                                        alert("系统繁忙，请稍后再试！");
                                    }
                                });
                            } else {
                                alert("请完善填写！");
                            }
                            return false;
                        });
                    }
                });
            }
            _thisBox.show();
            return false;
        });
        //邀请好友回答
        $page.on("click", ".invite_ans", function () {
            var $this = $(this),
				_thisBox = $this.data("thisBox")
            ;
            if (!_thisBox) {
                _thisBox = friends.userFriendBox({
                    sure: function (data) {
                        var self = this;
                        if (data.ids.length) {
                            $.ajax({
                                url: domains.api2 + "/dialogue/send.json",
                                type: "get",
                                dataType: "jsonp",
                                data: {
                                    receiverIds: JSON.stringify(data.ids),
                                    questionId: global_setting.questionId
                                },
                                success: function () {
                                    self.close();
                                },
                                error: function () {
                                    alert("系统繁忙，请稍后再试！");
                                }
                            });
                        } else {
                            alert("请先选择好友！");
                        }
                    }
                });
                $this.data("thisBox", _thisBox)
            };
            _thisBox.show();
            return false;
        });

        // mark
        $page.on("click", ".mark", function () {
            var $this = $(this),
				$num = $this.find(".mark_number"),
				_num = parseInt($num.text())
            ;
            if (!$this.hasClass("already_mark")) {
                $.ajax({
                    url: domains.sns + "/answer_question/mark/a",
                    type: "get",
                    dataType: "jsonp",
                    data: {
                        questionId: global_setting.questionId
                    },
                    success: function () {
                        $this.addClass("already_mark");
                        $num.empty().append(_num + 1);
                    },
                    error: function () {
                        alert("系统繁忙，请稍后再试！");
                    }
                });
            };
            return false;
        });

        // 回答
        $page.on("click", ".answer_btn", function () {
            var $this = $(this),
				$body = $("body"),
				$Ianswer = $page.find(".Ianswer"),
				_ansHeight
            ;
            _ansHeight = $Ianswer.offset().top;
            $body.animate({
                scrollTop: _ansHeight - 30
            }, 500);

            return false;
        });

        // 赞
        $page.on("click", ".zan", function () {
            var $this = $(this);
            zan.Zan({
                cls: $this,
                user_name: lib.cookie("wm.user.username"),
                user_id: lib.cookie("wm.user.id"),
                answer_id: $this.closest(".ans_infor_item").attr("data_id") || $this.closest(".sns_data_item").attr("answer_id")
            });
            return false;
        });

        // 采纳
        $page.on("click", ".adopt", function () {
            var $this = $(this);
            $.ajax({
                url: domains.sns + "/answer_question/question/adoption",
                type: "get",
                dataType: "json",
                data: {
                    answerId: $this.closest(".ans_infor_item").attr("data_id"),
                    questionId: global_setting.questionId
                },
                success: function () {
                    window.location.reload();
                },
                error: function () {
                    alert("系统繁忙，请稍候再试！");
                }
            });
            return false;
        });

        // 推荐商品
        var _recommend = [
			'<ul class="recommend_list">',
				'<li class="recommend_item error_tip"><span class="iconfont">&#xf00b6;</span>提示错误的信息将不被提交！</li>',
				'<li class="recommend_item"><span class="wm_ico"></span><label for="">链接一：</label><input type="text" class="recommend_txt" value="" /></li>',
				'<li class="recommend_item"><span class="wm_ico"></span><label for="">链接二：</label><input type="text" class="recommend_txt" value="" /></li>',
				'<li class="recommend_item"><span class="wm_ico"></span><label for="">链接三：</label><input type="text" class="recommend_txt" value="" /></li>',
				'<li class="recommend_item"><span class="wm_ico"></span><label for="">链接四：</label><input type="text" class="recommend_txt" value="" /></li>',
				'<li class="recommend_item recommend_btns"><a href="#" class="sure_btn">确定</a><a href="#" class="close">取消</a></li>',
			'</ul>'
        ].join('');
        $page.on("click", ".recommend", function () {
            var $this = $(this),
				_thisBox = $this.data("thisBox")
            ;
            if (!_thisBox) {
                _thisBox = box.relyBox({
                    rely: $this,
                    boxCls: "recommend_box",
                    content: _recommend,
                    callback: function () {
                        var self = this;
                        this.wmBox.find(".wmBox-botton").remove();

                        // 验证url是否能取到图片
                        this.wmBox.find(".recommend_txt").on("change", function () {
                            var $this = $(this);
                            $this.siblings(".wm_ico").addClass("loading18_18_1");
                            $.ajax({
                                url: domains.api2 + "/product/getimg.json",
                                type: "get",
                                dataType: "jsonp",
                                timeout: 3000,
                                data: {
                                    num: 1, // -1 获取全部图片，1 获取一张图片
                                    url: encodeURIComponent($this.val())
                                },
                                success: function (data) {
                                    if (data && data.length) {
                                        $this.siblings(".wm_ico").attr("class", "wm_ico hook2");
                                    } else {
                                        $this.siblings(".wm_ico").attr("class", "wm_ico fork2");
                                    }
                                },
                                error: function () {
                                    $this.siblings(".wm_ico").attr("class", "wm_ico fork2");
                                }
                            });
                        });

                        // 确定
                        this.wmBox.find(".sure_btn").on("click", function () {
                            var $this = $(this),
								$list = $this.closest(".recommend_list"),
								$txt = $list.find(".recommend_txt")
                            ;
                            self.hide();
                            return false;
                        });

                        // 取消
                        this.wmBox.find(".close").on("click", function () {
                            var _this = $(this),
								_txt = _this.closest(".recommend_list").find(".recommend_txt")
                            ;
                            _txt.val("");
                            self.hide();
                            return false;
                        });
                    }
                });
                $this.data("thisBox", _thisBox);
            };
            _thisBox.show();
            return false;
        });

    };

    init();

})