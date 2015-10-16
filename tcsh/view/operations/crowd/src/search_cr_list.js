define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        crowd_type = require('crowd_type'),
        juicer = require('juicer'),
        box = require('wmbox');
        page = require('wmpage');

    var init = function () {
        var $sel_type = $(".sel_type")
        //var _page = page.Create({
        //    url: global_setting.PageInfo.url || domains.sell + '/product/list',
        //    element: ".wm_page",
        //    index: global_setting.PageInfo.Index,
        //    sum: global_setting.PageInfo.TotalItems,
        //    size: global_setting.PageInfo.Size,
        //    front: true,
        //    pagekey: global_setting.PageInfo.pageKey,
        //    param: global_setting.PageInfo.WhereDic
        //});
        crowd_type.getData({
            success: function (data) {
                var _html = [];
                if (data.response) {
                    for (var i in data.response.data) {
                        _html.push('<optgroup value="' + data.response.data[i].id + '" label="' + data.response.data[i].categoryName + '">');
                        for (var j in data.response.data[i].childs) {
                            _html.push('<option vlaue="' + data.response.data[i].childs[j].id + '">' + data.response.data[i].childs[j].categoryName + '</option>');
                        }
                        _html.push('</optgroup>');
                    }
                    $sel_type.append(_html.join(''));
                }
            }
        });

        bind();

    };
    var bind = function () {
        var $page = $("#page");

        /* 商家列表  */
        var _busiHtml = juicer([
            '<div class="busi_list_con">',
                '<a href="#" class="close"></a>',
                '<h3 class="busi_list_title">商家列表</h3>',
                '<ul class="busi_list_con_sub clearfix">',
                    '{@each success as data}',
                    '<li class="busi_list_item">',
                        '<span class="bli_infor"><a href="#" class="busi_logo"><img src="${data.logo}" /></a></span>',
                        '<span class="bli_infor"><a href="#" class="busi_name">${data.busi_name}</a></span>',
                        '<span class="bli_infor bli_btns clearfix"><a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=2843837976&amp;site=qq&amp;menu=yes" class="contact_method"><img border="0" src="http://wpa.qq.com/pa?p=2:2843837976:51" alt="点击这里给我发消息" title="点击这里给我发消息"><span class="red">${data.service_name}</span></a><a href="#" class="ui_btn ui_btn_h23yellow8 remove_busi"><span class="ui_btn_txt">移除商家</span></a></span>',
                    '</li>',
                    '{@/each}',
                '</ul>',
            '</div>'
        ].join(''));
        var data = {
            success:[
               {
                   logo: "img/1.jpg",
                   busi_name: "盗墓笔记-天真无邪-苏苏盗墓笔记-天真无邪-苏苏",
                   service_name: "佳佳"
               },
               {
                   logo: "img/2.jpg",
                   busi_name: "盗墓笔记-天真无邪-苏苏盗墓笔记-天真无邪-苏苏",
                   service_name: "佳佳"
               },
               {
                   logo: "img/3.jpg",
                   busi_name: "盗墓笔记-天真无邪-苏苏盗墓笔记-天真无邪-苏苏",
                   service_name: "佳佳"
               },
               {
                   logo: "img/4.jpg",
                   busi_name: "盗墓笔记-天真无邪-苏苏盗墓笔记-天真无邪-苏苏",
                   service_name: "佳佳"
               },
               {
                   logo: "img/1.jpg",
                   busi_name: "盗墓笔记-天真无邪-苏苏盗墓笔记-天真无邪-苏苏",
                   service_name: "佳佳"
               },
               {
                   logo: "img/2.jpg",
                   busi_name: "盗墓笔记-天真无邪-苏苏盗墓笔记-天真无邪-苏苏",
                   service_name: "佳佳"
               },
               {
                   logo: "img/3.jpg",
                   busi_name: "盗墓笔记-天真无邪-苏苏盗墓笔记-天真无邪-苏苏",
                   service_name: "佳佳"
               },
               {
                   logo: "img/4.jpg",
                   busi_name: "盗墓笔记-天真无邪-苏苏盗墓笔记-天真无邪-苏苏",
                   service_name: "佳佳"
               },
               {
                   logo: "img/1.jpg",
                   busi_name: "盗墓笔记-天真无邪-苏苏盗墓笔记-天真无邪-苏苏",
                   service_name: "佳佳"
               },
               {
                   logo: "img/2.jpg",
                   busi_name: "盗墓笔记-天真无邪-苏苏盗墓笔记-天真无邪-苏苏",
                   service_name: "佳佳"
               },
               {
                   logo: "img/3.jpg",
                   busi_name: "盗墓笔记-天真无邪-苏苏盗墓笔记-天真无邪-苏苏",
                   service_name: "佳佳"
               },
               {
                   logo: "img/4.jpg",
                   busi_name: "盗墓笔记-天真无邪-苏苏盗墓笔记-天真无邪-苏苏",
                   service_name: "佳佳"
               },
               {
                   logo: "img/3.jpg",
                   busi_name: "盗墓笔记-天真无邪-苏苏盗墓笔记-天真无邪-苏苏",
                   service_name: "佳佳"
               },
               {
                   logo: "img/4.jpg",
                   busi_name: "盗墓笔记-天真无邪-苏苏盗墓笔记-天真无邪-苏苏",
                   service_name: "佳佳"
               }
            ]
        };
        var busiData = _busiHtml.render(data);
        $page.on("click", ".busi_list", function () {
            var $this = $(this),
                _thisBox = $this.data("thisBox")    
            ;
            if (!_thisBox) {
                _thisBox = box.invBox({
                    boxCls: "busi_list_box",
                    content: busiData,
                    callback: function () {
                        var self = this;
                        this.close = this.hide;
                        this.wmBox.on("click", ".remove_busi", function () {
                            var _this = $(this);
                            _this.closest(".busi_list_item").fadeOut();
                            return false;
                        });
                    }
                });
                $this.data("thisBox", _thisBox);
            };
            _thisBox.show();
            return false;
        });


        /* 委派社长  */
        var _masterHtml = juicer([
            '<div class="appoint_master_con">',
                '<a href="#" class="close fork"></a>',
                '<h3 class="appoint_master_title">社员列表</h3>',
                '<ul class="member_list">',
                    '{@each lists as list}',
                    '<li class="member_item" data_id="1">',
                        '<a href="#"><img src="${list.headImg}" class="user_img"></a>',
                        '<div class="user_data">',
                            '<a href="#" class="user_name">${list.user_name}</a>',
                            '<p class="data_item join_time">${list.join_date}</p>',
                            '<p class="data_item">活跃度：<b>${list.active}</b></p>',
                        '</div>',
                    '</li>',
                    '{@/each}',
                '</ul>',
                '<div class="box_btns"><a href="#" class="sure_btn">确定</a><a href="#" class="close">取消</a></div>',
            '</div>'
        ].join(''));
        var data = {
            lists: [
                {
                    headImg: "img/head.jpg",
                    user_name: "徐军浩徐军浩徐军浩徐军浩徐军浩",
                    join_date: "2014-11-11",
                    active:"6789"
                },
                {
                    headImg: "img/head.jpg",
                    user_name: "徐军浩徐军浩徐军浩徐军浩徐军浩",
                    join_date: "2014-11-11",
                    active: "6789"
                },
                {
                    headImg: "img/head.jpg",
                    user_name: "徐军浩徐军浩徐军浩徐军浩徐军浩",
                    join_date: "2014-11-11",
                    active: "6789"
                },
                {
                    headImg: "img/head.jpg",
                    user_name: "徐军浩徐军浩徐军浩徐军浩徐军浩",
                    join_date: "2014-11-11",
                    active: "6789"
                },
                {
                    headImg: "img/head.jpg",
                    user_name: "徐军浩徐军浩徐军浩徐军浩徐军浩",
                    join_date: "2014-11-11",
                    active: "6789"
                },
                {
                    headImg: "img/head.jpg",
                    user_name: "徐军浩徐军浩徐军浩徐军浩徐军浩",
                    join_date: "2014-11-11",
                    active: "6789"
                },
                {
                    headImg: "img/head.jpg",
                    user_name: "徐军浩徐军浩徐军浩徐军浩徐军浩",
                    join_date: "2014-11-11",
                    active: "6789"
                },
                {
                    headImg: "img/head.jpg",
                    user_name: "徐军浩徐军浩徐军浩徐军浩徐军浩",
                    join_date: "2014-11-11",
                    active: "6789"
                },
                {
                    headImg: "img/head.jpg",
                    user_name: "徐军浩徐军浩徐军浩徐军浩徐军浩",
                    join_date: "2014-11-11",
                    active: "6789"
                },
                {
                    headImg: "img/head.jpg",
                    user_name: "徐军浩徐军浩徐军浩徐军浩徐军浩",
                    join_date: "2014-11-11",
                    active: "6789"
                },
                {
                    headImg: "img/head.jpg",
                    user_name: "徐军浩徐军浩徐军浩徐军浩徐军浩",
                    join_date: "2014-11-11",
                    active: "6789"
                },
                {
                    headImg: "img/head.jpg",
                    user_name: "徐军浩徐军浩徐军浩徐军浩徐军浩",
                    join_date: "2014-11-11",
                    active: "6789"
                }
            ]
        };
        var masterData = _masterHtml.render(data);
        $page.on("click", ".appoint_master", function () {
            var $this = $(this),
                _thisBox = $this.data("thisBox")    
            ;
            if (!_thisBox) {
                _thisBox = box.invBox({
                    boxCls: "appoint_master_box",
                    content: masterData,
                    callback: function () {
                        var self = this;
                        this.close = this.hide;
                        this.wmBox.on("click", ".member_item", function () {
                            var _this = $(this),
                                 $member_list = _this.closest(".member_list")
                            ;
                            $member_list.find(".member_item").removeClass("member_item_hover");
                            _this.addClass("member_item_hover");

                        });
                        this.wmBox.on("click", ".sure_btn", function () {
                            var _this = $(this),
                                $member_item = _this.closest(".appoint_master_con").find(".member_item")
                            ;
                            if (_this.closest(".appoint_master_con").find(".member_item_hover").length) {
                                $.ajax({
                                    url: "",
                                    type: "get",
                                    dataType: "json",
                                    data: {
                                        id: $member_item.attr("data_id")
                                    },
                                    success: function () { },
                                    error: function () {
                                        self.close();
                                    }
                                });
                            } else {
                                alert("请先选择！");
                            };

                            return false;
                        })
                    }
                });
            };
            _thisBox.show();
            return false;
        });

    };
    init();
});
