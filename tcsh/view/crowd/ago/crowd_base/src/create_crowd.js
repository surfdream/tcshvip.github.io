define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require("jquery"),
		box = require("wmbox"),
        crowd_type = require("crowd_type"),
		juicer = require("juicer"),
		lib = require("lib"),
        upload = require('wmupload'),
        verification = require("wmverification"),
        friend = require("friend")
    ;
    var _postData = {};
    var init = function () {
        verification.init($(".create_crowd"));
        verification.addRule([
            {
                key: "crowd_type",
                fun: function () {
                    return !!(_postData.protagonistId - 0);
                }
            },
            {
                key: "crowd_face",
                fun: function () {
                    return $(".group_face_img").attr("src") !== "http://s.tcsh.me/tcsh/view/public/img/pit.png";
                }
            }
        ]);
        bind();
    };

    var bind = function () {
        var $page = $("#page"),
            $create_crowd = $page.find(".create_crowd"),
            $tag_list = $page.find(".tag_list"),
            $friend_list = $page.find(".friend_list"),
            $custom_tag_val = $page.find(".custom_tag_val"),
            $group_face_img = $page.find(".group_face_img");
        var _group_face_box = juicer([
            '<div class="group_face_main sys">',
                '<div class="group_face_type">',
                    '<a href="#" class="curr changetype" data_type="sys">经典社徽</a>|<a href="#" class="changetype" data_type="custom">自定义社徽</a>',
                '</div>',
                '<div class="preview">',
                    '<ul class="preview_list">',
                        '<li class="preview_item"><span class="img_bg p80_80"><img src="http://s.tcsh.me/tcsh/view/public/img/pit.png"></span><p class="remark">80 * 80</p></li>',
                        '<li class="preview_item"><span class="img_bg p60_60"><img src="http://s.tcsh.me/tcsh/view/public/img/pit.png"></span><p class="remark">60 * 60</p></li>',
                    '</ul>',
                '</div>',
                '<div class="sys">',
                    '<ul class="sys_face_list"></ul>',
                '</div>',
                '<div class="custom">',
                    '<div class="img_bg">',
                        '<span class="iconfont up_bg">&#xf00f7;</span>',
                        '<img src="http://s.tcsh.me/tcsh/view/public/img/pit.png">',
                        '<input type="file" class="upface" />',
                    '</div>',
                    '<div class="msg">',
                        '<p>你上传的图片将会自动生成2种尺寸图片，最好上传原始图片，避免图片不清晰。</p>',
                        '<p style="color:#999">（仅支持JPG,PNG,GIF,格式图片,最好小于1M）</p>',
                    '</div>',
                '</div>',
                '<div class="btns">',
                    '<a href="#" class="ui_btn ui_btn_h26blue2 submit"><span class="ui_btn_txt">确定</span></a>',
                    '<a href="#" class="ui_btn ui_btn_h26white6 close"><span class="ui_btn_txt">取消</span></a>',
                '</div>',
            '</div>'
        ].join(''));
        var addUser = function (data) {
            var _html = [];
            for (var i in data) {
                if (!$page.find(".friend_item[data_id='" + data[i].id + "']").length) {
                    _html.push('<li class="friend_item" data_id="' + data[i].id + '" data_name="' + data[i].name + '">' + data[i].name + '<a class="wm_ico fork2  remove_friend" href="#"></a></li>');
                }
            }
            $friend_list.prepend(_html.join(''));
        };
        //选择社团类型
        $page.on("click", ".chk_type_box", function () {
            var $this = $(this),
                typeBox = $this.data("typeBox");
            if (!typeBox) {
                typeBox = crowd_type.showBox({
                    submit: function (data) {
                        this.close();
                        $this.find(".title_box").empty().append(data.protagonist.name);
                        $page.find(".supporting_main").empty().append(data.supportingNames.join(','));
                        _postData.protagonistId = data.protagonist.id;
                        _postData.protagonistName = data.protagonist.name;
                        _postData.supportingNames = data.supportingNames;
                        _postData.supportingIds = data.supportingIds;
                        verification.verify($this.closest(".form_row"));
                    }
                });
                $this.data("typeBox", typeBox);
            }
            typeBox.show();
            return false;
        });
        //设置社徽
        $page.on("click", ".group_face", function () {
            var $this = $(this),
                setFace = $this.data("setFace");
            if (!setFace) {
                setFace = box.alert({
                    boxCls: 'crowd_box group_face_box',
                    titleText: '我的社徽',
                    content: _group_face_box.render({}),
                    btns: [],
                    callback: function () {
                        var self = this;
                        this.close = this.hide;
                        var $group_face_main = this.wmBox.find(".group_face_main"),
                            $sys_face_list = $group_face_main.find(".sys_face_list"),
                            $group_face_type = this.wmBox.find(".group_face_type"),
                            $preview = this.wmBox.find(".preview");
                        $.ajax({
                            url: domains.commune + "/commune/get/iconlist.json",
                            dataType: "json",
                            data: {},
                            success: function (data) {
                                var _arr = [];
                                if (data.success) {
                                    for (var i in data.success) {
                                        _arr.push('<li><span class="img_bg"><img src="' + data.success[i] + '"></span></li>');
                                    }
                                    $sys_face_list.empty().append(_arr.join(''));
                                }
                            },
                            error: function () { }
                        });
                        //设置社徽
                        var set_img = function (src) {
                            $preview.find("img").attr("src", src);
                            $group_face_main.attr("data_img", src);
                        };
                        $group_face_img.attr("src") && set_img($group_face_img.attr("src"));
                        //系统社徽选择
                        this.wmBox.on("click", ".sys .img_bg", function () {
                            set_img($(this).find("img").attr("src"));
                            return false;
                        });
                        //类别选项卡切换
                        this.wmBox.on("click", ".changetype", function () {
                            var $this = $(this);
                            $group_face_type.find(".curr").removeClass("curr");
                            $group_face_main.attr("class", "group_face_main " + $this.attr("data_type"));
                            $this.addClass("curr");
                            return false;
                        });
                        //确认
                        this.wmBox.on("click", ".submit", function () {
                            var _src = $group_face_main.attr("data_img");
                            _src && $group_face_img.attr("src", _src);
                            self.close();
                            verification.verify($this.closest(".form_row"));
                            return false;
                        });

                        this.wmBox.find(".upface").on("change", function () {
                            upload.upload($(this), function (data) {
                                if (data.response) {
                                    set_img(data.response.imgurl);
                                    this.closest(".img_bg").find("img").attr("src", data.response.imgurl);
                                }
                            });
                        });
                    }
                });
                $this.data("setFace", setFace);
            }
            setFace.show();
            return false;
        });
        //自动获取标签
        $page.on("click", ".create_tag", function () {
            var _tag_list = [], i;

            var _crowd_name = $.trim($page.find(".crowd_name").val()).split(' ');
            for (i in _crowd_name) {
                _crowd_name[i].length && _crowd_name[i].length >= 2 && _crowd_name[i].length <= 8 && _tag_list.push('<li class="tag_item" data_name="' + _crowd_name[i] + '">' + _crowd_name[i] + '<a class="wm_ico fork2  remove_tag" href="#"></a></li>');
            }
            for (i in _postData.supportingNames) {
                _tag_list.push('<li class="tag_item" data_name="' + _postData.supportingNames[i] + '">' + _postData.supportingNames[i] + '<a class="wm_ico fork2  remove_tag" href="#"></a></li>');
            }
            $tag_list.find(".tag_item:not(.no_remove)").remove();
            $tag_list.prepend(_tag_list.join(''));
            return false;
        });
        //删除标签
        $page.on("click", ".remove_tag", function () {
            $(this).closest(".tag_item").fadeOut(function () {
                $(this).remove();
            });
            return false;
        });
        //添加自定义标签
        $page.on("click", ".add_custom_tag", function () {
            var _v = $.trim($custom_tag_val.val());
            if (_v && _v.length >= 2 && _v.length <= 8) {
                $tag_list.prepend('<li class="tag_item no_remove" data_name="' + _v + '">' + _v + '<a class="wm_ico fork2  remove_tag" href="#"></a></li>');
                $custom_tag_val.val('');
            } else {
                lib.BGShine({
                    ele: $custom_tag_val,
                    original_color: "#fff",
                    change_color: "#ff6363",
                    frequency: 3
                });
            }
            return false;
        });
        //好友弹窗
        $page.on("click", ".friend_box", function () {
            var $this = $(this),
              friend_box = $this.data("friend_box");
            if (!friend_box) {
                friend_box = friend.userFriendBox({
                    boxCls: "crowd_box",
                    sure: function (data) {
                        this.close();
                        addUser(data.dataList);
                    }
                });
                $this.data("friend_box", friend_box);
            }
            friend_box.show();
            return false;
        });
        //添加邀请的陌生人
        $page.on("click", ".add_stranger", function () {
            var $txt_name = $page.find(".stranger_val"),
                _v = $.trim($txt_name.val());
            if (_v) {
                $txt_name.val('');
                //debug
                addUser([{
                    name: _v,
                    id: parseInt(Math.random() * 999) + 999
                }]);
                return false;
                /////////////////
                friend.getFriendData({
                    success: function (data) {
                        if (data.success) {
                            addUser([{
                                name: data.success.userName,
                                id: data.success.userId
                            }]);
                        } else {
                            alert(data.error || "未找到该用户！");
                        }
                    },
                    error: function () {
                        alert("服务器繁忙！");
                    }
                });
            } else {
                lib.BGShine({
                    ele: $txt_name,
                    original_color: "#fff",
                    change_color: "#ff6363",
                    frequency: 3
                });
            }
            return false;
        });
        //删除邀请的好友
        $page.on("click", ".remove_friend", function () {
            $(this).closest(".friend_item").fadeOut(function () {
                $(this).remove();
            });
            return false;
        });
        //提交
        $page.on("click", ".submit", function () {
            var _tag_list = [], _friend_list = [], submit_ing;
            if (verification.verify($create_crowd)) {
                submit_ing = box.invBox({
                    boxCls: "submit_ing",
                    content: [
                        '<p class="msg"><i class="wm_ico loading18_18_1" title="" style="margin: 0 10px 0 -16px;"></i>保存中...</p>'
                    ].join(''),
                    btns: []
                });
                $page.find(".tag_item").each(function () {
                    _tag_list.push($(this).attr("data_name"));
                });
                $page.find(".friend_item").each(function () {
                    var $this = $(this);
                    _friend_list.push($this.attr("data_id"));
                    //_friend_list.push({
                    //    id: $this.attr("data_id"),
                    //    name: $this.attr("data_name")
                    //});
                });
                var postData = {
                    //社团名称
                    name: $page.find(".crowd_name").val(),
                    //社团主要类型
                    mainCategory: _postData.protagonistId,
                    mainCategoryName: _postData.protagonistName,
                    //社团次要类型
                    minorCategory: _postData.supportingIds,
                    minorCategoryNames: _postData.supportingNames,
                    //社徽
                    icon: $group_face_img.attr("src"),
                    //社团简介
                    introduction: $page.find(".introduction").val(),
                    //标签
                    tags: _tag_list,
                    //邀请的好友
                    invites: _friend_list
                };
                $.ajax({
                    url: domains.commune + "/asyn/commune/submit_create.json",
                    traditional: true,//此属性军号专用（如果接口换人维护，注意这个属性）
                    type: "post",
                    dataType: "json",
                    data: postData,
                    success: function (data) {
                        submit_ing.close();
                        if (data.response) {
                            box.alert({
                                boxCls: 'crowd_box',
                                content: [
                                    '<div style="width: 580px;text-align: center;line-height: 30px;font-size: 14px;color: #ccc;font-family: Microsoft YaHei;padding: 16px 0; ">',
                                        '<h3 style="font-size: 24px;color: #fc6e51;line-height: 80px;">恭喜你已经成为互动社长！</h3>',
                                        '<p>爱购物，也爱社交</p>',
                                        '<p>爱互动网，更爱互动网的亲们</p>',
                                        '<p>爱耍贫，爱网聚，更爱和同好们分享兴趣</p>',
                                        '<p>我不是基友</p>',
                                        '<p>也不是意见领袖</p>',
                                        '<p>我是互动社员，我和TA一样</p>',
                                        '<p>我是你的新朋旧友</p>',
                                        '<p>分享到：<a href="#" class="iconfont" style="font-size: 24px;padding: 0 10px;text-decoration:none">&#xf01af;</a></p>',
                                    '</div>'
                                ].join(''),
                                btns: []
                            });
                        } else {
                            box.alert({
                                boxCls: 'crowd_box',
                                content: [
                                    '<div style="width: 580px;text-align: center;line-height: 30px;font-size: 14px;color: #ccc;font-family: Microsoft YaHei;padding: 16px 0; ">',
                                        '<h3 style="font-size: 24px;color: #fc6e51;line-height: 80px;">创建失败！</h3>',
                                    '</div>'
                                ].join(''),
                                btns: []
                            });
                        }
                    },
                    error: function () {
                        submit_ing.close();
                        box.alert({
                            boxCls: 'crowd_box',
                            content: [
                                '<div style="width: 580px;text-align: center;line-height: 30px;font-size: 14px;color: #ccc;font-family: Microsoft YaHei;padding: 16px 0; ">',
                                    '<h3 style="font-size: 24px;color: #fc6e51;line-height: 80px;">服务器繁忙！</h3>',
                                '</div>'
                            ].join(''),
                            btns: []
                        });
                    }
                });
            }
            return false;
        });
    };
    init();
});