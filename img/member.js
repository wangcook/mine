/**
 * 顶部配送至
 * @type {{init, getAreaIdByCookie}}
 */
var topMyCity = function($) {

    "use strict";

    var areaUrl = ncGlobal.webRoot + 'area/list.json/0';

    var $element = {};

    var tmpl = '<a href="javascript:;" class="area">配送至：<span id="shortCutAreaName" title="{areaName}" data-id="{areaId}">{areaName}</span> <i></i></a>'

    /**
     * 初始化元素
     * @private
     */
    function _init() {
        $element.shortCutMyCityPanel = $("#shortCutMyCityPanel");
        _getAreaList();
        "MjJTaG9wTkMySW5jMjIy";
    }

    /**
     * 根据cookie 获取当前选择的配送地址
     * 数据格式:
     * $.cookie("_ncc",[areaId , areaName].join(","))
     * @private
     */
    function _getAreaIdByCookie() {
        return $.cookie("ncc0");
    }

    /**
     * 将选择的配送配送地址写入cookie
     * @private
     */
    function _setAreaIdByCookie(value) {
        return $.cookie("ncc0", value, {
            expires: 7,
            path: '/'
        });
    }

    /**
     * 异步获取地址
     */
    function _getAreaList() {
        $.getJSON(areaUrl, function(data) {
            if (data.code == "200") {
                _buildElement(data.data.areaList)
            }
        })
    }

    /**
     * 创建元素
     */
    function _buildElement(data) {
        var myCookie = _getAreaIdByCookie(),
            myCity = !Nc.isEmpty(myCookie) ? myCookie.split(",") : "";
        var a = $.map(data, function(n, index) {
            return '<a href="javascript:;" data-deep="' + n.areaDeep + '" data-id="' + n.areaId + '" class="' +
                ((myCity.length && n.areaId == myCity[0]) ? "selected" : "") + '">' + n.areaName + '</a>';
        });
        if (a.length) {
            a.splice(0, 0, '<a href="javascript:;" data-deep="1" data-id="0" class="">全国</a>');
        }
        $element.shortCutMyCityPanel
            .append(tmpl.ncReplaceTpl(myCity ? {
                areaId: myCity[0],
                areaName: myCity[2]
            } : {
                areaId: 0,
                areaName: "全国"
            }))
            .append(
            a.length ? '<div id="shortCutAreaList" class="area-list">' + a.join('') + '</div>' : '');
    }

    function bindEvents() {
        $element.shortCutMyCityPanel.on("click", "a[data-id]", function() {
            var $this = $(this);
            $("#shortCutAreaList a").removeClass("selected");
            $this.addClass("selected");
            $("#shortCutAreaName")
                .html($this.html())
                .attr({
                    title: $this.html(),
                    "data-id": $this.data("id") ? $this.data("id") : 0
                });
            //修改cookie

            _setAreaIdByCookie([$this.data("id"), $this.data("deep"), $this.html()].join(","));
            //
            $.cookie("ncareaid", $this.data("id"), {
                expires: 7,
                path: '/'
            });
            location.reload();
        })
    }

    return {
        init: function() {
            _init();
            bindEvents();
        },
        getAreaIdByCookie: _getAreaIdByCookie
    };
}(jQuery);
/**
 * 顶部搜索
 */
var topSearch = function($) {
    function bindEvents() {
        "MjJTaG9wTkMySW5jMjIy"
        //选择搜索类型
        $("#hdSearchTab").on("click", "a", function() {
            var a = $("#hdSearchTab a:first"),
                $this = $(this);
            if ($this.is(a)) {
                return;
            }
            $this.insertBefore(a);
            //修改隐藏input
            $("#searchType").val($this.data("type"));
        }).hover(function() {
            $(this).addClass("head-search-select-hover")
        }, function() {
            $(this).removeClass("head-search-select-hover")
        });

    }

    return {
        init: function() {
            bindEvents();
        }
    };
}(jQuery);
/**
 * 右侧工具条
 */
var rightToolBar = function($) {
    "use strict";

    var $element;
    var className = {
        variation: "variation"
    };

    /**
     * 根据条件是否显示右侧工具条
     */
    function isShowToolBar() {
        var a = $element.appBarTabs.find("." + className.variation);
        $(window).width() >= 1240 ? a.show() : a.hide();
    }


    function _bindEvents() {
        //浏览器改变大小的时候重新验证是否显示全部右侧工具条
        $(window).resize(function() {
            isShowToolBar();
        });

        //浏览器缩小的时候计算显示还是不显示
        $element.appBarTabs
            .hover(function() {
                $(this).find("." + className.variation).show();
            },
            function() {
                isShowToolBar
            })
        //点击显示会员信息
        $element.barUserInfoBtn.on("click", function() {
            $element.barUserInfo.toggle();
        })
    }

    return {
        init: function() {
            $element = {
                appBarTabs: $("#appBarTabs"),
                barUserInfoBtn: $("#barUserInfoBtn"),
                barUserInfo: $("#barUserInfo")
            };
            //是否显示右侧工具条
            isShowToolBar();
            //绑定事件
            _bindEvents();
        }
    }
}(jQuery);
/**
 * 点击会员登录1
 */
