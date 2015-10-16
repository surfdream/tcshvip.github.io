/*
抓取物流数据
 */
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var $ = require('http://s.tcsh.me/out_lib/dist/sea_jquery.js');
    exports.init = function () {
        $(function () {
            var $table = $(".wikitable:eq(0)");
            var data = ['{'], _k, subdata = [];
            data.push('list: [');
            $table.find("tr").each(function () {
                var $this = $(this),
                    eq0v = $.trim($this.find("td:eq(0)").html()),
                    eq1v = $.trim($this.find("td:eq(1)").html()),
                    eq2v = $.trim($this.find("td:eq(2)").html());
                _k = eq0v || _k;
                if (eq0v) {
                    if (subdata.length) {
                        data.push(subdata.join(','));
                        data.push(']},');
                        subdata = [];
                    }
                    data.push('{ key: "' + _k + '", list: [');                   
                } else {
                    subdata.push('{"key":"' + eq1v + '","name":"'+eq2v+'"}');
                }
            });
            if (subdata.length) {
                data.push(subdata.join(','));
                data.push(']}');
                subdata = [];
            }
            data.push(']}');
            console.log(data.join(''));
        });
    };
});
var x={
    list: [
        { key: "A", list: [{"key":"auspost"},{"key":"aae"},{"key":"anxindakuaixi"}] },
        { key: "B", list: [{"key":"huitongkuaidi"},{"key":"baifudongfang"},{"key":"bht"},{"key":"youzhengguonei"},{"key":"bangsongwuliu"}] },
        { key: "C", list: [{"key":"cces"},{"key":"coe"},{"key":"chuanxiwuliu"},{"key":"canpost"},{"key":"canpostfr"}] },
        { key: "D", list: [{"key":"datianwuliu"},{"key":"debangwuliu"},{"key":"dpex"},{"key":"dhl"},{"key":"dhlen"},{"key":"dhlde"},{"key":"dsukuaidi"},{"key":"disifang"}] },
        { key: "E", list: [{"key":"ems"},{"key":"ems"},{"key":"emsen"}] },
        { key: "F", list: [{"key":"fedex"},{"key":"fedexcn"},{"key":"fedexus"},{"key":"feikangda"},{"key":"feikuaida"},{"key":"rufengda"},{"key":"fengxingtianxia"},{"key":"feibaokuaidi"}] },
        { key: "G", list: [{"key":"ganzhongnengda"},{"key":"guotongkuaidi"},{"key":"guangdongyouzhengwuliu"},{"key":"youzhengguonei"},{"key":"youzhengguonei"},{"key":"youzhengguoji"},{"key":"gls"},{"key":"gongsuda"}] },
        { key: "H", list: [{"key":"huitongkuaidi"},{"key":"huiqiangkuaidi"},{"key":"tiandihuayu"},{"key":"hengluwuliu"},{"key":"huaxialongwuliu"},{"key":"tiantian"},{"key":"haiwaihuanqiu"},{"key":"hebeijianhua"},{"key":"haimengsudi"},{"key":"huaqikuaiyun"},{"key":"haihongwangsong"}] },
        { key: "J", list: [{"key":"jiajiwuliu"},{"key":"jiayiwuliu"},{"key":"jiayunmeiwuliu"},{"key":"jinguangsudikuaijian"},{"key":"jixianda"},{"key":"jinyuekuaidi"},{"key":"jietekuaidi"},{"key":"jindawuliu"},{"key":"jialidatong"}] },
        { key: "K", list: [{"key":"kuaijiesudi"},{"key":"kangliwuliu"},{"key":"kuayue"}] },
        { key: "L", list: [{"key":"lianhaowuliu"},{"key":"longbanwuliu"},{"key":"lanbiaokuaidi"},{"key":"lejiedi"},{"key":"lianbangkuaidi"},{"key":"lianbangkuaidien"},{"key":"lijisong"},{"key":"longlangkuaidi"}] },
        { key: "M", list: [{"key":"menduimen"},{"key":"meiguokuaidi"},{"key":"mingliangwuliu"}] },
        { key: "O", list: [{"key":"ocs"},{"key":"ontrac"}] },
        { key: "Q", list: [{"key":"quanchenkuaidi"},{"key":"quanjitong"},{"key":"quanritongkuaidi"},{"key":"quanyikuaidi"},{"key":"quanfengkuaidi"},{"key":"sevendays"}] },
        { key: "R", list: [{"key":"rufengda"}] },
        { key: "S", list: [{"key":"shentong"},{"key":"shunfeng"},{"key":"shunfengen"},{"key":"santaisudi"},{"key":"shenghuiwuliu"},{"key":"suer"},{"key":"shengfengwuliu"},{"key":"shangda"},{"key":"santaisudi"},{"key":"haihongwangsong"},{"key":"saiaodi"},{"key":"haihongwangsong"},{"key":"sxhongmajia"},{"key":"shenganwuliu"},{"key":"suijiawuliu"}] },
        { key: "T", list: [{"key":"tiandihuayu"},{"key":"tiantian"},{"key":"tnt"},{"key":"tnten"},{"key":"tonghetianxia"}] },
        { key: "U", list: [{"key":"ups"},{"key":"upsen"},{"key":"youshuwuliu"},{"key":"usps"}] },
        { key: "W", list: [{"key":"wanjiawuliu"},{"key":"wanxiangwuliu"},{"key":"weitepai"}] },
        { key: "X", list: [{"key":"xinbangwuliu"},{"key":"xinfengwuliu"},{"key":"xingchengjibian"},{"key":"xinhongyukuaidi"},{"key":"cces"},{"key":"xinbangwuliu"},{"key":"neweggozzo"},{"key":"hkpost"}] },
        { key: "Y", list: [{"key":"yuantong"},{"key":"yunda"},{"key":"yuntongkuaidi"},{"key":"youzhengguonei"},{"key":"youzhengguoji"},{"key":"yuanchengwuliu"},{"key":"yafengsudi"},{"key":"yibangwuliu"},{"key":"youshuwuliu"},{"key":"yuanweifeng"},{"key":"yuanzhijiecheng"},{"key":"yuefengwuliu"},{"key":"yuananda"},{"key":"yuanfeihangwuliu"},{"key":"zhongxinda"},{"key":"zhimakaimen"},{"key":"yinjiesudi"},{"key":"yitongfeihong"}] },
        { key: "Z", list: [{ "key": "zhongtong" }, { "key": "zhaijisong" }, { "key": "ztky" }, { "key": "zhongtiewuliu" }, { "key": "zhongyouwuliu" }, { "key": "zhongxinda" }, { "key": "zhongsukuaidi" }, { "key": "zhimakaimen" }, { "key": "zhengzhoujianhua" }, { "key": "zhongtianwanyun" }] }
    ]
}