﻿define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery")
    ;
    require("highcharts")($);
    require("exporting")(window.Highcharts);
    var init = function () {
        $('.statistics_box').highcharts({
            chart: {
                type: 'column',
                margin: [50, 50, 100, 80]
            },
            title: {
                text:  "标签使用情况"
            },
            xAxis: {
                categories: [
                    '商家使用',
                    '买家使用'
                ],
                labels: {
                    rotation: -45,
                    align: 'right',
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: '使用数 (次)'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: '使用了: <b>{point.y:.1f} 次</b>',
            },
            series: [{
                name: 'Population',
                data: [40, 94],
                dataLabels: {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',
                    x: 4,
                    y: 10,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif',
                        textShadow: '0 0 3px black'
                    }
                }
            }]
        });
        bind();

    };
    var bind = function () {

    };
    init();
});
