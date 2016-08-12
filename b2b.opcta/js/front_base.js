/**
* Created by sunwei on 15/9/15.
*/

//站点切换
jQuery(".city_list").slide({mainCell: ".bd ul",trigger:"click",easing:"easeOutElastic"});

//城市站点切换开关
$(document).ready(function(){
    $("#header .switch_city").click(function(){
        $("#header .city_list").toggle();
        $(this).toggleClass("on");
    });
});

//导航－产品线路下拉菜单
$("#drop").hover(function(){
    $(".drop_box").show();
},function(){
    $(".drop_box").hide();
});

//侧边栏sidebar开关
$(document).ready(function(){
    $(".sidebar .close").click(function(){
        $(".sidebar .contentBOX").fadeOut();
        $(".sidebar .switch").show(500);
    });
    $(".sidebar .switch").click(function(){
        $(this).hide(500);
        $(".sidebar .contentBOX").fadeIn(1000);
    });
});

//回到页面顶部位置
$(function(){
$(".backTop").click(function(){
    $('body,html').animate({scrollTop:0},1000);
    return false;
});
})
//前台页面弹出提示框
$(function(){
    $('.up .close').click(function(e) {
        $(this).parents('.up').fadeOut();
    });
});
$(function(){
    $(".up .close").hover(function(){
        $(".up .close_01").show();
    },function(){
        $(".up .close_01").hide();
    });
});

//可信网站图片LOGO安装开始
(function () {
   var _kxs = document.createElement('script');
   _kxs.id = 'kx_script';
   _kxs.async = true;
   _kxs.setAttribute('cid', 'kx_verify');
   _kxs.src = ('https:' == document.location.protocol ? 'https://ss.knet.cn' : 'http://rr.knet.cn') + '/static/js/icon3.js?sn=e15020611010557644yqeu000000&tp=icon3';
   _kxs.setAttribute('size', 0);
   var _kx = document.getElementById('kx_verify');
   _kx.parentNode.insertBefore(_kxs, _kx);
})();

//诚信网站图片LOGO安装开始
(function(){document.getElementById('___szfw_logo___').oncontextmenu = function(){return false;}})();
//页面滑到最底部才出现footer的板块(联系我们)
$(function(){
    var footerToggle = function(){
    	
        var bodyHeight = $(document).height();
        var windowHeight = $(window).height();
        var scrollTop = $(window).scrollTop();
        if(scrollTop > (bodyHeight - windowHeight - 10)){
            $("#footer").show();
        }else{
            $("#footer").hide();
        }

        if(scrollTop < (bodyHeight - windowHeight - 10)){
          $("#footer").css({"bottom":"-495"});
          $("#footer .on").css({"display":"block"})
        }
    }
//    footerToggle();
    $(window).scroll(function(){
        footerToggle();
    });
});
//底部footer板块开关
$(document).ready(function () {
    $("#footer .on").click(function () {
        $("#footer .on").slideUp();
        $("#footer .off").slideDown();
         $("#footer").animate({
            "bottom": 0
        }, 500)
    });
    $("#footer .off").click(function () {
        $("#footer .on").slideDown();
        $("#footer .off").slideUp();
        $("#footer").animate({
            "bottom": -495
        }, 500)
    });
});




