/*
 * jQuery One Page Nav Plugin
 * http://github.com/davist11/jQuery-One-Page-Nav
 *
 * Copyright (c) 2010 Trevor Davis (http://trevordavis.net)
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://jquery.org/license
 *
 * @version 3.0.0
 *
 * Example usage:
 * $('#nav').onePageNav({
 *   currentClass: 'current',
 *   changeHash: false,
 *   scrollSpeed: 750
 * });
 */

;
(function ($, window, document, undefined) {

    // our plugin constructor
    var OnePageNav = function (elem, options) {
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
        this.metadata = this.$elem.data('plugin-options');
        this.$win = $(window);
        this.sections = {};
        this.didScroll = false;
        this.$doc = $(document);
        this.docHeight = this.$doc.height();
    };

    // the plugin prototype
    OnePageNav.prototype = {
        defaults: {
            navItems: 'a',
            currentClass: 'current',
            changeHash: false,
            easing: 'swing',
            filter: '',
            scrollSpeed: 750,
            scrollThreshold: 0.5,
            begin: false,
            end: false,
            scrollChange: false
        },

        init: function () {
            // Introduce defaults that can be extended either
            // globally or using an object literal.
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            this.$nav = this.$elem.find(this.config.navItems);

            //Filter any links out of the nav
            if (this.config.filter !== '') {
                this.$nav = this.$nav.filter(this.config.filter);
            }

            //Handle clicks on the nav
            this.$nav.on('click.onePageNav', $.proxy(this.handleClick, this));

            //Get the section positions
            this.getPositions();

            //Handle scroll changes
            this.bindInterval();

            //Update the positions on resize too
            this.$win.on('resize.onePageNav', $.proxy(this.getPositions, this));

            return this;
        },

        adjustNav: function (self, $parent) {
            self.$elem.find('.' + self.config.currentClass).removeClass(self.config.currentClass);
            $parent.addClass(self.config.currentClass);
        },

        bindInterval: function () {
            var self = this;
            var docHeight;

            self.$win.on('scroll.onePageNav', function () {
                self.didScroll = true;
            });

            self.t = setInterval(function () {
                docHeight = self.$doc.height();

                //If it was scrolled
                if (self.didScroll) {
                    self.didScroll = false;
                    self.scrollChange();
                }

                //If the document height changes
                if (docHeight !== self.docHeight) {
                    self.docHeight = docHeight;
                    self.getPositions();
                }
            }, 250);
        },

        getHash: function ($link) {
            return $link.attr('href').split('#')[1];
        },

        getPositions: function () {
            var self = this;
            var linkHref;
            var topPos;
            var $target;

            self.$nav.each(function () {
                linkHref = self.getHash($(this));
                $target = $('#' + linkHref);

                if ($target.length) {
                    topPos = $target.offset().top;
                    self.sections[linkHref] = Math.round(topPos);
                }
            });
        },

        getSection: function (windowPos) {
            var returnValue = null;
            var windowHeight = Math.round(this.$win.height() * this.config.scrollThreshold);

            for (var section in this.sections) {
                if ((this.sections[section] - windowHeight) < windowPos) {
                    returnValue = section;
                }
            }

            return returnValue;
        },

        handleClick: function (e) {
            var self = this;
            var $link = $(e.currentTarget);
            var $parent = $link.parent();
            var newLoc = '#' + self.getHash($link);

            if (!$parent.hasClass(self.config.currentClass)) {
                //Start callback
                if (self.config.begin) {
                    self.config.begin();
                }

                //Change the highlighted nav item
                self.adjustNav(self, $parent);

                //Removing the auto-adjust on scroll
                self.unbindInterval();

                //Scroll to the correct position
                self.scrollTo(newLoc, function () {
                    //Do we need to change the hash?
                    if (self.config.changeHash) {
                        window.location.hash = newLoc;
                    }

                    //Add the auto-adjust on scroll back in
                    self.bindInterval();

                    //End callback
                    if (self.config.end) {
                        self.config.end();
                    }
                });
            }

            e.preventDefault();
        },

        scrollChange: function () {
            var windowTop = this.$win.scrollTop();
            var position = this.getSection(windowTop);
            var $parent;

            //If the position is set
            if (position !== null) {
                $parent = this.$elem.find('a[href$="#' + position + '"]').parent();

                //If it's not already the current section
                if (!$parent.hasClass(this.config.currentClass)) {
                    //Change the highlighted nav item
                    this.adjustNav(this, $parent);

                    //If there is a scrollChange callback
                    if (this.config.scrollChange) {
                        this.config.scrollChange($parent);
                    }
                }
            }
        },

        scrollTo: function (target, callback) {
            var offset = $(target).offset().top;

            $('html, body').animate({
                scrollTop: offset
            }, this.config.scrollSpeed, this.config.easing, callback);
        },

        unbindInterval: function () {
            clearInterval(this.t);
            this.$win.unbind('scroll.onePageNav');
        }
    };

    OnePageNav.defaults = OnePageNav.prototype.defaults;

    $.fn.onePageNav = function (options) {
        return this.each(function () {
            new OnePageNav(this, options).init();
        });
    };

})(jQuery, window, document);


