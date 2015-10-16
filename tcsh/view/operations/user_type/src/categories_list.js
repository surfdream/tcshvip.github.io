define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    var domains = require('domains');
    var $ = require('jquery');
    var init = function () {

        bind();
    };
    var bind = function () {
        var $page = $("#page"),
            $categories_list = $page.find(".categories_list");
        var sub_item_html = [
            '<li class="sub_item clearfix">',
                '<div class="body_name">',
                    '<span class="sub_ico">┣</span> ',
                    '<input type="text" class="name_txt" placeholder="分类名称" />',
                '</div>',
                '<span class="body_date">&nbsp;</span>',
                '<div class="btn_list">',
                    '<a href="#" class="link remove_sub_item">删除</a>',
                '</div>',
            '</li>'
        ].join('');
        var categories_item_html = [
            '<li class="categories_item clearfix">',
                '<div class="body_name">',
                    '<span class="iconfont">&#xf0131;</span> ',
                    '<input type="text" class="name_txt" placeholder="分类名称" />',
                '</div>',
                '<span class="body_date">&nbsp;</span>',
                '<div class="btn_list">',
                    '<a href="#" class="link add_sub">添加下级<span class="wm_ico arrow7down"></span></a>',
                    '<ul>',
                        '<li class="btn_list_last">',
                            '<a href="#" class="add_sub">添加下级</a>',
                        '</li>',
                        '<li class="btn_list_end">',
                            '<a href="#" class="remove_categories_item" >删除</a>',
                        '</li>',
                    '</ul>',
                '</div>',
                '<ul class="sub_list"></ul>',
            '</li>'
        ].join('');
        //展开，缩起
        $page.on("click", ".zoom_btn", function () {
            var $this = $(this),
                $categories_item = $this.closest(".categories_item")
            ;
            if ($categories_item.hasClass("show_sub")) {
                if (!$categories_item.find(".remove2").length) {
                    $categories_item.removeClass("show_sub");
                    $this.empty().append("&#xe607;");
                }
            } else {
                $categories_item.addClass("show_sub");
                $this.empty().append("&#xe623;");
            }
            return false;
        });
        //添加一级
        $page.on("click", ".add_categories_item", function () {
            $categories_list.append(categories_item_html);
            return false;
        });
        //添加二级
        $page.on("click", ".add_sub", function () {
            var $this = $(this),
                $categories_item = $this.closest(".categories_item"),
                $sub_list = $categories_item.find(".sub_list");
            if (!$categories_item.hasClass("show_sub")) {
                $categories_item.find(".zoom_btn").empty().append("&#xe623;");
                $categories_item.addClass("show_sub");
            }
            $sub_list.append(sub_item_html);
            return false;
        });
        //新添加的一级直接删除
        $page.on("click", ".remove_categories_item", function () {
            $(this).closest(".categories_item").remove();
            return false;
        });
        //新添加的二级直接删除
        $page.on("click", ".remove_sub_item", function () {
            $(this).closest(".sub_item").remove();
            return false;
        });
        //删除一级
        $page.on("click", ".del_categories_item", function () {
            var $this = $(this),
                $categories_item = $this.closest(".categories_item");
            if ($categories_item.hasClass("show_sub")) {
                $categories_item.find(".zoom_btn").empty().append("&#xe607;");
                $categories_item.removeClass("show_sub");
            }
            $categories_item.append('<div class="mask remove1"><p class="msg">保存后彻底删除，删除后将无法恢复！<a href="#" class="revocation revocation1">撤销删除</a></p></div>');
            $categories_item.addClass("oh");
            setTimeout(function () {
                $categories_item.removeClass("oh");
            }, 200);
            return false;
        });
        //撤销删除一级
        $page.on("click", ".revocation1", function () {
            var $this = $(this),
                $categories_item = $this.closest(".categories_item");
            $categories_item.find(".remove1").remove();
            if ($categories_item.find(".remove2").length) {
                $categories_item.find(".zoom_btn").empty().append("&#xe623;");
                $categories_item.addClass("show_sub");
            }
            return false;
        });
        //删除二级
        $page.on("click", ".del_sub_item", function () {
            var $this = $(this),
                $sub_item = $this.closest(".sub_item");
            $sub_item.append('<div class="mask remove2"><p class="msg">保存后彻底删除，删除后将无法恢复！<a href="#" class="revocation revocation2">撤销删除</a></p></div>');
            return false;
        });
        //撤销删除二级
        $page.on("click", ".revocation2", function () {
            var $this = $(this),
                $sub_item = $this.closest(".sub_item");
            $sub_item.find(".remove2").remove();
            return false;
        });
        //保存
        $page.on("click", ".submit", function () {
            var postData = {};
            postData.addData = {};
            postData.editData = {};
            postData.removeData = [];
            //遍历所有大类
            $page.find(".categories_item").each(function () {
                var $this = $(this);
                var _id = $this.attr("data_id"),
                    _name = encodeURIComponent($this.find(".name_txt:eq(0)").val());
                //区分大类是修改还是新增
                if (_id) {
                    //区分大类是否删除
                    if ($this.find(".remove1").length) {
                        postData.removeData.push(_id);
                    } else {
                        postData.editData[_id] = {
                            id: _id,
                            name: _name,
                            sub_list: []
                        }
                        //遍历小类
                        $this.find(".sub_item").each(function () {
                            var $this = $(this);
                            var _id = $this.attr("data_id"),
                                _parentid = $this.closest(".categories_item").attr("data_id"),
                                _name = encodeURIComponent($this.find(".name_txt:eq(0)").val());
                            //区分小类是修改还是新增
                            if (_id) {
                                //区分小类是否删除
                                if ($this.find(".remove2").length) {
                                    postData.removeData.push(_id);
                                } else {
                                    postData.editData[_parentid] && postData.editData[_parentid].sub_list.push({
                                        id: _id,
                                        name: _name
                                    });
                                }
                            } else {
                                postData.editData[_parentid] && postData.editData[_parentid].sub_list.push({
                                    name: _name
                                });
                            }
                        });
                    }

                } else {
                    postData.addData[_name] = {
                        name: _name,
                        sub_list: []
                    }
                    $this.find(".sub_item").each(function () {
                        var $this = $(this);
                        var _name = $this.find(".name_txt:eq(0)").val(),
                            _parent_name = $this.closest(".categories_item").find(".name_txt:eq(0)").val();
                        postData.addData[_parent_name] && postData.addData[_parent_name].sub_list.push({
                            name: _name
                        });

                    });
                }
            });
            $.ajax({
                url: domains.operator + "/commune/category/update.json",
                data: {
                    addData: JSON.stringify(postData.addData),
                    editData: JSON.stringify(postData.editData),
                    removeData: JSON.stringify(postData.removeData)
                },
                dataType: "json",
                success: function (data) {
                    if (data.success) {
                        window.location.reload();
                    } else {
                        alert(data.error || "添加失败！");
                    }
                },
                error: function () {
                    alert("系统繁忙！");
                }
            });
            console.log(postData);
            return false;
        });
    };
    init();
});
