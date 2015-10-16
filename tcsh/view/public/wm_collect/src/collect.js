/*
收藏
*/
define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge"; var domains = require('domains');
    var $ = require('http://s.tcsh.me/tcsh/model/lib/jquery/seajs-jquery-1.8.3.min.js'),
        lib = require('http://s.tcsh.me/tcsh/model/lib/dist/lib.js');
    //收藏店铺
    var _collectBusiness = function (op) {
        $.ajax({
            url: domains.api2 + '/favorite/add.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                favoriteId: op.id,
                flag: 1,
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //收藏商品
    _collectCommodity = function (op) {
        $.ajax({
            url: domains.api2 + '/favorite/add.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                favoriteId: op.id,
                flag: 0
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //创建商品-标签
    _createCommodityTag = function (op) {
        $.ajax({
            url: domains.api2 + '/tag/add.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                tagName: op.tagName,
                flag: 0
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //创建店铺-标签
    _createBusinessTag = function (op) {
        $.ajax({
            url: domains.api2 + '/tag/add.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                tagName: op.tagName,
                flag: 1
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //编辑商品-标签
    _editCommodityTag = function (op) {
        $.ajax({
            url: domains.api2 + '/tag/edit.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                tagId: op.tagId,
                tagName: op.tagName
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //编辑店铺-标签
    _editBusinessTag = function (op) {
        $.ajax({
            url: domains.api2 + '/tag/edit.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                tagId: op.tagId,
                tagName: op.tagName
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //删除商品-标签
    _delCommodityTag = function (op) {
        $.ajax({
            url: domains.api2 + '/tag/delete.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                tagId: op.tagId
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //删除店铺-标签
    _delBusinessTag = function (op) {
        $.ajax({
            url: domains.api2 + '/tag/delete.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                tagId: op.tagId
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //删除收藏商品
    _delCommodity = function (op) {
        $.ajax({
            url: domains.api2 + '/favorite/delete.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                favoriteId: op.id
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //删除收藏店铺
    _delBusiness = function (op) {
        $.ajax({
            url: domains.api2 + '/favorite/delete.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                favoriteId: op.id
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //将店铺分配到标签
    _businessToTag = function (op) {
        $.ajax({
            url: domains.api2 + '/tag/favoriteto.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                tagId: op.tagId,
                favoriteId: op.id
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //将商品分配到标签
    _commodityToTag = function (op) {
        $.ajax({
            url: domains.api2 + '/tag/favoriteto.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                tagId: op.tagId,
                favoriteId: op.id
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //将店铺移出标签
    _businessOutTag = function (op) {
        $.ajax({
            url: domains.api2 + '/tag/favorout.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                tagId: op.tagId,
                favoriteId: op.id
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //将商品移出标签
    _commodityOutTag = function (op) {
        $.ajax({
            url: domains.api2 + '/tag/favorout.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                tagId: op.tagId,
                favoriteId: op.id
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //将商品加入购物车
    _commodityToShoppingCart = function (op) {
        $.ajax({
            url: '',
            type: 'get',
            dataType: 'jsonp',
            data: {

            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //获取商品所有标签列表
    _getCommodityTagList = function (op) {
        $.ajax({
            url: domains.api2 + '/tag/getfavoritelist.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                flag: 0
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //获取店铺标签列表
    _getBusinessTagList = function (op) {
        $.ajax({
            url: domains.api2 + '/tag/getfavoritelist.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                flag: 1
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
   //获取分类列表
    _getGroupList = function (op) {
        $.ajax({
            url: domains.api2 + '/tag/getfavoritelist.json',
            type: 'get',
            dataType: 'jsonp',
            data: {

            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //获取单个商品的标签
    _getCommodityItemTag = function (op) {
        $.ajax({
            url: domains.api2 + '/tag/getlist.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                favoriteId: op.id
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    },
    //获取单个店铺的标签
    _getBusinessItemTag = function (op) {
        $.ajax({
            url: domains.api2 + '/tag/getlist.json',
            type: 'get',
            dataType: 'jsonp',
            data: {
                favoriteId: op.id
            },
            success: function (data) {
                typeof op.success === "function" && op.success(data);
            },
            error: function () {
                typeof op.error === "function" && op.error();
            }
        });
    }
    ;
    //收藏店铺
    exports.collectBusiness = function (op) {
        lib.verificationLogin(function () {
            _collectBusiness(op);
        });
    };
    //收藏商品
    /*
    op={
        oproductId:"商品id",
        success:function(data){
            成功回调        
        },
        error:function(){
            异常回调
        }
    }
    */
    exports.collectCommodity = function (op) {
        lib.verificationLogin(function () {
            _collectCommodity(op);
        });
    };
    //删除收藏店铺
    exports.delBusiness = function (op) {
        lib.verificationLogin(function () {
            _delBusiness(op);
        });
    };
    //删除收藏商品
    exports.delCommodity = function (op) {
        lib.verificationLogin(function () {
            _delCommodity(op);
        });
    };
    //创建商品-标签
    exports.createCommodityTag = function (op) {
        lib.verificationLogin(function () {
            _createCommodityTag(op);
        });
    };
    //创建店铺-标签
    exports.createBusinessTag = function (op) {
        lib.verificationLogin(function () {
            _createBusinessTag(op);
        });
    };
    //编辑商品-标签
    exports.editCommodityTag = function (op) {
        lib.verificationLogin(function () {
            _editCommodityTag(op);
        });
    };
    //编辑店铺-标签
    exports.editBusinessTag = function (op) {
        lib.verificationLogin(function () {
            _editBusinessTag(op);
        });
    };
    //删除商品-标签
    exports.delCommodityTag = function (op) {
        lib.verificationLogin(function () {
            _delCommodityTag(op);
        });
    };
    //删除店铺-标签
    exports.delBusinessTag = function (op) {
        lib.verificationLogin(function () {
            _delBusinessTag(op);
        });
    };
    //将商品分配到标签
    exports.commodityToTag = function (op) {
        lib.verificationLogin(function () {
            _commodityToTag(op);
        });
    };
    //将店铺分配到标签
    exports.businessToTag = function (op) {
        lib.verificationLogin(function () {
            _businessToTag(op);
        });
    };
    //将商品移出标签
    exports.commodityOutTag = function (op) {
        lib.verificationLogin(function () {
            _commodityOutTag(op);
        });
    };
    //将店铺移出标签
    exports.businessOutTag = function (op) {
        lib.verificationLogin(function () {
            _businessOutTag(op);
        });
    };
    //将商品加入购物车
    exports.commodityToShoppingCart = function (op) {
        lib.verificationLogin(function () {
            _commodityToShoppingCart(op);
        });
    };
    //获取商品所有标签列表
    exports.getCommodityTagList = function (op) {
        lib.verificationLogin(function () {
            _getCommodityTagList(op);
        });
    };
    //获取店铺所有标签列表
    exports.getBusinessTagList = function (op) {
        lib.verificationLogin(function () {
            _getBusinessTagList(op);
        });
    };
    //获取分类列表
    exports.getGroupList = function (op) {
        lib.verificationLogin(function () {
            _getGroupList(op);
        });
    };
    //获取商品的标签
    exports.getCommodityItemTag = function (op) {
        lib.verificationLogin(function () {
            _getCommodityItemTag(op);
        });
    };
    //获取店铺的标签
    exports.getBusinessItemTag = function (op) {
        lib.verificationLogin(function () {
            _getBusinessItemTag(op);
        });
    };
});