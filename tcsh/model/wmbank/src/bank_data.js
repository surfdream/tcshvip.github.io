﻿define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var _arr = [
    { id: '006', name: '中国银行' },
    { id: '005', name: '中国农业银行' },
    { id: '018', name: '招商银行' },
    { id: '007', name: '中国建设银行' },
    { id: '011', name: '交通银行' },
    { id: '322', name: '上海农村商业银行' },
    { id: '321', name: '重庆三峡银行' },
    { id: '320', name: '村镇银行' },
    { id: '717', name: '中德住房储蓄银行' },
    { id: '716', name: '德国北德意志州银行' },
    { id: '714', name: '德国西德银行股份有限公司' },
    { id: '712', name: '德意志银行（中国）有限公司' },
    { id: '776', name: '荷兰合作银行有限公司' },
    { id: '616', name: '首都银行（中国）有限公司' },
    { id: '775', name: '华美银行(中国)有限公司' },
    { id: '029', name: '花旗银行' },
    { id: '028', name: '恒生银行有限公司' },
    { id: '027', name: '南洋商业银行' },
    { id: '771', name: '摩根士丹利国际银行（中国）有限公司' },
    { id: '026', name: '东亚银行有限公司' },
    { id: '611', name: '马来西亚马来亚银行有限公司' },
    { id: '025', name: '汇丰银行' },
    { id: '024', name: '城市信用合作社' },
    { id: '023', name: '农村信用合作社' },
    { id: '514', name: '中信银行国际（中国）有限公司' },
    { id: '673', name: '英国巴克莱银行有限公司' },
    { id: '022', name: '城市合作银行或上海银行' },
    { id: '513', name: '大新银行（中国）有限公司' },
    { id: '672', name: '苏格兰皇家银行（中国）有限公司' },
    { id: '021', name: '商业银行' },
    { id: '512', name: '永隆银行有限公司' },
    { id: '909', name: '银行间市场清算所' },
    { id: '020', name: '上海浦东发展银行' },
    { id: '510', name: '永亨银行' },
    { id: '906', name: '代收付清算组织' },
    { id: '319', name: '徽商银行股份有限公司' },
    { id: '318', name: '渤海银行股份有限公司' },
    { id: '317', name: '农村合作银行' },
    { id: '316', name: '浙商银行' },
    { id: '315', name: '恒丰银行' },
    { id: '314', name: '农村商业银行' },
    { id: '019', name: '兴业银行' },
    { id: '509', name: '星展银行（中国）有限公司' },
    { id: '761', name: '澳大利亚和新西兰银行（中国）有限公司' },
    { id: '508', name: '大众银行（香港）有限公司' },
    { id: '017', name: '平安银行' },
    { id: '507', name: '创兴银行有限公司' },
    { id: '016', name: '广发银行' },
    { id: '015', name: '中国民生银行' },
    { id: '506', name: '集友银行有限公司' },
    { id: '014', name: '华夏银行' },
    { id: '013', name: '中国光大银行' },
    { id: '662', name: '荷兰安智银行股份有限公司' },
    { id: '012', name: '中信银行' },   
    { id: '661', name: '苏格兰皇家银行（中国）有限公司' },
    { id: '010', name: '中国农业发展银行' },
    { id: '565', name: '日本山口银行股份有限公司' },
    { id: '403', name: '国家邮政局邮政储汇局' },
    { id: '401', name: '石嘴山市城市信用社' },
    { id: '009', name: '中国进出口银行' },
    { id: '008', name: '国家开发银行' },
    { id: '752', name: '蒙特利尔银行（中国）有限公司' },
    { id: '751', name: '加拿大丰业银行有限公司广州分行' },
    { id: '003', name: '支付业务收费专户' },
    { id: '002', name: '中华人民共和国国家金库' },
    { id: '001', name: '中国人民银行' },
    { id: '000', name: '电子联行转换中心' },
    { id: '742', name: '瑞士银行(中国)有限公司' },
    { id: '641', name: '奥地利奥合国际银行股份有限公司' },
    { id: '050', name: '中国外汇交易中心' },
    { id: '732', name: '意大利联合圣保罗银行股份有限公司' },
    { id: '731', name: '意大利裕信银行股份有限公司' },
    { id: '049', name: '中央国债登记结算有限责任公司' },
    { id: '048', name: '华一银行' },
    { id: '633', name: '泰国开泰银行(大众)有限公司' },
    { id: '047', name: '巴黎国际银行' },
    { id: '046', name: '瑞士信贷第一波士顿银行' },
    { id: '631', name: '盘谷银行(中国)有限公司' },
    { id: '045', name: '德国商业银行' },
    { id: '695', name: '法国外贸银行股份有限公司' },
    { id: '044', name: '德累斯登银行' },
    { id: '694', name: '东方汇理银行（中国）有限公司' },
    { id: '043', name: '法国里昂信贷银行' },
    { id: '534', name: '美国建东银行有限公司' },
    { id: '042', name: '东方汇理银行' },
    { id: '598', name: '国民银行（中国）有限公司' },
    { id: '533', name: '摩根大通银行(中国)有限公司' },
    { id: '691', name: '法国兴业银行（中国）有限公司' },
    { id: '597', name: '韩亚银行（中国）有限公司' },
    { id: '041', name: '渣打银行' },
    { id: '040', name: '比利时联合银行' },
    { id: '595', name: '新韩银行' },
    { id: '039', name: '新加坡发展银行' },
    { id: '038', name: '韩国中小企业银行' },
    { id: '622', name: '大华银行（中国）有限公司' },
    { id: '037', name: '韩国产业银行' },
    { id: '781', name: '厦门国际银行' },
    { id: '621', name: '华侨银行（中国）有限公司' },
    { id: '036', name: '友利银行' },
    { id: '035', name: '韩国外换银行' },
    { id: '034', name: '瑞穗实业银行' },
    { id: '683', name: '瑞典银行有限公司' },
    { id: '033', name: '三井住友银行' },
    { id: '682', name: '瑞典北欧斯安银行有限公司' },
    { id: '032', name: '日联银行' },
    { id: '681', name: '瑞典商业银行公共有限公司' },
    { id: '031', name: '株式会社东京三菱银行' },
    { id: '030', name: '美国美洲银行' },
    { id: '521', name: '华南商业银行股份有限公司' }
    ];
    var _obj = {
        '006': '中国银行',
        '005': '中国农业银行',
        '018': '招商银行',
        '007': '中国建设银行',
        '011': '交通银行',
        '322': '上海农村商业银行',
        '321': '重庆三峡银行',
        '320': '村镇银行',
        '717': '中德住房储蓄银行',
        '716': '德国北德意志州银行',
        '714': '德国西德银行股份有限公司',
        '712': '德意志银行（中国）有限公司',
        '776': '荷兰合作银行有限公司',
        '616': '首都银行（中国）有限公司',
        '775': '华美银行(中国)有限公司',
        '029': '花旗银行',
        '028': '恒生银行有限公司',
        '027': '南洋商业银行',
        '771': '摩根士丹利国际银行（中国）有限公司',
        '026': '东亚银行有限公司',
        '611': '马来西亚马来亚银行有限公司',
        '025': '汇丰银行',
        '024': '城市信用合作社',
        '023': '农村信用合作社',
        '514': '中信银行国际（中国）有限公司',
        '673': '英国巴克莱银行有限公司',
        '022': '城市合作银行或上海银行',
        '513': '大新银行（中国）有限公司',
        '672': '苏格兰皇家银行（中国）有限公司',
        '021': '商业银行',
        '512': '永隆银行有限公司',
        '909': '银行间市场清算所',
        '020': '上海浦东发展银行',
        '510': '永亨银行',
        '906': '代收付清算组织',
        '319': '徽商银行股份有限公司',
        '318': '渤海银行股份有限公司',
        '317': '农村合作银行',
        '316': '浙商银行',
        '315': '恒丰银行',
        '314': '农村商业银行',
        '019': '兴业银行',
        '509': '星展银行（中国）有限公司',
        '761': '澳大利亚和新西兰银行（中国）有限公司',
        '508': '大众银行（香港）有限公司',
        '017': '平安银行',
        '507': '创兴银行有限公司',
        '016': '广发银行',
        '015': '中国民生银行',
        '506': '集友银行有限公司',
        '014': '华夏银行',
        '013': '中国光大银行',
        '662': '荷兰安智银行股份有限公司',
        '012': '中信银行',
        '661': '苏格兰皇家银行（中国）有限公司',
        '010': '中国农业发展银行',
        '565': '日本山口银行股份有限公司',
        '403': '国家邮政局邮政储汇局',
        '401': '石嘴山市城市信用社',
        '009': '中国进出口银行',
        '008': '国家开发银行',
        '752': '蒙特利尔银行（中国）有限公司',
        '751': '加拿大丰业银行有限公司广州分行',
        '003': '支付业务收费专户',
        '002': '中华人民共和国国家金库',
        '001': '中国人民银行',
        '000': '电子联行转换中心',
        '742': '瑞士银行(中国)有限公司',
        '641': '奥地利奥合国际银行股份有限公司',
        '050': '中国外汇交易中心',
        '732': '意大利联合圣保罗银行股份有限公司',
        '731': '意大利裕信银行股份有限公司',
        '049': '中央国债登记结算有限责任公司',
        '048': '华一银行',
        '633': '泰国开泰银行(大众)有限公司',
        '047': '巴黎国际银行',
        '046': '瑞士信贷第一波士顿银行',
        '631': '盘谷银行(中国)有限公司',
        '045': '德国商业银行',
        '695': '法国外贸银行股份有限公司',
        '044': '德累斯登银行',
        '694': '东方汇理银行（中国）有限公司',
        '043': '法国里昂信贷银行',
        '534': '美国建东银行有限公司',
        '042': '东方汇理银行',
        '598': '国民银行（中国）有限公司',
        '533': '摩根大通银行(中国)有限公司',
        '691': '法国兴业银行（中国）有限公司',
        '597': '韩亚银行（中国）有限公司',
        '041': '渣打银行',
        '040': '比利时联合银行',
        '595': '新韩银行',
        '039': '新加坡发展银行',
        '038': '韩国中小企业银行',
        '622': '大华银行（中国）有限公司',
        '037': '韩国产业银行',
        '781': '厦门国际银行',
        '621': '华侨银行（中国）有限公司',
        '036': '友利银行',
        '035': '韩国外换银行',
        '034': '瑞穗实业银行',
        '683': '瑞典银行有限公司',
        '033': '三井住友银行',
        '682': '瑞典北欧斯安银行有限公司',
        '032': '日联银行',
        '681': '瑞典商业银行公共有限公司',
        '031': '株式会社东京三菱银行',
        '030': '美国美洲银行',
        '521': '华南商业银行股份有限公司'
    };
    exports.getArrayData = function () {
        return _arr;
    };
    exports.getObjectData = function () {
        return _obj;
    };
});