var popupLoging = function($) {
    "use strict";
    var $element;
    //重复标示
    var __showFlat;
    var URL = ncGlobal.webRoot + "login/popuplogin";

    function _bindEvent() {
        $element.popupLoginBtn.on("click", function() {
            showPopupLogin();
        })
    }

    /**
     * 显示登录对话框
     */

    function showPopupLogin() {
        if (__showFlat) {
            return;
        }
        var __showFlat = Nc.layerOpen({
            type: 2,
            title: '您尚未登录',
            content: URL,
            skin: "default",
            area: ['410px', '485px'],
            btn: ''
        })
    }

    return {
        init: function() {
            $element = {
                popupLoginBtn: $("#popupLoginBtn")
            };
            _bindEvent()
        },
        showLoginDialog: showPopupLogin
    }
}(jQuery);
//popupLoging.showPopupLogin()
/**
 * 首页左侧分类菜单
 */
var topCategroy = function($) {
    "use strict";

    function _showMenu($menu, $item, top) {
        var a = $("#topCategoryMenu").offset(),
            b = $(window).scrollTop(),
            c = $item.offset().top;

        if (b >= a.top) {
            $menu.css({
                top: b - a.top
            });
        } else {
            $menu.css({
                top: 0
            });
        }
    }

    function _bindEvents() {
        $(".category ul.menu li").each(function() {
                var img1 = $(this).find(".J-category-nav-img-1"),
                    img2 = $(this).find(".J-category-nav-img-2");
                $(this).hover(
                    function() {
                        //显示导航图片
                        img1.length&& img2.length && img1.hide();
                        img1.length&& img2.length && img2.show();
                        var cat_id = $(this).attr("cat_menu_id");
                        var menu = $(this).find("div[cat_menu_id='" + cat_id + "']");
                        menu.show();
                        $(this).addClass("hover");
                        var menu_height = menu.height();
                        if (menu_height < 60) menu.height(80);
                        menu_height = menu.height();
                        var li_top = $(this).position().top;
                        //bycj
                        _showMenu($(menu), $(this), li_top);
                    },
                    function() {
                        img1.length&&img2.length && img1.show();
                        img1.length&&img2.length && img2.hide();
                        $(this).removeClass("hover");
                        var cat_id = $(this).attr("cat_menu_id");
                        $(this).find("div[cat_menu_id='" + cat_id + "']").hide();
                    }
                );
            }
        );
    }

    return {
        init: function() {
            _bindEvents();
        }
    }
}(jQuery);
/**
 * 购物车相关
 */
var myCart = function($) {

    "use strict";

    var addCartUrl = ncGlobal.webRoot + "cart/add";
    //购物车post 标示
    var addCartFlat = true;
    var $element;

    /**
     * 添加购物车
     * @param goodsId
     */
    function addCartByGoodsId(goodsId, buyNum) {
        $(document).ajaxError(function(event, request, settings) {
            //Nc.alertError("TODO:连接超时");
            addCartFlat = true;
        });
        if (!addCartFlat) {
            return;
        }
        addCartFlat = false;
        $.get(
            addCartUrl, {
                goodsId: goodsId,
                buyNum: buyNum
            },
            function(xhr) {
                if (xhr.code == "200") {
                    Nc.eventManger.trigger("add.cart.succeed");
                    //$("body").trigger("add.cart.succeed");
                } else {
                    Nc.eventManger.trigger("add.cart.error");
                    Nc.alertError(xhr.message ? xhr.message : "连接超时");
                }
                addCartFlat = true;
            },
            'json'
        )
    }


    /**
     * 全局事件
     */
    var bindCommonEvents = function() {};
    //
    return {
        //添加购物车
        addCartByGoodsId: addCartByGoodsId,
        init: function() {
            //$element.topMyCart.find(".incart-goods-box").perfectScrollbar({suppressScrollX: true});

            //绑定全局事件
            bindCommonEvents();
        }
    }
}(jQuery);
/**
 *顶部我的商城、我的订单什么的
 */