//jquery.pin.js
(function ($) {
    "use strict";
    $.fn.pin = function (options) {
        var scrollY = 0, elements = [], disabled = false, $window = $(window);

        options = options || {};

        var recalculateLimits = function () {
            for (var i = 0, len = elements.length; i < len; i++) {
                var $this = elements[i];

                if (options.minWidth && $window.width() <= options.minWidth) {
                    if ($this.parent().is(".pin-wrapper")) {
                        $this.unwrap();
                    }
                    $this.css({width: "", left: "", top: "", position: ""});
                    if (options.activeClass) {
                        $this.removeClass(options.activeClass);
                    }
                    disabled = true;
                    continue;
                } else {
                    disabled = false;
                }

                var $container = options.containerSelector ? $this.closest(options.containerSelector) : $(document.body);
                var offset = $this.offset();
                var containerOffset = $container.offset();
                var parentOffset = $this.offsetParent().offset();

                if (!$this.parent().is(".pin-wrapper")) {
                    $this.wrap("<div class='pin-wrapper'>");
                }

                var pad = $.extend({
                    top: 0,
                    bottom: 0
                }, options.padding || {});

                $this.data("pin", {
                    pad: pad,
                    from: (options.containerSelector ? containerOffset.top : offset.top) - pad.top,
                    to: containerOffset.top + $container.height() - $this.outerHeight() - pad.bottom,
                    end: containerOffset.top + $container.height(),
                    parentTop: parentOffset.top
                });

                $this.css({width: $this.outerWidth()});
                $this.parent().css("height", $this.outerHeight());
            }
        };

        var onScroll = function () {
            if (disabled) {
                return;
            }

            scrollY = $window.scrollTop();

            var elmts = [];
            for (var i = 0, len = elements.length; i < len; i++) {
                var $this = $(elements[i]),
                    data = $this.data("pin");

                if (!data) { // Removed element
                    continue;
                }

                elmts.push($this);

                var from = data.from - data.pad.bottom,
                    to = data.to - data.pad.top;

                if (from + $this.outerHeight() > data.end) {
                    $this.css('position', '');
                    continue;
                }

                if (from < scrollY && to > scrollY) {
                    !($this.css("position") == "fixed") && $this.css({
                        left: $this.offset().left,
                        top: data.pad.top
                    }).css("position", "fixed");
                    if (options.activeClass) {
                        $this.addClass(options.activeClass);
                    }
                } else if (scrollY >= to) {
                    $this.css({
                        left: "",
                        top: to - data.parentTop + data.pad.top
                    }).css("position", "absolute");
                    if (options.activeClass) {
                        $this.addClass(options.activeClass);
                    }
                } else {
                    $this.css({position: "", top: "", left: ""});
                    if (options.activeClass) {
                        $this.removeClass(options.activeClass);
                    }
                }
            }
            elements = elmts;
        };

        var update = function () {
            recalculateLimits();
            onScroll();
        };

        this.each(function () {
            var $this = $(this),
                data = $(this).data('pin') || {};

            if (data && data.update) {
                return;
            }
            elements.push($this);
            $("img", this).one("load", recalculateLimits);
            data.update = update;
            $(this).data('pin', data);
        });

        $window.scroll(onScroll);
        $window.resize(function () {
            recalculateLimits();
        });
        recalculateLimits();

        $window.load(update);

        return this;
    };
})(jQuery);

/**
 * 楼层商品特效显示
 */
(function(){
$.fn.jfade = function(settings) {//首页标准模块中间多图广告鼠标触及凸显
        var defaults = {
            start_opacity: "1",
            high_opacity: "1",
            low_opacity: ".1",
            timing: "500"
        };
        var settings = $.extend(defaults, settings);
        settings.element = $(this);
        //set opacity to start
        $(settings.element).css("opacity", settings.start_opacity);
        //mouse over
        $(settings.element).hover(
        //mouse in
        function() {
            $(this).stop().animate({
                opacity: settings.high_opacity
            },
            settings.timing); //100% opacity for hovered object
            $(this).siblings().stop().animate({
                opacity: settings.low_opacity
            },
            settings.timing); //dimmed opacity for other objects
        },
        //mouse out
        function() {
            $(this).stop().animate({
                opacity: settings.start_opacity
            },
            settings.timing); //return hovered object to start opacity
            $(this).siblings().stop().animate({
                opacity: settings.start_opacity
            },
            settings.timing); // return other objects to start opacity
        });
        return this;
    }
})(jQuery);


