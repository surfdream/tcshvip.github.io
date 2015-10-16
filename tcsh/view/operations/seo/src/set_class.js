define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        juicer = require('juicer');
    var gData = {};
    var $page = $("#page"), $set_class_main = $page.find(".set_class_main");
    var _initTop = function () {
        var topClass = $(".topclass");
        var subClass = $(".subclass");
        var $listBox = $("#listBox")
        topClass.empty().append('<option value="0">顶级</option>');
        for (var i in gData) {
            topClass.append('<option value="' + i + '">' + gData[i].name + '</option>');
        }
        topClass.change(function () {
            var $this = $(this), _val = $this.val();
            subClass.empty().append('<option value="0">无</option>');
            if (_val - 0) {
                var itemList = gData[_val].itemList;
                if (itemList) {
                    for (var i in itemList) {
                        subClass.append('<option value="' + i + '">' + itemList[i].name + '</option>');
                    }
                    $set_class_main.find(".class_item").remove();
                    _initSetList(itemList);
                }
            } else {
                $set_class_main.find(".class_item").remove();
                _initSetList();
            }
        });
        subClass.change(function () {
            var $this = $(this), _val = $this.val();
            if (_val - 0) {
                var itemList = gData[_val.substring(0, 2) + "0000"].itemList[_val].itemList;
                $set_class_main.find(".class_item").remove();
                _initSetList(itemList);
            } else {
                topClass.change();
            }
        });
    },
    _initSubordinate = function () {
        $.ajax({
            url: domains.api+"/category",
            type: "get",
            dataType: "jsonp",
            success: function (data) {
                gData = data
                //console.log(gData)
                _initTop();
                _initSetList();
            }, error: function () {
                alert("getSubordinateList  Error !")
            }
        });
    },
    _initSetList = function (data) {
        var _data = data || gData;
        var _arr = [];
        _html = juicer($("#class_item_model").html());
        for (var i in _data) {
            _arr.push(_html.render($.extend({
                id: i,
                name: _data[i].name
            }, global_setting.keywords[i])));
        }
        $set_class_main.append(_arr.join(''));

    };
    var init = function () {
        _initSubordinate();

        bind();
    };
    var bind = function () {
       
    };
    init()
});