var topQuickMenu = function() {


    var $element = {
        //quickmenu显示区域
        quickMenu: ""
    };
    var className = {
        hover: "hover"
    };


    function _bindEvents() {
        var hoverElement = [".my-mall", ".my-order", ".mobile-mall", ".call-center", ".mobile-mall", ".my-favorite"],
            a = "MTExU2hvcE5DMTExMUluYzExMTEx";
        //我的商城鼠标滑过
        $element.quickMenu.find(hoverElement.join(",")).hover(function(e) {
            $(this).addClass(className.hover);
        }, function(e) {
            $(this).removeClass(className.hover);
        })
    }


    return {
        init: function() {

            $element.quickMenu = $("#quickMenu");
            _bindEvents();
        }
    }
}();
//分享商品
(function($) {
    var ShareGoods = function(element, option) {
        //console.log(option);


        /*初始化元素*/
        this.$element = $(element);
        this.options = $.extend({}, ShareGoods.setting, option);
        this.init();
    };
    /**
     * 默认设置
     * @type {{}}
     */
    ShareGoods.setting = {};
    ShareGoods.prototype = {
        init: function() {
            var that = this;
            //显示登录对话框
            that._showShareGoodsDialog(true);
        },
        /**
         * 显示登录对话框
         */
        _showShareGoodsDialog: function() {
            if (__showFlat) {
                return;
            }
            var __showFlat = Nc.layerOpen({
                type: 2,
                title: '分享商品',
                content: ncGlobal.webRoot + "share/goods?commonId=" + this.options.commonId,
                skin: "default",
                area: ['500px', '440px'],
                btn: ''
            });
        }
    };
    //多转单
    function Plugin(option) {
        return new ShareGoods(this, option);
    }

    //jquery 绑定
    $.fn.ncShareGoods = Plugin;
})(jQuery);
/**
 * 收藏
 */
var favorites = function($) {
    //重复提交标示
    var __postFlat = true;

    /**
     * 商品收藏
     * @param commonId
     * @returns {boolean}
     */
    function favoritesGoods(commonId, cartId) {
        if (commonId <= 0) {
            Nc.alertError("参数错误");
            return false;
        }
        if (!__postFlat) {
            return;
        }
        __postFlat = false;

        var params = {
            "commonId": commonId
        };
        $.post(ncGlobal.webRoot + "favorite/goods", params, function(xhr) {
            if (xhr.data && xhr.data.errorType && xhr.data.errorType == "noLogin") {
                popupLoging.showLoginDialog();
            } else {
                Nc.eventManger.trigger("goods.favorites.end", [commonId, xhr]);
            }
            __postFlat = true;
        }).always(function() {
            __postFlat = true;
        });
        return false;
    }

    /**
     * 批量收藏商品
     * @param commonIds
     */
    function batchFavoritesGoods(commonIds, cartId) {
        if (!__postFlat || !commonIds) return;

        $.post(ncGlobal.webRoot + "favorite/goodslist", {
            commonIds: commonIds
        }, function(xhr) {
            if (xhr.data && xhr.data.errorType && xhr.data.errorType == "noLogin") {
                popupLoging.showLoginDialog();
            } else {
                Nc.eventManger.trigger("goods.batchfavorites.end", [cartId, xhr]);
            }
            __postFlat = true;
        }).always(function() {
            __postFlat = true;
        });
    }


    /**
     * 收藏店铺
     * @param storeId
     * @returns {boolean}
     */
    function favoritesStore(storeId, that) {
        if (storeId <= 0) {
            Nc.alertError("参数错误");
            return false;
        }
        if (!__postFlat) {
            return;
        }
        __postFlat = false;
        var params = {
            "storeId": storeId
        };
        $.post(ncGlobal.webRoot + "favorite/store", params, function(xhr) {
            if (xhr.code == 200) {
                //显示数量累计
                var currNum = parseInt($(that).find("[nc_type='storeFavoritesNum']").html());
                if (currNum <= 0) {
                    currNum = 0;
                }
                $(that).find("[nc_type='storeFavoritesNum']").html(currNum + 1);
                Nc.alertSucceed("店铺收藏成功");

            } else {
                if (xhr.data && xhr.data.errorType && xhr.data.errorType == "noLogin") {

                    popupLoging.showLoginDialog();
                } else {
                    Nc.alertError(xhr.message);
                }
            }
            __postFlat = true;
        }).fail(function() {
            __postFlat = true;
        });
        return false;
    }

    return {
        goods: favoritesGoods,
        batchGoods: batchFavoritesGoods,
        store: favoritesStore
    };
}(jQuery);

var voucher = function($) {
    //重复提交标示
    var __postFlat = true;

    /**
     * 领取免费优惠券
     */
    function freeReceive(templateId, callbackFun) {
        if (templateId <= 0) {
            Nc.alertError("参数错误");
            return false;
        }
        if (!__postFlat) {
            return;
        }
        __postFlat = false;

        var params = {
            "templateId": templateId
        };
        $.post(ncGlobal.webRoot + "store/voucher/receive", params, function(xhr) {
            if (xhr.code == 200) {
                Nc.alertSucceed("领取成功");
                if (Nc.isFunction(callbackFun)) {
                    //eval(callbackFun+".call(this)");
                    callbackFun(xhr);
                }
            } else {
                if (xhr.data && xhr.data.errorType && xhr.data.errorType == "noLogin") {
                    popupLoging.showLoginDialog();
                } else {
                    Nc.alertError(xhr.message);
                }
            }
            __postFlat = true;
        }).always(function() {
            __postFlat = true;
        });
        return false;
    }

    return {
        freeReceive: freeReceive
    };
}(jQuery);
/**
 * 顶部搜索
 */