var indexFixedLeftMenu = function($){

    var bxSliderObj  = null ;

    function initBxSlider (){
        if (bxSliderObj) return ;
        var q = $("#fixedAdvPanel").find("li").length;
        if(q == 1){
           bxSliderObj = $("#fixedAdvPanel").bxSlider({
            auto: true,
            infiniteLoop: false,
            hideHoverControls: false
            });
        $("#nav").find(".bx-default-pager").css("display","none"); 
        }else{
            bxSliderObj = $("#fixedAdvPanel").bxSlider({
            auto: true,
            infiniteLoop: true,
            hideHoverControls: false
        });
        }       
    }

    function desBxSlider () {
        bxSliderObj && bxSliderObj.destroySlider()
        bxSliderObj = null ;
    }
    return {
        init:function(){
            //首页楼层定位
            var $navShow = $(".J-floor:first") ;
            if ($navShow.length){
                var navShowPostion = $navShow.offset().top-1;
                $(window).scroll(function () {
                    var b = $(this).scrollTop(),
                        $nav = $("#nav");
                    if (b > navShowPostion){
                        $nav.addClass("show");
                        initBxSlider();
                    }else{
                        $nav.removeClass("show");
                        desBxSlider();
                    }
                });
                $(window).triggerHandler("scroll");
            }
            //页内导航条位置
            $('#nav .side-ul').onePageNav({
                filter: ':not(.exception)'
            });
        }
    }
}(jQuery);



$(function () {
    //顶部banner 轮播
    $('#homeTopBanner').bxSlider({
        auto: true,
        //captions: true,
        infiniteLoop: true,
        autoHover: true,
        //responsive:true,
        hideHoverControls: true
    });

    //楼层轮播图
    var a = $("ul[data-nc-floor-slider]");
    a.length && $.each(a, function (i, n) {
        var $this = $(n), $li = $this.find("li"), _slider;
        if ($li.length > 1){
            $this.data ("nc.slider" ,$this.bxSlider({
                auto: true,
                //captions: true,
                infiniteLoop: true,
                autoHover: true,
                //responsive:true,
                hideHoverControls: true
            })
            )
        }
    })

    //首页tab
    $("ul[data-tabs-nav] > li a").bind('mouseover', (function (e) {
        if (e.target == this) {
            var tabs = $(this).closest("ul").find("li a");
            var panels = $(this).closest(".home-standard-layout").find(".tabs-panel");
            var index = $.inArray(this, tabs);
            if (panels.eq(index)[0]) {
                tabs.removeClass("tabs-selected").eq(index).addClass("tabs-selected");
                panels.addClass("tabs-hide").eq(index).removeClass("tabs-hide");
            }
        }
    }));

    //首页楼层tab
    $("ul[data-nc-floor-tab] >li").bind('mouseover', (function (e) {
        console.log("首页楼层tab")
        var tabs = $(this).closest("ul").find("li"),
            panels = $(this).closest("[data-nc-floor-panel]").find(".main"),
            index = $.inArray(this, tabs),
            slider = panels.eq(index).find("ul[data-nc-floor-slider]"),
            sliderData = slider.length && slider.data("nc.slider")
            ;
        if (panels.eq(index)[0]) {
            tabs.removeClass("tab-selected").eq(index).addClass("tab-selected");
            panels.addClass("tab-hide").eq(index).removeClass("tab-hide");
        }
        sliderData && sliderData.reloadSlider();
    }));

    //楼层轮播图
    //$('.floor .slider-main').bxSlider({
    //    auto: true,
    //    //captions: true,
    //    infiniteLoop: true,
    //    autoHover: true,
    //    //responsive:true,
    //    hideHoverControls: true
    //});

    //左侧导航条
    indexFixedLeftMenu.init();

    //首页楼层商品展示特效
    $('.home-standard-layout .g-list > li').jfade({
        start_opacity: "0.9",
        high_opacity: "1",
        low_opacity: ".25",
        timing: "500"
    });

    //央广首页视频效果
    function autoPlay(){
　　time = setInterval(function(){
　　　　$('#special_img').animate({width:"160px", height:"160px",left:"-70px"}, 2500)
        $('#special_img').animate({left:"-70px",top:"-101px"}, 2500)
        $('#special_img').animate({left:"0px",top:"-101px"}, 2500)
        $('#special_img').animate({left:"0",top:"-0px"}, 2500)
        $('#special_img').animate({width:"90px",height:"59px"}, 2500)
        $('#special_img').delay(1000)
　　　　},2000);
    }
    autoPlay();　
});

