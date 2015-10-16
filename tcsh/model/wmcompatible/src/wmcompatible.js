/*
html5兼容
placeholder
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require("http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js"),
     juicer = require("http://s.tcsh.me/tcsh/model/lib/juicer/seajs-juicer-min.js");
    var placeholder = function () {
        var $ele, _lab, $lab, $body, _offset;
        if (!('placeholder' in document.createElement('input'))) {
            $body = $("body");
            _lab = '<label style="position:absolute;padding:0 5px;display:block;color:#ccc;cursor:text" class="placeholder_lable"></label>';
            $ele = $('[placeholder]:visible');
            $ele.each(function () {
                var $this = $(this), _id, _offset;
                $lab = $(_lab);
                _id = $this.attr("id");
                if (_id) {
                    $lab.attr("for", _id);
                }
                else {
                    _id = 'placeholderid' + Math.random() * 999
                    $lab.attr("for", _id);
                    $this.attr("id", _id);
                }
                _offset = $this.offset();
                _offset.top += parseFloat($this.css("padding-top"));
                _offset.left += parseFloat($this.css("padding-left"));
                $lab.offset(_offset);
                if ($this.val()) {
                    $lab.css("display", "none");
                }
                $lab.empty().append($this.attr("placeholder"));
                $body.append($lab);
            });
            $ele.on("focus", function () {
                var $this = $(this);
                $(".placeholder_lable[for='" + $this.attr("id") + "']").css("display", "none");
            });
            $ele.on("blur", function () {
                var $this = $(this);
                setTimeout(function () {
                    !$.trim($this.val()).length && $(".placeholder_lable[for='" + $this.attr("id") + "']").css("display", "block");
                }, 100); 
            });
            $(window).on("resize.placeholder", function () {
                $ele.each(function () {
                    var $this = $(this), _id, _offset;
                    _id = $this.attr("id");
                    _offset = $this.offset();
                    _offset.top += parseFloat($this.css("padding-top"));
                    _offset.left += parseFloat($this.css("padding-left"));
                    $body.find(".placeholder_lable[for='" + _id + "']").offset(_offset);
                });
            });
        }
    };
    exports.placeholder = placeholder;
    exports.isPlaceholder = function () {
        return 'placeholder' in document.createElement('input');
    };
});