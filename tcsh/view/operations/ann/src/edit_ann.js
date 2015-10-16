define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require("jquery"),
        verification = require("verification"),
        editor = new UE.ui.Editor();//编辑器
    var init = function () {
        var $form = $(".ann_form");
        verification.init($form);
        editor.render("myEditor");
        editor.ready(function () {
            editor.setContent($.trim($("#info").html()));
            editor.setHeight(300);
        });
        verification.addRule([{
            key: "editorEmpty", fun: function () {
                return editor.getContent();
            }
        }]);
        bind();
    };
    var bind = function () {
        var $form = $(".ann_form");
        $form.on("click", ":submit", function () {
            return verification.verify($form);
        });
    };
    init();
});
