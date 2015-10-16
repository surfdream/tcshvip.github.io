define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery")
    ;
    require("highcharts")($);
    require("exporting")(window.Highcharts);
    var init = function () {
        var _m = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var $date_year = $(".date_year"),
            $date_month = $(".date_month"),
             _date = new Date(),
            _arr = [],
            i = 3,
            _y = _date.getFullYear();
        while (i--) {
            _arr.push('<option value="' + (_y) + '">' + _y + '年</option>');
            _y--;
        }
        $date_year.empty().append(_arr.join('')).val(global_setting.year);
        i = 13;
        _arr = [];
        while (i--) {
            _arr.push('<option value="' + (12 - i) + '">' + ((12 - i) || "全年") + '</option>');
        }
        $date_month.empty().append(_arr.join('')).val(global_setting.month);
        _arr = [];
        _series = [
            {
                name: global_setting.year + "年" + (global_setting.month ? global_setting.month + "月" : ""),
                data: []
            }
        ]
        if (global_setting.month) {
            i = _m[global_setting.month];
            for (var _i = 1; _i <= i; _i++) {
                _arr.push(_i + "日");
                _series[0].data.push(global_setting.series[_i] || 0);
            }
        } else {
            i = 12;
            for (var _i = 1; _i <= i; _i++) {
                _arr.push(_i + "月");
                _series[0].data.push(global_setting.series[_i] || 0);
            }
        }
        $('.statistics_box').highcharts({
            title: {
                text: '站内信统计',
                x: -20 //center
            },
            xAxis: {
                title: {
                    text: '时间'
                },
                categories: _arr
            },
            yAxis: {
                title: {
                    text: '发送量'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '条'
            },
            legend: {
                layout: 'vertical',
                borderWidth: 0
            },
            series: _series
        });
        bind();

    };
    var bind = function () {

    };
    init();
});
