define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('http://s.tcsh.me/tcsh/model/domains/dist/domains.js');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js');
    var thstIndex = lib.cookie('wmpushmsgindex') - 0 || 0;
    var _newDataClaaback = function () { };
    var init = function () {
        var $body = $("body");
        window.document.domain = "tcsh.me";
        $body.append('<iframe src="http://s.tcsh.me/tcsh/model/wmds/dsifrmae.html" style="display:none" id="getDataIframe"></iframe>');
    };
    var _setIntervalCookie = setInterval(function () {
        var _index = lib.cookie('wmpushmsgindex') - 0 || 0;
        if (thstIndex !== _index) {
            _newDataClaaback($.parseJSON(lib.cookie('wmpushmsg')));
            thstIndex = _index;
        }
    }, 5000);
    init();
    exports.newDataClaaback = function (callback) {
        if (typeof callback === "function") {
            _newDataClaaback = callback;
        }
    };
    exports.closeGet = function () {
        $("#getDataIframe")[0].contentWindow.closeGet();
    };

});
