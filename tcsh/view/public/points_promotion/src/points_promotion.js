define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        juicer = require('http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js'),
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js'),
        forimg = require('http://s.tcsh.me/tcsh/model/wmforimg/dist/forimg.js')
    ;
    require('../css/style.css#');
    var _createHtml = function (data) {
        var data = {
            data_list: [{
                data_date: "1395792000000",
                data_txt: "今天",
                beneficial: '泡面，泡妞，泡咖啡，泡面，泡妞，泡咖啡，泡面，泡妞，泡咖啡，泡面，泡妞，泡咖啡，泡面，泡妞，泡咖啡，泡面，泡妞，泡咖啡',
                item_list: [
                    {

                        data_type: "default",
                        title: "用户名用户名用户名用户名",
                        data_time: '2019-05-05 10:10',
                        data_name: "偷天换日",
                        data_sum: '+100',
                        data_img: ''
                    },
                    {
                        data_type: "recommend_commodity",
                        title: "商品名称商品名称商品名称商品名称商品名称",
                        data_time: '',
                        data_name: '',
                        data_sum: '',
                        data_img: 'http://img.wumeiwang.com/M00/00/13/rBAA_FKcA9CAfJtEAADXbCjC9wM044.jpg_100x100.jpg'
                    },
                    {
                        data_type: "recommend_commodity",
                        title: "商品名称商品名称商品名称商品名称商品名称",
                        data_time: '',
                        data_name: '',
                        data_sum: '',
                        data_img: 'http://img.wumeiwang.com/M00/00/13/rBAA_FKcA9CAfJtEAADXbCjC9wM044.jpg_100x100.jpg'
                    },
                    {
                        data_type: "recommend_commodity",
                        title: "商品名称商品名称商品名称商品名称商品名称",
                        data_time: '',
                        data_name: '',
                        data_sum: '',
                        data_img: 'http://img.wumeiwang.com/M00/00/13/rBAA_FKcA9CAfJtEAADXbCjC9wM044.jpg_100x100.jpg'
                    },
                    {
                        data_type: "recommend_commodity",
                        title: "商品名称商品名称商品名称商品名称商品名称",
                        data_time: '',
                        data_name: '',
                        data_sum: '',
                        data_img: 'http://img.wumeiwang.com/M00/00/13/rBAA_FKcA9CAfJtEAADXbCjC9wM044.jpg_100x100.jpg'
                    }, {

                        data_type: "default",
                        title: "用户名用户名用户名用户名",
                        data_time: '2019-05-05 10:10',
                        data_name: "偷天换日",
                        data_sum: '+100',
                        data_img: ''
                    }, {

                        data_type: "default",
                        title: "用户名用户名用户名用户名",
                        data_time: '2019-05-05 10:10',
                        data_name: "偷天换日",
                        data_sum: '+100',
                        data_img: ''
                    }
                ]
            }, {
                data_date: "1395878400000",
                data_txt: "明天",
                beneficial: '泡面，泡妞，泡咖啡，泡面，泡妞，泡咖啡，泡面，泡妞，泡咖啡，泡面，泡妞，泡咖啡，泡面，泡妞，泡咖啡，泡面，泡妞，泡咖啡',
                item_list: [
                    {
                        data_type: "recommend_commodity",
                        title: "商品名称商品名称商品名称商品名称商品名称",
                        data_time: '',
                        data_name: '',
                        data_sum: '',
                        data_img: 'http://img.wumeiwang.com/M00/00/13/rBAA_FKcA9CAfJtEAADXbCjC9wM044.jpg_100x100.jpg'
                    },
                    {

                        data_type: "default",
                        title: "用户名用户名用户名用户名",
                        data_time: '2019-05-05 10:10',
                        data_name: "偷天换日",
                        data_sum: '+100',
                        data_img: ''
                    },
                    {
                        data_type: "recommend_commodity",
                        title: "商品名称商品名称商品名称商品名称商品名称",
                        data_time: '',
                        data_name: '',
                        data_sum: '',
                        data_img: 'http://img.wumeiwang.com/M00/00/13/rBAA_FKcA9CAfJtEAADXbCjC9wM044.jpg_100x100.jpg'
                    },
                    {
                        data_type: "recommend_commodity",
                        title: "商品名称商品名称商品名称商品名称商品名称",
                        data_time: '',
                        data_name: '',
                        data_sum: '',
                        data_img: 'http://img.wumeiwang.com/M00/00/13/rBAA_FKcA9CAfJtEAADXbCjC9wM044.jpg_100x100.jpg'
                    },
                    {
                        data_type: "recommend_commodity",
                        title: "商品名称商品名称商品名称商品名称商品名称",
                        data_time: '',
                        data_name: '',
                        data_sum: '',
                        data_img: 'http://img.wumeiwang.com/M00/00/13/rBAA_FKcA9CAfJtEAADXbCjC9wM044.jpg_100x100.jpg'
                    },
                    {
                        data_type: "recommend_commodity",
                        title: "商品名称商品名称商品名称商品名称商品名称",
                        data_time: '',
                        data_name: '',
                        data_sum: '',
                        data_img: 'http://img.wumeiwang.com/M00/00/13/rBAA_FKcA9CAfJtEAADXbCjC9wM044.jpg_100x100.jpg'
                    }, {

                        data_type: "default",
                        title: "用户名用户名用户名用户名",
                        data_time: '2019-05-05 10:10',
                        data_name: "偷天换日",
                        data_sum: '+100',
                        data_img: ''
                    }, {

                        data_type: "default",
                        title: "用户名用户名用户名用户名",
                        data_time: '2019-05-05 10:10',
                        data_name: "偷天换日",
                        data_sum: '+100',
                        data_img: ''
                    }
                ]
            }]
        };
        var _html = juicer([
            '<div class="points_promotion_main">',
                '<ul class="points_promotion_tab_key">',
                    '{@each data_list as itme,index}',
                    '<li class="pptk_item {@if index==0} chked  today {@/if}" data_beneficial="${itme.beneficial}" data_date="${itme.data_date}"><a href="#">${itme.data_txt}</a></li>',
                    '{@/each}',
                '</ul>',
                '<ul class="set_box">',
                    '<li>',
                        '<input type="checkbox" id="not_subscription" /><label for="not_subscription">不再提醒</label>',
                    '</li>',
                '</ul>',
                '<div class="ppm_con">',
                    '<div class="ppb_title">',
                        '<span class="ppb_date_data ppb_month">3月</span>',
                        '<span class="ppb_date_data ppb_day">29</span>',
                        '<span class="ppb_date_data ppb_week">星期一</span>',
                        '<span class="beneficial" title="">宜：<b></b></span>',
                    '</div>',
                    '<ul class="ppm_con_list">',
                        '{@each data_list as itme}',
                        '<li class="ppm_con_item">',
                            '<div class="ppm_con_item_limit">',
                                '<ul class="ppm_con_msg_list">',
                                    '{@each itme.item_list as sub_list}',
                                        '{@if sub_list.data_type == "default"}',
                                        '<li class="ppm_con_msg_item">',
                                            '<div href="#" class="ppm_con_msg_title" title="${sub_list.title}">',
                                                '<span class="ppm_con_msg_title_txt">${sub_list.title}</span>',
                                            '</div>',
                                            '<span class="data_time">${sub_list.data_time}</span>',
                                            '<span class="get_name">${sub_list.data_name}</span>',
                                            '<span class="get_sum"><b>${sub_list.data_sum}</b>积分：</span>',
                                        '</li>',
                                        '{@else if sub_list.data_type == "recommend_commodity"}',
                                        '<li class="ppm_con_msg_item">',
                                            '<a href="#" class="recommend_commodity" title="${sub_list.title}">',
                                                '<img src="${sub_list.data_img}" />',
                                                '<span class="recommend_commodity_name">${sub_list.title}</span>',
                                            '</a>',
                                        '</li>',
                                        '{@/if}',
                                    '{@/each}',
                                '</ul>',
                            '</div>',
                            '<a href="#" class="iconfont change_btn prev">&#xf016e;</a>',
                            '<a href="#" class="iconfont change_btn next">&#xf016d;</a>',
                        '</li>',
                        '{@/each}',
                    '</ul>',
                '</div>',
                '<i class="corner"></i>',
            '</div>'
        ].join(''));
        return _html.render(data);
    };
    var _bind = function ($parent) {
        var self = this,
            $beneficial = $parent.find(".beneficial"),
            $points_promotion_tab_key = $parent.find(".points_promotion_tab_key"),
            $ppm_con_list = $parent.find(".ppm_con_list"),
            $ppb_month = $parent.find(".ppb_month"),
            $ppb_day = $parent.find(".ppb_day"),
            $ppb_week = $parent.find(".ppb_week");
        var weekcn = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        $parent.find(".pptk_item").each(function () {
            var $this = $(this), _date = new Date($this.attr("data_date") - 0);
            $this.attr("data_month", _date.getMonth() + 1 + "月").attr("data_day", _date.getDate()).attr("data_week", weekcn[_date.getDay()]);
        });
        $parent.find(".ppm_con_item").each(function () {
            var $this = $(this);
            var _slide = new forimg.Slide({
                forImgBoxEle: $this,
                forImgBoxListEle: '.ppm_con_msg_list',
                forImgItemEle: '.ppm_con_msg_item',
                callback: function () {
                }
            });
            $this.data("slide", _slide)
        });
        $parent.on("click", ".pptk_item", function () {
            var $this = $(this);
            $ppb_month.empty().append($this.attr("data_month"));
            $ppb_day.empty().append($this.attr("data_day"));
            $ppb_week.empty().append($this.attr("data_week"));
            $points_promotion_tab_key.find(".chked").removeClass("chked");
            $this.addClass("chked");
            $ppm_con_list.find(".ppm_con_item").css({
                display: 'none'
            });
            $beneficial.attr("title", $this.attr("data_beneficial")).empty().append('宜：<b>' + $this.attr("data_beneficial") + '</b>');
            $ppm_con_list.find(".ppm_con_item:eq(" + $this.index() + ")").fadeIn();
            return false;
        });
        $parent.find(".pptk_item:eq(0)").click();
        $parent.on("click", ".prev", function () {
            var $this = $(this),
           _slide = $this.closest(".ppm_con_item").data("slide");
            _slide && typeof _slide.prev === "function" && _slide.prev();
            return false;
        });
        $parent.on("click", ".next", function () {
            var $this = $(this),
           _slide = $this.closest(".ppm_con_item").data("slide");
            _slide && typeof _slide.next === "function" && _slide.next();
            return false;
        });
        $parent.on("click", ".close", function () {
            self.close();
            return false;
        });
        $parent.on("click", "#not_subscription", function () {
            $.ajax({
                url: "/",
                type: "get",
                dataType: "jsonp",
                data: {},
                success: function () { }
            });
            return false;
        });
    }
    var _show = function (data) {
        return box.invBox({
            boxId: "points_promotion_box",
            content: _createHtml(data),
            callback: function () {
                this.wmBox.find(".points_promotion_main").after('<a href="#" class="wm_ico fork7 close"></a>');
                _bind.call(this, this.wmBox);
            }
        });
    };
    exports.show = function (data) {
        var _box = _show();
        _box.show();
        return _box;
    };
    exports.getHtml = function (data) {
        return _createHtml(data);
    };
    exports.bind = function (op) {
        _bind(op);
    }
});
