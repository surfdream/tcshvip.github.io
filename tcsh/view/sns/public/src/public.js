define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
		box = require("http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js"),
		juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
		tips = require("http://s.tcsh.me/tcsh/model/wmtips/dist/wmtips.js"),
		lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js'),
		page = require("http://s.tcsh.me/tcsh/model/wmpage/dist/wmpage.js"),
		forimg = require("http://s.tcsh.me/tcsh/model/wmforimg/dist/forimg.js"),
		verification = require("http://s.tcsh.me/tcsh/model/wmverification/dist/wmverification.js"),
		top_data = require('http://s.tcsh.me/tcsh/view/ago/public/wm_top_data/dist/top_data.js'),
		module_juicer = require("http://s.tcsh.me/tcsh/view/sns/public/wm_sns_juicer/dist/module_juicer.js"),
		modules = require("http://s.tcsh.me/tcsh/view/sns/public/wm_sns_juicer/dist/modules.js"),
		inquire = require('http://s.tcsh.me/tcsh/view/sns/public/wm_inquire/dist/inquire.js'),
		lazyload = require('http://s.tcsh.me/tcsh/model/wmlazyload/dist/wmlazyload.js'),
		friends = require('http://s.tcsh.me/tcsh/view/sns/public/wm_friends/dist/friends_relation.js')
    ;
    var editor = new UE.ui.Editor();
    var init = function () {
        var $page = $("#page"),
			$main_right = $page.find(".main_right")
        ;
        //window.document.domain = "tcsh.me";
        top_data();

        module_juicer.ownerHtml(function (_html) {
            $page.find(".owner_content").empty().append(_html);
        });

        /*global_setting.isOtherShare && module_juicer.othershareHtml(function(_html){
			$main_right.append(_html);		
		})*/
        global_setting.isDiscover && module_juicer.discoverHtml(function (_html) {
            $main_right.append(_html);
        });
        global_setting.isDiscover && module_juicer.discoverData();
        module_juicer.handpickHtml(function (_html) {
            $main_right.append(_html);
            // 精选图片滚动
            if ($page.find(".slide").length) {
                new forimg.Slide({
                    forImgBoxEle: '.handpick',
                    forImgBoxListEle: ".slideCon",
                    forImgItemEle: ".slide_item",
                    callback: function () {
                        var _this = this,
							i = this.forImgItem.length,
							$handpick = this.forImgBox.closest(".handpick"),
							$now = $handpick.find(".handpick_btn .now")
                        ;
                        $handpick.find(".img_num").empty().append(i);
                        if (i <= 1) {
                            $handpick.find(".iconfont").css("visibility", "hidden");
                        } else {
                            $handpick.find(".left").on("click", function () {
                                _this.next(function () {
                                    var j = $now.html() - 0 + 1;
                                    $now.html(j > i ? 1 : j);
                                });
                                return false;
                            });
                            $handpick.find(".right").on("click", function () {
                                _this.prev(function () {
                                    var j = $now.html() - 0 - 1;
                                    $now.html(j < 1 ? 3 : j);
                                });
                                return false;
                            });
                            _this.automatic(true, function () {
                                var j = $now.html() - 0 + 1;
                                $now.html(j > i ? 1 : j);
                            });
                        };

                    }
                });
            };
        });

        global_setting.isVisitor && module_juicer.visitorHtml(function (_html) {
            $main_right.append(_html);
        });


        bind();
        $page.find(".change_dis").click();

    };

    var bind = function () {
        var $page = $("#page")
        ;

        $page.on("click", ".change_dis", function () {
            module_juicer.discoverData();
            return false;
        });


        // for IE6
        if ($.browser.msie && $.browser.version == '6.0') {
            //  头部导航下拉
            $page.find(".sns_head_item").hover(function () {
                var $this = $(this);
                $this.siblings(".sns_head_nav").addClass("sns_head_nav_hover");
            }, function () {
                var $this = $(this);
                $this.siblings(".sns_head_nav").removeClass("sns_head_nav_hover");
            });

            // 我喜欢 下拉
            $page.find(".answer_Ilike").hover(function () {
                var $this = $(this);
                $this.find(".anl_con").addClass("anl_con_hover");
            }, function () {
                var $this = $(this);
                $this.find(".anl_con").removeClass("anl_con_hover");
            });
        };

        // 关注好友
        $page.on("click", ".focus", function () {
            var $this = $(this);
            friends.Focus({
                focusCls: $this,
                focus_id: $this.closest(".friend").attr("user_id"),
                success: function () {
                    $this.removeClass("focus").addClass("del_focus").text("取消关注");
                },
                error: function () {
                    alert("系统繁忙，请稍后再试！");
                }
            });
            return false;
        });
        // 取消关注
        $page.on("click", ".del_focus", function () {
            var $this = $(this),
				_arr = []
            ;
            $page.find(".del_focus").each(function () {
                var $this = $(this),
					_id = $this.closest(".friend").attr("user_id")
                ;
                _arr.push(_id);
            });
            //_arr = JSON.stringify(_arr);
            friends.delFocus({
                ids: _arr,
                success: function () {
                    $this.removeClass("del_focus").addClass("focus").text("+ 关注");
                },
                error: function () {
                    alert("系统繁忙，请稍后再试！");
                }
            });
            return false;
        });

        // 向他提问
        var _askHtml = [
			'<div class="alert_box">',
				'<h3 class="alert_box_title">向<span class="session_name">愤怒的屌死</span>提问</h3>',
				'<div class="askTitle"><label for="write_title">标题：</label><input type="text" id="write_title" class="title" /></div>',
				'<div id="myEditor" class="myEditor"></div>',
				'<div class="wmBox_btns">',
					'<a href="#" class="sure_btn">提问</a><a href="#" class="close">取消</a>',
				'</div>',
			'</div>'
        ].join('');
        $page.on("click", ".ask_btn", function () {
            var $this = $(this),
				_thisBox = $this.data("thisBox")
            ;
            if (!_thisBox) {
                _thisBox = box.alert({
                    boxCls: "ask_box",
                    titleText: "提问",
                    content: _askHtml,
                    callback: function () {
                        var self = this,
							_name = $this.closest(".owner").find(".owner_name_con").html()
                        ;
                        this.close = this.hide;
                        this.wmBox.find(".wmBox-botton").remove();
                        this.wmBox.find(".session_name").empty().append(_name);
                        editor.render("myEditor");
                        editor.ready(function () {
                            editor.setHeight(200);
                        });

                        // 提问按钮
                        this.wmBox.find(".sure_btn").on("click", function () {
                            var $this = $(this),
								_title = $this.closest(".alert_box").find(".title")
                            ;
                            if (_title.val() && editor.getContent()) {
                                module.ask({
                                    name: "",
                                    title: "",
                                    question: "",
                                    success: function () { },
                                    error: function () {
                                        alert("系统繁忙，请稍后再试！");
                                    }
                                });
                            } else {
                                alert("请完善填写！");
                            };
                            return false;
                        });

                    }
                });
                $this.data("thisBox", _thisBox);
            };
            _thisBox.show();
            return false;
        });

        // 编写购物经
        $page.on("click", ".write_shop", function () {
            var $this = $(this),
				_thisBox = $this.data("thisBox")
            ;
            if (!_thisBox) {
                _thisBox = inquire.EditShopping({
                    titleText: "编写购物经",
                    callback: function (editor) {
                        var self = this;
                        this.wmBox.find(".sure_btn").on("click", function () {
                            var _this = $(this),
								_title = _this.closest(".alert_box").find(".title")
                            ;
                            if (_title.val() && editor.getContent()) {
                                modules.Iwrite({
                                    hostId: global_setting.hostId,
                                    content: lazyload.coding(editor.getContent()),
                                    title: _title.val(),
                                    img: $(editor.getContent()).find("img:first").attr("src"),
                                    success: function (data) {
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
                $this.data("thisBox", _thisBox);
            }
            _thisBox.show();
            return false;
        });

        // 我要提问
        $page.on("click", ".Iask", function () {
            var $this = $(this),
				_thisBox = $this.data("thisBox")
            ;

            if (!_thisBox) {
                _thisBox = inquire.EditAsk({
                    titleText: "我要提问",
                    callback: function (editor) {
                        var self = this;
                        this.wmBox.find(".sure_btn").on("click", function () {
                            var _this = $(this),
								_title = _this.closest(".alert_box").find(".title"),
								integration = _this.closest(".alert_box").find(".integral")
                            ;
                            if (_title.val() && editor.getContent()) {
                                modules.Iask({
                                    hostId: global_setting.hostId,
                                    content: lazyload.coding(editor.getContent()),
                                    integration: integration.val() || 0,
                                    title: _title.val(),
                                    success: function (data) {
                                        if (data.success) {
                                            self.hide();
                                            window.location.href = "http://sns.tcsh.me/answer_question/question/detail?" + $.param({
                                                userId: data.success.userId,
                                                questionId: data.success.questionId,
                                                hostId: data.success.hostId
                                            });
                                        }
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
                $this.data("thisBox", _thisBox);
            }
            _thisBox.show();
            return false;
        });

        // 喜欢
        $page.on("click", ".like", function () {
            var $this = $(this);
            if ($this.attr("class").indexOf("like_click") > 0) {
                $.ajax({
                    url: domains.sns + "/shop/sns/likeshoppingdetail",
                    type: "get",
                    dataType: "json",
                    data: {
                        shopId: $this.closest(".sns_data_item").attr("data_id"),
                        flag: true
                    },
                    success: function () {
                        $this.removeClass("like_click");
                        window.location.reload();
                    },
                    error: function () {
                        alert("系统繁忙，请稍后再试！");
                    }
                });
            } else {
                $.ajax({
                    url: domains.sns + "/shop/sns/likeshoppingdetail",
                    type: "get",
                    dataType: "json",
                    data: {
                        shopId: $this.closest(".sns_data_item").attr("data_id"),
                        flag: false
                    },
                    success: function () {
                        $this.addClass("like_click");
                        window.location.reload();
                    },
                    error: function () {
                        alert("系统繁忙，请稍后再试！");
                    }
                });
            };
            return false;
        });

    };

    init();

})