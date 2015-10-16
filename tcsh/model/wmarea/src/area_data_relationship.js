define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    //下面的数据对象写成(function(){})()仅仅是为了编辑器能折叠，静态数据苦逼屎哥哥了
    var _data = [
        {
            name: '华北',
            cityList: [
                '100000', '110000', '120000', '130000', '140000'
            ]
        },
         {
             name: '华南',
             cityList: [
                 '280000', '300000', '290000'
             ]
         },
         {
             name: '华中',
             cityList: [
                 '250000', '260000', '270000'
             ]
         },
        {
            name: '华东',
            cityList: [
                '180000', '200000', '210000', '190000', '240000', '220000', '230000'
            ]
        },
        {
            name: '西南',
            cityList: [
                '320000', '340000', '330000', '350000', '310000'
            ]
        },
        {
            name: '西北',
            cityList: [
                '360000', '370000', '380000', '390000', '400000'
            ]
        },
        {
            name: '东北',
            cityList: [
                '170000', '160000', '150000'
            ]
        },
        {
            name: '港澳台',
            cityList: [
                '410000', '420000', '430000'
            ]
        }
    ];
    return _data;
});
