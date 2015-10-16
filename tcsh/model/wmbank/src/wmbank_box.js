define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    require("http://s.tcsh.me/tcsh/model/wmarea/css/style.css");
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
        juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js"),
        box = require('http://s.tcsh.me/tcsh/model/wmbox/dist/wmbox.js'),
        bank_data = require('http://s.tcsh.me/tcsh/model/wmbank/dist/bank_data.js');
    require('http://s.tcsh.me/tcsh/model/wmbank/css/style.css#');
    var _bankList = juicer([
        '<div class="boxbank_mian">',
            '<div class="search_box">',
            '检索： <input type="text" class="search_txt" />',
            '</div>',
            '<ul class="boxbank_list">',
                '{@each bankList as list}',
                '<li class="boxbank_item" title="${list.name}">',
                    '<input type="radio" value="${list.id}" data_name="${list.name}" name="boxbank" id="boxbank_${list.id}" class="rad_boxbank"><label for="boxbank_${list.id}" class="boxbank_name">${list.name}</label>',
                '</li>',
                '{@/each}',
            '</ul>',
        '</div>'
    ].join(''));
    var _createBox = function (op) {
        return box.alert({
            titleText: "银行选择",
            boxCls: "bank_dialog",
            content: _bankList.render({ bankList: bank_data.getArrayData() }),
            btns: [
                { cls: "ui_btn_h46red8 chked_btn", res: "hide", text: "确定" },
                { cls: "alink", res: "hide", text: "取消" }],
            callback: function () {
                var self = this;
                var $bank_list = this.wmBox.find(".boxbank_list");
                this.wmBox.on("keyup", ".search_txt", function () {
                    var $this = $(this), _v = $.trim($this.val());
                    if (_v) {
                        $bank_list.find(".boxbank_item").addClass("hidden");
                        $bank_list.find(".boxbank_item[title*='" + _v + "']").removeClass("hidden");
                        $bank_list.find(".boxbank_item:not(.hidden)").each(function () {
                            var $this = $(this);
                            $this.find("label").empty().append($this.attr("title").replace(_v, '<b>' + _v + '</b>'))
                        });
                    } else {
                        $bank_list.find(".hidden").removeClass("hidden");
                        $bank_list.find(".boxbank_item:not(.hidden)").each(function () {
                            var $this = $(this);
                            $this.find("label").empty().append($this.attr("title"));
                        });
                    }
                });
                this.close = function () {
                    self.hide();
                };
                if (typeof op.radioChangeCallback === "function") {
                    this.wmBox.find(".rad_boxbank").on("change", function () {
                        op.radioChangeCallback.call(self);
                    });
                }
                if (typeof op.chkedCallback === "function") {
                    this.wmBox.find(".chked_btn").on("click", function () {
                        var $checked = self.wmBox.find(".rad_boxbank:checked");
                        self.val = $checked.val();
                        self.name = $checked.attr("data_name");
                        op.chkedCallback.call(self);
                    });
                }
                self.checked = function (id) {
                    if (id - 0) {
                        self.wmBox.find(".rad_boxbank").removeAttr("checked");
                        self.wmBox.find("#boxbank_" + id).attr("checked", "checked");
                    }
                };
                typeof op.callback === "function" && op.callback.call(self);
            }
        });
    };
    exports.Create = function (op) {
        var _op = $.extend({
            radioChangeCallback: null,
            chkedCallback: null
        }, op);
        return _createBox(_op);
    };
});
