/*
日期多选
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    require("../css/style.css#");
    require("http://s.tcsh.me/tcsh/view/public/font-face/css/font-face.css#");
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
     juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
     box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js'),
     forimg = require('http://s.tcsh.me/tcsh/model/wmforimg/dist/forimg.js');
    var _dateEnd = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var _create = function (y, m, d, $ele) {
        var sdate, cdate, edate, sc, ec, _append = [], i = 1, $ym_data;
        sdate = new Date(y, m, 1);
        cdate = new Date(y, m, d);
        y = sdate.getFullYear() - 0;
        m = sdate.getMonth() - 0;
        if (m === 2) {
            _dateEnd[1] = (y % 40 == 0 && y % 100 != 0) || y % 400 == 0 ? 29 : 28;
        }
        edate = new Date(y, m, _dateEnd[m]);
        ec = _dateEnd[sdate.getMonth()];
        sc = sdate.getDay();
        sc = sc ? (sc - 1) : 6
        while (sc--) {
            _append.push('<li class="mid_item"><a href="#"></a></li>');
        }
        for (; i <= ec; i++) {
            _append.push('<li class="mid_item"><a href="#">' + i + '</a></li>');
        }
        sc = 7 - edate.getDay();
        while (sc--) {
            _append.push('<li class="mid_item"><a href="#"></a></li>');
        }
        $ele.empty().append(_append.join(''));
        $ym_data = $ele.closest(".multipledate_item").find(".ym_data");
        $ym_data.empty().append(y + "年" + (m + 1) + "月");
    };
    var _show = function (op) {
        var _d = new Date(), _content, _i, _relyBox, _arr = [];
        var _op = $.extend({
            length: 2,
            startYear: _d.getFullYear(),
            startMonth: _d.getMonth(),
            startDate: _d.getDate(),
            offset: {}
        }, op);
        if (typeof _op.ele === "string" || _op.ele instanceof jQuery) {
            _i = _op.length;
            _content = $([
                '<div class="multipledate_box">',
                    '<div class="multipledate_main">',
                        '<a href="#" class="iconfont change_btn prev">&#xf016e;</a>',
                        '<a href="#" class="iconfont change_btn next">&#xf016d;</a>',
                        '<div class="multipledate_limit">',
                            '<ul class="multipledate_list">',
                            '</ul>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join(''));
            while (_i--) {
                _content.find(".multipledate_list").append('<li class="multipledate_item"><div class="ym_data"></div><p class="week_data"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></p><div class="mid_data"><ul class="mid_list"></ul></div></li>');
            }
            _i = 10;
            while (_i--) {
                _arr.push('<option value="' + (_op.startYear + 3 - _i) + '">' + (_op.startYear + 3 - _i) + '</option>');
            }
            _relyBox = box.relyBox({
                rely: _op.ele,
                offset: _op.offset,
                content: _content,
                callback: function () {
                    var i = 0, self = this;
                    var d1 = new Date().getTime();
                    for (; i <= _op.length; i++) {
                        _create(_op.startYear, _op.startMonth + i, _op.startMonth, this.wmBox.find('.mid_list:eq(' + i + ')'));
                    }
                    console.log(new Date().getTime() - d1);
                    var forDate = new forimg.Slide({
                        forImgBoxEle: self.wmBox.find(".multipledate_main"),
                        forImgBoxListEle: '.multipledate_list',
                        forImgItemEle: '.multipledate_item',
                        callback: function () {
                            
                        }
                    });
                    this.wmBox.on("click", ".prev", function () {
                        forDate.prev();
                        return false
                    });
                    this.wmBox.on("click", ".next", function () {
                        forDate.next();
                        return false
                    });
                }
            });
            _relyBox.show();
            return _relyBox;
        }
        return false;
    };
    exports.show = function (op) {
        return _show(op);
    };

});