var topMemberRelatedDate = function($) {
    function bindEvents() {
        $.getJSON(ncGlobal.webRoot + "index/member/relateddate", function(data) {
            if (data.ordersCount && data.ordersCount > 0) {
                $("#topMemberOrders").html("(" + data.ordersCount + ")");
            }
            if (data.consultNoReadCount && data.consultNoReadCount > 0) {
                $("#topMemberConsult").html("(" + data.consultNoReadCount + ")");
            }
            if (data.favoritesGoodsCount && data.favoritesGoodsCount > 0) {
                $("#topMemberFavoritesGoods").html("(" + data.favoritesGoodsCount + ")");
            }
            if (data.goodsBrowseCount && data.goodsBrowseCount > 0) {
                $("#topMemberGoodsBrowse").html("(" + data.goodsBrowseCount + ")");
            }
            if (data.messageUnreadCount && data.messageUnreadCount > 0) {
                $("#topMessageUnreadCount").html("(" + data.messageUnreadCount + ")");
                $("<sub><a href='" + ncGlobal.memberRoot + "message/list' title='您有" + data.messageUnreadCount + "条未读消息'>" + data.messageUnreadCount + "</a></sub>").appendTo("#memberLayoutMessageUnreadCount");
            }
            return false;
        });
    }

    return {
        init: function() {
            bindEvents();
        }
    };
}(jQuery);

/**
 * 添加商品弹窗
 */
