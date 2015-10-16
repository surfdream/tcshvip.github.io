define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery")
    ;
    require("highcharts")($);
    require("exporting")(window.Highcharts);
    var init = function () {
        var $statistics_search = $(".statistics_search");
        for (var i in global_setting.page_key) {
            $statistics_search.find(".page_key[value='" + global_setting.page_key[i] + "']").attr("checked", "checked");
        }
        $('.statistics_box').highcharts({
            title: {
                text: '页面访问统计',
                x: -20 //center
            },
            xAxis: {
                title: {
                    text: '时间'
                },
                categories: ['8:01~10:00', '10:01~12:00', '12:01~14:00', '14:01~17:00', '17:01~20:00', '20:01~24:00', '00:01~8:00']
            },
            yAxis: {
                title: {
                    text: '访问次数'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '次'
            },
            legend: {
                layout: 'vertical',
                borderWidth: 0
            },
            series: global_setting.series||[]
        });
        bind();

    };
    var bind = function () {

    };
    init();
});
