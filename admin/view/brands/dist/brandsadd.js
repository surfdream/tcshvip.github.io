define(function (require, exports, module) {"require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('jquery'),
        juicer = require('juicer'),
        verification = require('wmverification'),
        lib = require('lib'),
        showartwork = require('wmshowartwork'),
        upload = require('wmupload');
    var _init,
        _initClassParent,
        gClass,
        $classparent = $(".classparent");

    var init = function () {
        window.document.domain = "tcsh.me";
        verification.addRule([
            {
                key: "emptyBrandType", fun: function () {
                    return !!this.closest(".form_row").find("[name='BrandType']:checked").length
                }
            }
        ])
        verification.init();
        bind();
    };
    var bind = function () {
        var $page = $("#page");
        var imgtype = 'jpg,jpeg,gif,png';
        $page.on("click", ".form_file_btn", function () {
            var $this = $(this), $parent = $this.closest(".form_row");
            $parent.find(".form_file").click();
            return false;
        });
        $page.on("change", ".form_file", function () {
            var $this = $(this), $parent = $this.closest(".form_row");
            var _v = $this.val(), _type = _v.substr(_v.lastIndexOf(".") + 1).toLowerCase();
            //if (lib.getFileSize(this) / 1024 / 1024 > 50) {
            //    alert("文件上传不能超过50M！");
            //    return false;
            //}
            if (imgtype.indexOf(_type) >= 0) {
                upload.upload($this, function (data) {
                    if (data.response) {
                        $("#" + $this.attr("data_key")).val(data.response.imgurl);
                        $parent.find(".form_txt").val(data.response.imgurl);
                    }
                });
            } else {
                alert("请选择格式为：jeg，png，gif的图片！");
            }
        });
        $page.on("click", ":submit", function () {
            return verification.verify();
        });
        $("#right").on("scroll", function () {
            verification.position();
        });
        $page.on("click", ".preview", function () {
            var $this = $(this);
            showartwork.create($this.closest("li").find(".form_txt").val() || "http://s.tcsh.me/tcsh/view/public/img/img404_1.png");
            return false;
        });
    };
    init();
    /*
    _init = function () {
        _initClassParent();
    };
    _initClassParent = function () {
        $.ajax({
            url: "http://localhost:9999/getclass",
            type: "get",
            dataType: "jsonp",
            success: function (data) {
                gClass = data;
                $classparent.empty().append('<option value="0">--请选择--</option>');
                for (var i in data) {
                    $classparent.append('<optgroup value="' + i + '" label="' + data[i].name + '"></optgroup>')
                }
                $classparent.find('optgroup').each(function () {
                    var $this = $(this), _val = $this.attr("value");
                    var list = data[_val].itemList;
                    for (i in list) {
                        $this.append('<option value="' + i + '">' + list[i].name + '</option>');
                    }
                });
            },
            error: function () {

            }
        })
    };
    $page.on("change", ".classparent", function () {
        var $this = $(this), _val = $this.val(), $sel_class = $(".sel_class"), _id;
        var s2 = _val.substr(0, 2);
        var subData = gClass[s2 + "0000"].itemList[_val].itemList;
        console.log(subData);
        $sel_class.empty().append('<label class="row_key">&nbsp;</label>');
        for (var i in subData) {
            _id = Math.random() * 999
            $sel_class.append('<input type="checkbox" id="' + _id + '"  /><label class="chk_key" for="' + _id + '">' + subData[i].name + '</label>');
        }
    });
    _init();
    */
});