var addGoodsPopUpModule = function($) {

    /**
     * 模版
     */
    var tplWarp = '<div class="popup-modal-block" id="popupGoodsPanel">' +
        '{spuContent}<div class="modal-sku-list"><div class="modal-tit">{specTitle}<div class="fr"><span class="price">单价 (元)</span><span class="stock">可售数量 ({unitName})</span><span class="amount">购买数量 ({unitName})</span></div></div><div class="modal-sku"><ul>{skuContent}</ul></div></div>{rangeContent}</div>';
    var tplFr = '<div class="fr">' +
        '<span class="price" data-price=""><%=webPrice0%></span>' +
        '<span class="stock"><%=goodsStorage%><%=unitName%></span>' +
        '<span class="amount">' +
        '<% if( goodsStorage != 0 ) {%>' +
        '<span data-num-cut="<%=index%>" class="minus crisis" title="减少"><i class="fa fa-minus" aria-hidden="true"></i></span>' +
        '<input type="text" class="input-text" value="0" data-num-value="<%=index%>" autocomplete="off">' +
        '<span class="plus" data-num-add="<%=index%>" title="增加"><i class="fa fa-plus" aria-hidden="true"></i></span>' +
        '<%}else{%>' +
        '缺货' +
        '<%}%>' +
        '</span>' +
        '</div>';
    //填出框中的spu相关信息
    var tplSpuContent = '<div class="modal-spu"><div class="goods-pic"><image src="<%=imageSrc %>"></div><div class="goods-info"><h4><%=goodsName %></h4><h5><%=jingle %></h5></div></div>';
    //批发模式的价格显示
    var tplRange = '<div class="stat-info"><div class="price-range">合计：<span class="orange"><em class="total-amount" data-total-amount>0</em><%=unitName%>*</span><div class="price-range-list" data-price-range-list><% batchNum.forEach (function(value,index){%><dl class="fd-clr <% if(index===0){%>first-item price-selected<%}%>"><dt>≧<%=value%>&nbsp;<%=unitName%>:</dt><dd><%=batchPrice[index]%>&nbsp;元/<%=unitName%></dd></dl><% })%></div><span class="orange">=<em class="total-money" data-total-money>0.00</em>元</span></div><span class="total-error"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>订购数量必须为大于0的整数</span></div>';
    //普通模式的价格显示
    var tplNormal = '<div class="stat-info"><div class="price-range price-range-right">&nbsp&nbsp&nbsp数量总计：<span class="orange"><em class="total-amount" data-total-amount="">0</em>&nbsp<%=unitName%></span>&nbsp&nbsp&nbsp商品金额总计：<span class="orange"> <em class="total-money" data-total-money="">0.00</em>元</span></div></div>';
    //添加购物车成功后弹出的对话框
    var addCartSuccessTpl = '<div class="ncs-cart-popup"><dl><dt>成功添加到购物车</dt><dd>购物车共有 <strong id="bold_num">{cartNum}</strong> 种商品</dd><dd class="btns"> <a onclick="location.href=\'{webRoot}cart/list\'" class="btn btn-sm btn-info" href="javascript:void(0);">查看购物车</a> <a onclick="layer.closeAll();" value="" class="btn-warning btn btn-sm" javascript:void(0);">继续购物</a> </dd></dl></div>';
    var addCartErrorTpl = 'X19wb3dlciBieSBTaG9wTmNfXw==';
    /**
     *
     *
     */
    var AddGoodsPopUp = function(spuId) {
        //获取spu详细信息的地址
        this.areaUrl = ncGlobal.webRoot + 'get/goods/' + spuId;
        //添加购物车的地址
        this.addCartUrl = ncGlobal.webRoot + "cart/add";

        this.spuJson = '';

        this.$element = '';

        this._init();
        //选择数据的json
        this.buyJson = [];
    };
    AddGoodsPopUp.prototype._init = function() {
        var self = this;

        /**
         * 有规格时的处理
         */
        function __hasSpecHandle() {
            var index = Nc.layerOpen({
                content: self._buildLayerElement(),
                title: "请选订购数量",
                success: function(layero, index) {
                    self.$element = layero;
                    self._buildElement();
                    self._bindEvents();
                    //bycj -- 默认数量选择为1
                    self.$element.find("input[data-num-value]").val(1).trigger("keyup");
                },
                yes: function() {
                    var postData = self.buyJson;
                    if (postData.length > 0) {
                        self._addCart(postData);
                        self.$element.find(".total-error").hide();
                    } else {
                        self.$element.find(".total-error").show();
                    }
                }
            });
        }

        /**
         * 没有规格时的处理
         * @return {[type]} [description]
         */
        function __noSpecHandle() {
            //没有规格就直接加入购物车
            var skuGoodsInfo = self.spuJson.goodsList[0],
                postData = [{
                    goodsId: skuGoodsInfo.goodsId,
                    buyNum: 1
                }];
            if (skuGoodsInfo.goodsStorage == 0 || self.spuJson.goodsState == 0) {
                layer.closeAll();
                Nc.alertError("该商品已下架或售完");
            }
            self._addCart(postData);
        }


        $.getJSON(this.areaUrl, function(xhr) {
            // console.log("获取spu数据是:", xhr);
            if (xhr.code != 200) {
                Nc.alertError(xhr.message);
                return;
            }
            //保存SPU 数据
            self.spuJson = xhr.data;
            if (self.spuJson.specJson) {
                __hasSpecHandle();
            } else {
                __noSpecHandle();
            }

        });
    };
    /**
     * 添加购物车请求
     */
    AddGoodsPopUp.prototype._addCart = function(postData) {
        var self = this;
        layer.closeAll();
        $.post(
            self.addCartUrl, {
                buyData: JSON.stringify(postData)
            },
            function(xhr) {
                if (xhr.code == 200) {
                    layer.open({
                        type: 1,
                        area: ['420px', '240px'], //宽高
                        shadeClose: true,
                        content: addCartSuccessTpl.ncReplaceTpl({
                            cartNum: xhr.data.cartCount,
                            webRoot: ncGlobal.webRoot
                        }),
                        time: 50000
                    });
                    //刷新顶部购物车小红点
                    Nc.eventManger.trigger("nc.cart.redpoint", [xhr.data.cartCount]);
                } else {
                    Nc.alertError(xhr.message);
                }
            });
    };

    /**
     * 创建layer所需要的元素
     */
    AddGoodsPopUp.prototype._buildLayerElement = function() {
        var self = this;

        var specJsonVoList = JSON.parse(self.spuJson.specJson),
        //创建头部
            modelTitleHtml = specJsonVoList.map(function(elem, index) {
                return '<span class="spec-' + specJsonVoList.length + '">' + elem.specName + '</span>';
            });
        //创建商品内容
        var goodsList = self.spuJson.goodsList,
            itemSku = goodsList.map(function(elem, index) {
                var goodsSpecs = elem.goodsSpecs.split(",,,").map(function(e, i) {
                    return '<span class="spec-' + specJsonVoList.length + '">' + (i === 0 ? '<img src="' + elem.imageSrc + '">' : "") + e + '</span>';
                }).join("");
                var _tplFr = ncTemplate(tplFr)({
                    webPrice0: Nc.priceFormat(elem.webPrice0) + (elem.webUsable == 1 ? '<em>活动价</em>' : ''),
                    goodsStorage: elem.goodsStorage,
                    unitName: goodsList.unitName,
                    index: index
                });
                return '<li data-index="' + index + '" class="' + (elem.goodsStorage === 0 ? "stockout" : "") + '">' + goodsSpecs + _tplFr + '</li>';
            }).join("");


        //批发模式显示价格段的显示

        var rangePanelHtml =
            self.spuJson.goodsModal == 2 ? ncTemplate(tplRange)({
                batchPrice: [Nc.priceFormat(self.spuJson.webPrice0), Nc.priceFormat(self.spuJson.webPrice1), Nc.priceFormat(self.spuJson.webPrice2)],
                unitName: self.spuJson.unitName,
                batchNum: [self.spuJson.batchNum0, self.spuJson.batchNum1, self.spuJson.batchNum2]
            }) : ncTemplate(tplNormal)({
                unitName: self.spuJson.unitName,
                batchNum: self.spuJson.batchNum0
            });
        //
        var result = tplWarp.ncReplaceTpl({
            specTitle: modelTitleHtml,
            skuContent: itemSku,
            unitName: self.spuJson.unitName,
            rangeContent: rangePanelHtml,
            spuContent: ncTemplate(tplSpuContent)({
                imageSrc: ncImage(self.spuJson.imageSrc, 60, 60),
                goodsName: self.spuJson.goodsName,
                jingle: self.spuJson.jingle
            })
        });

        return result;
    };
    /**
     * 创建其他元素
     */
    AddGoodsPopUp.prototype._buildElement = function() {

    };
    /**
     * 绑定事件
     */
    AddGoodsPopUp.prototype._bindEvents = function() {
        var self = this;
        self.$element
            .on('click', 'span[data-num-cut]', function(event) {
                event.preventDefault();
                console.log("点击减号事件");
                var $input = $(this).siblings('input[data-num-value]'),
                    value = Nc.number.sub($input.val(), 1);
                $input.val(value < 0 ? 0 : value).trigger("keyup");
            })
            .on('click', 'span[data-num-add]', function(event) {
                event.preventDefault();
                // console.log("点击添加按钮");
                var $input = $(this).siblings('input[data-num-value]');
                $input.val(Nc.number.add($input.val(), 1)).trigger("keyup");
            })
            .on('keyup', 'input[data-num-value]', function(event) {
                event.preventDefault();
                // console.log("直接修改数量事件");
                var $this = $(this),
                    $par = $this.closest('li'),
                    skuConfig = self._getGoodsInfoByIndex($this.data('numValue')),
                    value = Nc.getNum($this.val());
                $this.val(value == '' ? 0 : value);
                if ($this.val() >= skuConfig.goodsStorage) {
                    $this.val(skuConfig.goodsStorage);
                    $this.siblings("[data-num-add]").addClass("crisis");
                } else {
                    $this.siblings("[data-num-add]").removeClass("crisis");
                }
                if ($this.val() <= 0) {
                    $this.siblings("[data-num-cut]").addClass("crisis");
                    $par.removeClass("modal-sku-curr");
                } else {
                    $this.siblings("[data-num-cut]").removeClass("crisis");
                    $par.addClass("modal-sku-curr");
                }
                //刷新价格
                self._refreshPrice();
                // //隐藏已选清单
                // manual || $("#selectedListInfo").hide();
                // //展开全部规格信息
                // that._showAndHideMore(1);
                // //重新计算运费
                // eventManger.trigger("freight", [$this.val()])
            });


        return this;
    };
    /**
     * 根据需要获取缓存中的商品信息
     */
    AddGoodsPopUp.prototype._getGoodsInfoByIndex = function(index) {
        return this.spuJson.goodsList[index];
    };

    /**
     * 刷新价格
     */
    AddGoodsPopUp.prototype._refreshPrice = function() {
        var self = this,
            totalPrice = 0,
            $inputNumList = self.$element.find("input[data-num-value]"),
        //获取总数
            totalNum = __getTotalNum($inputNumList),
        //获取价格段
            rangeNum = self._getPriceRangeByTotelNum(totalNum),
            $liList = self.$element.find(".modal-sku li");

        /**
         * 根据商品价格段获取价格
         */
        function __getPriceByRangeNum(rangeNum, skuData) {
            return skuData['webPrice' + rangeNum];
        }

        /**
         * 获取总数
         */
        function __getTotalNum($inputList) {
            var result = 0;
            $inputList.each(function(index, el) {
                result = Nc.number.add(result, $(this).val());
            });
            // console.log("商品数量总数是:", result);
            return result;
        }

        /**
         * 修改商品区域显示
         */
        function __showRangePricePanel() {
            var $dls = self.$element.find("[data-price-range-list]").find("dl");

            //修改价格区间
            // console.log("修改价格区间" , rangeNum);
            $dls.removeClass('price-selected');
            $dls.eq(rangeNum).addClass('price-selected');
        }

        //重置选择数据
        self.buyJson = [];

        $liList.each(function(index, el) {
            var $this = $(this),
                index = $(this).data("index"),
                skuData = self._getGoodsInfoByIndex(index),
                price = __getPriceByRangeNum(rangeNum, skuData),
                skuNum = $this.find('[data-num-value]').val(),
                _priceAmount = Nc.number.multi(skuNum, price);
            if ($this.hasClass('stockout')) return;


            $this.find("span[data-price]").html(Nc.priceFormat(price) + (skuData.webUsable == 1 ? '<em>活动价</em>' : ''));
            totalPrice = Nc.number.add(_priceAmount, totalPrice);
            //添加数据
            skuNum > 0 && self.buyJson.push({
                goodsId: skuData.goodsId,
                buyNum: skuNum
            })
        });
        //修改价格显示
        self.$element.find("[data-total-amount]").html(totalNum);
        self.$element.find("[data-total-money]").html(Nc.priceFormat(totalPrice));
        //修改价格区间
        __showRangePricePanel();
        //修改选择的数据
        totalNum > 0 && self.$element.find(".total-error").hide();
    };

    /**
     * 获取发送数据
     */
    AddGoodsPopUp.prototype.getPostData = function() {
        return this.buyJson.length > 0 ? JSON.stringify(buyJson) : '';
    };

    /**
     * 根据购买总数获取价格段
     */
    AddGoodsPopUp.prototype._getPriceRangeByTotelNum = function(totalNum) {
        if (totalNum >= this.spuJson.batchNum2 && this.spuJson.batchNum2 > 0) {
            return 2;
        }
        if (totalNum >= this.spuJson.batchNum1 && this.spuJson.batchNum1 > 0) {
            return 1;
        }
        if (totalNum >= this.spuJson.batchNum0 && this.spuJson.batchNum0 > 0) {
            return 0;
        }
        return 0;
    };

    ///////////////
    return {
        addGoodsPopUp: function(spuId) {
            new AddGoodsPopUp(spuId);
        }
    };
}(jQuery);

