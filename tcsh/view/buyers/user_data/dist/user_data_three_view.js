define(function (require, exports, module) {
    //http://s.wumeiwang.com/search/product/by_class/show_batch
    //替换
    //domains.api2+"/search/product/by_class/show_batch.json"
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        juicer = require("juicer"),
        lib = require("lib"),
        verification = require("verification"),
        tip = require("wmtips"),
        forimg = require("wmforimg"),
        firend = require("friend");
    var $page = $("#page"),
        $add_tag_box = $page.find(".add_tag_box"),
        $tag_type = $add_tag_box.find(".tag_type"),
        $tag_list = $add_tag_box.find(".tag_list"),
        $mood_list = $page.find(".mood_list");
    var initTagList = function () {
        $.ajax({
            url: "",
            type: "get",
            dataType: "jsonp",
            data: {},
            success: function () { },
            error: function () {
                var data = {
                    id: "1",
                    title: "程序猿",
                    tagList: [
                        {
                            id: "1",
                            name: "JavaScript"
                        },
                        {
                            id: "2",
                            name: "HTML"
                        },
                        {
                            id: "3",
                            name: "Css"
                        }
                    ]
                };
                $tag_type.empty().append('<a href="#" class="get_next" data_id="' + data.id + '">换一批</a>' + data.title);
                $tag_list.empty();
                for (var i in data.tagList) {
                    $tag_list.append('<a href="#" class="tag_item" data_id="' + data.tagList[i].id + '" data_name="' + data.tagList[i].name + '">' + data.tagList[i].name + '</a>');
                }
            }
        });
    };
    var _getUserMoodList = function () {
        firend.getUserMoodList({
            success: function (data) {
                var _arr = [], _date;
                $mood_list.empty();
                if (data.success && data.success.length) {
                    for (var i in data.success) {
                        _date = new Date(data.success[i].createTime.time);
                        _arr.push('<li data_id="' + data.success[i].id + '"><span class="mood_date">' + (_date.getFullYear() + "-" + (_date.getMonth() - 0 + 1) + "-" + _date.getDate()) + '</span><p>' + data.success[i].mood + '</p></li>');
                    }
                    $mood_list.append(_arr.join(''))
                } else {
                    $mood_list.append('<li style="text-align: center;font-size: 24px;width: 600px;"><i class="iconfont" style="font-size: 34px;margin-right: 18px;">&#xf0132;</i>还未发表过。</li>');
                }
            },
            error: function () {

            }
        });
    };
    var init = function () {
        _getUserMoodList();
        verification.setTipSkin("white1").setOffSet({
            top: 6,
            left: 15
        });
        new forimg.Slide({
            forImgBoxEle: ".shopping_statistics",
            forImgBoxListEle: ".ss_list",
            forImgItemEle: ".ss_item",
            interval: 1000,
            callback: function () {
                var self = this;
                this.forImgBox.on("click", ".to_next", function () {
                    self.next();
                    return false;
                });
                this.forImgBox.on("click", ".to_prev", function () {
                    self.prev();
                    return false;
                });
            }
        });
        bind();
        initTagList();
    };
    var bind = function () {
        var $page = $("#page"),
            $ss_sub_box = $page.find(".ss_sub_box"),
            $add_tag_box = $page.find(".add_tag_box"),
            $my_tag = $page.find(".my_tag"),
            $add_tag = $my_tag.find(".add_tag"),
            $tag_txt = $add_tag_box.find(".tag_txt");
        var _ssSubBoxHtml = juicer([
            '<div class="ss_sub_remark">',
                '<span class="ss_sub_remark_title">${name}：</span>',
                '<ul>',
                    '{@each strong_recommend as sr}',
                        '<li><a href="http://s.wumeiwang.com/list/${sr.id}.html"  target="_blank">${sr.name}</a></li>',
                    '{@/each}',
                '</ul>',
            '</div>',
            '<div class="ss_recommend_con">',
                '<a href="#" class="change_data"><i class="iconfont">&#xf015c;</i>换一拨</a>',
                '<ul class="ss_recommend_type">',
                    '{@each recommendList as item}',
                    '<li>',
                        '<a href="#" class="ssrt_key" data_id="${item.id}" data_ids="${item.ids}">${item.name}</a>',
                    '</li>',
                    '{@/each}',
                '</ul>',
                '<ul class="ss_recommend_list">',
                '</ul>',
            '</div>'
        ].join(''));
        var addMyTag = function (_id, _name) {
            var $thisTag;
            if ($my_tag.find(".no_tag").length) {
                $my_tag.empty().append('<a href="#" class="add_tag">添加标签</a>');
                $add_tag = $my_tag.find(".add_tag");
            }
            $thisTag = $my_tag.find(".tag_item[data_id='" + _id + "']");
            if (!$thisTag.length) {
                $add_tag.before('<span class="tag_item" data_id="' + _id + '">' + _name + '<a href="#" class="wm_ico fork2 remove_tag_item" data_id="' + _id + '"></a></span>');
            }
            else {
                lib.BGShine({
                    ele: $thisTag,
                    original_color: "#fff6b3",
                    change_color: "#ffdd3d",
                    frequency: 3
                });
            }
        };
        //购物观商品获取
        var appendComm = function (random) {
            var $this = $(this),
                _ids = $this.attr("data_ids"),
                $ss_recommend_type = $ss_sub_box.find(".ss_recommend_type"),
                $ss_recommend_list = $ss_sub_box.find(".ss_recommend_list");
            $ss_recommend_type.find(".curr").removeClass("curr");
            $this.addClass("curr");
            $ss_recommend_list.empty();
            $.ajax({
                url: "http://s.wumeiwang.com/search/product/by_class/show_batch",
                type: "get",
                dataType: "jsonp",
                data: {
                    category_ids: _ids,
                    random: random,//0表示固定，大于0表示随机
                    count: 10//个数
                },
                success: function (data) {
                    var _arr = [];
                    if (data && data.length) {
                        for (var i in data) {
                            _arr.push('<li><a href="'+domains.item+'/' + data[i].id + '.html" target="_blank"><img src="' + data[i].pic + '" /><span class="commodity_name">' + data[i].product_name + '</span></a></li>');
                        }
                        $ss_recommend_list.append(_arr.join(''))
                    }
                },
                error: function () {
                    var data = [
                            {
                                id: 0,
                                product_name: "暂无数据",
                                pic: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png"
                            },
                            {
                                id: 0,
                                product_name: "暂无数据",
                                pic: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png"
                            },
                            {
                                id: 0,
                                product_name: "暂无数据",
                                pic: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png"
                            },
                            {
                                id: 0,
                                product_name: "暂无数据",
                                pic: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png"
                            },
                            {
                                id: 0,
                                product_name: "暂无数据",
                                pic: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png"
                            },
                            {
                                id: 0,
                                product_name: "暂无数据",
                                pic: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png"
                            },
                            {
                                id: 0,
                                product_name: "暂无数据",
                                pic: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png"
                            },
                            {
                                id: 0,
                                product_name: "暂无数据",
                                pic: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png"
                            },
                            {
                                id: 0,
                                product_name: "暂无数据",
                                pic: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png"
                            },
                            {
                                id: 0,
                                product_name: "暂无数据",
                                pic: "http://s.tcsh.me/tcsh/view/public/img/img404_1.png"
                            }
                    ];
                    var _arr = [];
                    if (data && data.length) {
                        for (var i in data) {
                            _arr.push('<li><a href="'+domains.item+'/' + data[i].id + '.html" target="_blank"><img src="' + data[i].pic + '" /><span class="commodity_name">' + data[i].product_name + '</span></a></li>');
                        }
                        $ss_recommend_list.append(_arr.join(''))
                    }


                }
            });
        };
        //防重复发送
        $page.on("click", ".savemood_in", function () {
            return false;
        });
        //心情框效果
        $page.on("focus", ".mood", function () {
            var $this = $(this);
            $this.addClass("animate_mood");
            verification.hideTips($this.closest(".mood_box"))
        });
        $page.on("blur", ".mood", function () {
            var $this = $(this);
            setTimeout(function () {
                $this.removeClass("animate_mood");
            }, 100);
            $this.scrollTop(0);
        });
        $page.on("keydown", ".mood", function (e) {
            e.ctrlKey && e.keyCode === 13 && $page.find(".savemood").click();
        });
        //发送心情
        $page.on("click", ".savemood:not(.savemood_in)", function () {
            var $this = $(this),
                $mood = $page.find(".mood"),
                _v = $.trim($mood.val()),
                errorTips;
            if (_v) {
                $this.addClass("savemood_in");
                $this.empty().append('<i class="iconfont">&#xf0024;</i>发表中......');
                firend.sendMood({
                    mood: _v,
                    success: function (data) {
                        if (data.success) {
                            _getUserMoodList();
                            $mood.val('');
                        } else {

                        }
                        $this.removeClass("savemood_in");
                        $this.empty().append('<i class="iconfont">&#xf0024;</i>发表');
                    },
                    error: function () {
                        errorTips = $this.data("errorBox");
                        if (!errorTips) {
                            errorTips = new tip({
                                ele: $this,
                                con: 'asd',
                                skin: 'white1',
                                close: 3000,
                                direction: "lt"
                            });
                            $this.data("errorBox", errorTips);
                        }
                        errorTips.show();
                    }
                });
            } else {
                lib.BGShine({
                    ele: $mood,
                    original_color: "#fff",
                    change_color: "#ff6363",
                    frequency: 3
                });

            }
            return false;
        });
        //购物观推荐获取
        $page.on("click", ".ss_item_con", function () {
            var $this = $(this),
                _id = $this.attr("data_id"),
                _name = $this.attr("data_name");
            $.ajax({
                url: domains.www+"/shoppoint/get/" + _id,
                type: "get",
                dataType: "jsonp",
                data: {},
                success: function (data) {
                    if (data.success) {
                        $ss_sub_box.empty().append(_ssSubBoxHtml.render(data.success));
                        $ss_sub_box.find(".ssrt_key:eq(0)").click();
                    } else {

                    }
                },
                error: function () {
                    var data = {
                        name: _name,
                        strong_recommend: [{ "id": "150701", "name": "火腿肠" }, { "id": "150702", "name": "方便饭" }, { "id": "150703", "name": "罐头" }, { "id": "150701", "name": "火腿肠" }, { "id": "150702", "name": "方便饭" }, { "id": "150703", "name": "罐头" }],
                        recommendList: [
                            { id: "1", name: "生鲜", ids: "100509" },
                            { id: "2", name: "飞禽", ids: "100509" },
                            { id: "3", name: "走兽", ids: "100509" },
                            { id: "4", name: "蔬菜", ids: "100509" },
                            { id: "5", name: "瓜果", ids: "100509" }
                        ]
                    };
                    $ss_sub_box.empty().append(_ssSubBoxHtml.render(data));
                    $ss_sub_box.find(".ssrt_key:eq(0)").click();
                }
            });
            return false;
        });
        //购物观下级推荐获取
        $page.on("click", ".ssrt_key", function () {
            if (!$(this).hasClass("curr")) {
                appendComm.call(this, 0);
            }
            return false;
        });
        //购物观换一拨
        $page.on("click", ".change_data", function () {
            appendComm.call($ss_sub_box.find(".curr"), 1);
            return false;
        });
        //世界观显示全部数据
        $page.on("click", ".show_sub_data", function () {
            var $this = $(this),
                $worldview_item = $this.closest(".worldview_item");
            $worldview_item.addClass("showdata_list");
            $this.attr("class", "iconfont hide_sub_data").empty().append('&#xf00ea;')
            return false;
        });
        //世界观隐藏详细信息
        $page.on("click", ".hide_sub_data", function () {
            var $this = $(this),
                $worldview_item = $this.closest(".worldview_item");
            $worldview_item.removeClass("showdata_list");
            $this.attr("class", "iconfont show_sub_data").empty().append('&#xf00e9;')
            return false;
        });
        //添加标签
        $page.on("click", ".add_tag", function () {
            $add_tag_box.toggleClass("add_tag_box_show");
            return false;
        });
        //关闭添加标签框
        $page.on("click", ".close_tag_box", function () {
            $add_tag_box.removeClass("add_tag_box_show");
            return false;
        });
        //标签换一拨
        $page.on("click", ".get_next", function () {
            initTagList();
            return false;
        });
        //选择标签
        $page.on("click", ".tag_item", function () {
            var $this = $(this),
                _id = $this.attr("data_id"),
                _name = $this.attr("data_name");
            addMyTag(_id, _name);
            return false;
        });
        //添加自定义标签
        $page.on("click", ".add_new_tag", function () {
            var _v = $.trim($tag_txt.val());
            if (_v) {
                $.ajax({
                    url: "",
                    type: "get",
                    dataType: "jsonp",
                    data: {},
                    success: function () { },
                    error: function () {
                        var data = {
                            success: {
                                id: 1,
                                name: _v
                            }
                        }
                        if (data && data.success) {
                            addMyTag(data.success.id, data.success.name);
                            $tag_txt.focus().val('');
                        }
                    }
                });
            } else {
                $tag_txt.focus();
                lib.BGShine({
                    ele: $tag_txt,
                    original_color: "#fff",
                    change_color: "#ff6363",
                    frequency: 3
                });
            }
            return false;
        });
        //自定义标签
        $page.on("keydown", ".tag_txt", function (e) {
            if (e.keyCode === 13) {
                $page.find(".add_new_tag").click();
                return false;
            }
        });
        //删除已有标签
        $page.on("click", ".remove_tag_item", function () {
            var $this = $(this).closest(".tag_item");
            $this.fadeOut(function () {
                $this.remove();
            });
            return false;
        });
    };
    init();
});



var i = 1000000;
var a = {};
while()