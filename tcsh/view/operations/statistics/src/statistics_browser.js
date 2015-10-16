define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery")
    ;
    require("highcharts")($);
    require("exporting")(window.Highcharts);
    var init = function () {
        var _series = [];
        for (var i in global_setting.series) {
            _series.push([global_setting.series[i].name, global_setting.series[i].data-0]);
        }
        $('.statistics_box').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '浏览器比例'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                type: 'pie',
                data: _series
            }]
        });
        bind();

    };
    var bind = function () {

    };
    init();
});