/**
 * 在线验证是否登录
 */
var verifyIsLogin = function() {
    var __postFlat = true;
    var urlVerifyIsLogin = ncGlobal.webRoot + 'login/status';

    function isLogin(callBackFn) {
        if (!__postFlat) {
            return;
        }
        __postFlat = false;
        $.getJSON(urlVerifyIsLogin, function(xhr) {
            if (xhr.code == "200" && xhr.data) {
                if (xhr.data.status) {
                    Nc.isFunction(callBackFn) && callBackFn(xhr.data.status)
                } else {
                    popupLoging.showLoginDialog();
                }
            } else {
                Nc.alertError(data.message ? data.message : "连接超时");
            }
        }).always(function() {
            __postFlat = true;
        });
    }


    // body...
    return {
        vaild: isLogin
    };
}(jQuery);
/**
 * 在线im对话框
 */
(function($, verifyIsLogin) {
    var verifySellerIdArray = [],
        imStoreOnlineQueue = [],
        urlVerifyIsOnline = ncGlobal.webRoot + "im/getonlineseller.json",
        uniqueArray = function(data) {
            data = data || [];
            var a = {};
            for (var i = 0; i < data.length; i++) {
                var v = data[i];
                if (typeof(a[v]) == 'undefined') {
                    a[v] = 1;
                }
            }
            data.length = 0;
            for (var i in a) {
                data[data.length] = i;
            }
            return data;
        },
        addVerifyStoreOnlineQueue = function(sellerId, cb) {
            verifySellerIdArray.push(sellerId);
            imStoreOnlineQueue.push(cb);
        },
        runVerifyQueue = function() {
            if (verifySellerIdArray.length <= 0) return;
            $.post(urlVerifyIsOnline, {
                sellerIds: uniqueArray ( verifySellerIdArray ).join(",")
            }, function(xhr) {
                if (xhr.code != 200) return;
                //开始检测在列队
                imStoreOnlineQueue.forEach(function(currValue) {
                    currValue(xhr.data);
                });
            });

        };



    var IMChat = function(element, option) {


        /*初始化元素*/
        this.$element = $(element);
        //获取元素上的设置信息
        IMChat.setting = $.extend({}, IMChat.setting, {
            verifyOnline: $(element).data("imVerifyOnline") ? 1 : 0
        });
        this.options = $.extend({}, IMChat.setting, option);
        this.sid = this.$element.data("imSellerId");

        //如果元素上有设置就覆盖原有设置
        var _commonId = this.$element.data("imCommonId"),
            _sellerId = this.$element.data("imSellerId");
        if (!Nc.isEmpty(_commonId)) {
            this.options.gid = _commonId;
        }
        if (!Nc.isEmpty(_sellerId)) {
            this.sid = _sellerId;
        }
        //是否登录标识
        this.isSelfOnlineFlat = false;

        if (Nc.isEmpty(this.sid) || Nc.isEmpty(ncGlobal.imRoot)) {
            this.$element.hide();
            console.error("im 所需要的sid 或者 imRoot 为空");
            return;
        }
        this.init();
    };
    IMChat.setting = {
        //会员token
        tid: "",
        //商品commonid
        gid: "",

        classNameOnline: "chat_online",

        classNameOffline: "chat_offline",
        //是否先验证是否在线
        verifyOnline: true,
        //验证是否在线的地址
        urlVerfiyOnline: ncGlobal.imRoot + 'common/isonline?callback=?',

        urlVerfiyMemberIsOnline: ncGlobal.imRoot + "common/isonline?callback=?",

        urlVerfiyMemberIsOnlineByToken: ncGlobal.imRoot + "api/is_online",

        urlOpenIM: ncGlobal.imRoot + "member?token={token}&sid={sid}&gid={gid}"
    };

    IMChat.prototype.init = function() {
        var self = this,
            o = self.options;
        //显示图标
        self._bindEventsForIMChat();
        if (o.verifyOnline) {

            //判断联系人是否在线
            addVerifyStoreOnlineQueue(self.sid, function(onlineList) {

                if (onlineList.indexOf(self.sid) >= 0) {
                    self.$element.removeClass(o.classNameOffline).addClass(o.classNameOnline).show();
                }else{
                    self.$element.removeClass(o.classNameOnline).addClass(o.classNameOffline).show();
                }
            });

            // this._verifyIsOnline(self.sid, 2, function(state) {
            //     if (state == 1) {
            //         self.$element.removeClass(o.classNameOffline).addClass(o.classNameOnline).show();
            //     }
            // });
        }
    };

    IMChat.prototype._bindEventsForIMChat = function() {
        var self = this,
            o = self.options,
            handle = this;
        /**
         * 点击填出对话框
         */
        self.$element.on('click', function(event) {
            event.preventDefault();
            var handle = this,
                newWindow;

            if (Nc.isEmpty(o.tid)) {
                //如果没登陆就弹出登录框
                popupLoging.showLoginDialog();
            } else {
                window.open(o.urlOpenIM.ncReplaceTpl({
                    token: o.tid,
                    sid: self.sid,
                    gid: o.gid
                }), '_blank', "top=" + (window.screen.height - 550) / 2 + ",left=" + (window.screen.width - 850) / 2 + ",width=850,height=550,menubar=no,scrollbars=no,toolbar=no,status=no,location=no");
            }
        });
    };

    /**
     * 打开im对话框
     */
    IMChat.prototype._openIMDialog = function(newWindow) {
        var self = this,
            o = this.options,
            _url = o.urlOpenIM.ncReplaceTpl({
                token: o.tid,
                sid: self.sid,
                gid: o.gid
            });
        // window.open(_url, '_blank', "top=100,left=100,width=850,height=500,menubar=no,scrollbars=no,toolbar=no,status=no");
        newWindow.location = _url;
        newWindow.resizeTo(850, 550);

    };
    /**
     * 根据会员token验证是否已经在线了
     */
    IMChat.prototype._verifyIsOnlineMember = function(callBack, error) {
        var self = this,
            o = self.options;
        return $.post(o.urlVerfiyMemberIsOnlineByToken, {
            token: o.tid
        }, callBack, 'json');
        //$.post(o.urlVerfiyMemberIsOnlineByToken, {
        //    token: o.tid
        //}, callBack, 'json').error(function(){
        //
        //});
    };
    /**
     * 验证是否在线
     */
    IMChat.prototype._verifyIsOnline = function(uid, utype, callBack) {
        var self = this;
        $.getJSON(self.options.urlVerfiyOnline, {
            uid: uid,
            utype: utype
        }, function(json, textStatus) {
            if (json.errorCode === 0) {
                callBack(json.isOnline);
            }
        });


    };

    //多转单
    function Plugin(option) {
        var a = this.each(function() {
            new IMChat(this, option);
        });
        runVerifyQueue();
        return a;
    }
    //jquery 绑定
    $.fn.ncChat = Plugin;

    //加入自动
    $(function() {
        $("a[data-auto-nc-im]").ncChat({
            tid: ncGlobal.tid
        });
    });
})(jQuery, verifyIsLogin);
//////////
$(function() {
    //顶部配送至
    topMyCity.init();
    //顶部搜索
    topSearch.init();
    popupLoging.init();
    //首页左侧分类菜单
    topCategroy.init();
    //购物车
    $("#topMyCart").ncCart();
    Nc.eventManger.trigger("nc.cart.init");
    topQuickMenu.init();
    //查询顶部会员相关数据
    topMemberRelatedDate.init();

    //收藏商品
    $("[nc_type='goodsFavoritesBtn']").click(function() {
        var data_str = $(this).attr('data-param');
        if (!data_str) {
            Nc.alertError("参数错误");
            return false;
        }
        eval("data_str = " + data_str);
        favorites.goods(data_str.commonId);
    });

    //收藏店铺
    $("[nc_type='storeFavoritesBtn']").click(function() {
        var data_str = $(this).attr('data-param');
        if (!data_str) {
            Nc.alertError("参数错误");
            return false;
        }
        eval("data_str = " + data_str);
        favorites.store(data_str.storeId, this);
    });

    //领取免费优惠券
    $("[nc_type='voucherFreeReceiveBtn']").click(function() {
        var templateId = $(this).attr("data-template-id");
        if (!templateId) {
            return;
        }
        var callbackFun = $(this).attr("data-callback");
        templateId = parseInt(templateId);
        if (templateId <= 0) {
            return;
        }
        voucher.freeReceive(templateId, callbackFun);
    });

});