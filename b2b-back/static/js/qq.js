/**
 * Created by sunwei on 15/11/11.
 */
$(document).ready(function () {
    $(document.createElement('script')).attr('src', 'http://wpa.b.qq.com/cgi/wpa.php').appendTo('head');
    setTimeout(function () {
        BizQQWPA.addCustom(
            [
                {aty: 1, a: 1002, nameAccount: 800110999, selector: 'qq1'},
                {aty: 1, a: 1003, nameAccount: 800110999, selector: 'qq2'},
                {aty: 1, a: 1002, nameAccount: 800110999, selector: 'qq3'},
                {aty: 1, a: 1002, nameAccount: 800110999, selector: 'qq4'},
                {aty: 1, a: 1003, nameAccount: 800110999, selector: 'qq5'},
                {aty: 1, a: 1004, nameAccount: 800110999, selector: 'qq6'},
                {aty: 1, a: 1003, nameAccount: 800110999, selector: 'qq7'},
                {aty: 1, a: 1004, nameAccount: 800110999, selector: 'qq8'},
                {aty: 1, a: 1002, nameAccount: 800110999, selector: 'qq9'},
            ]
        );
    }, 1000);
});

function preview() {
    bdhtml = window.document.body.innerHTML;
    sprnstr = "<!--startprint-->";
    eprnstr = "<!--endprint-->";
    prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17);
    prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
    window.document.body.innerHTML = prnhtml;
    window.print();
}
$(function(){
    $(".sidebar h1").click(function() {
				$(".sidebar").animate({
					"left": "-280px"
				}, 200);
				$(".main").animate({
					"left": "0"
				}, 200);
				$(".station").animate({
					"left": "0"
				}, 200)
				$(".hb_switch").fadeIn(500)
				$(".footer").animate({
					"left": "0"
				}, 200);
			})
			$(".hb_switch").click(function() {
				$(".sidebar").animate({
					"left": "0"
				}, 200);
				$(".main").animate({
					"left": "280px"
				}, 200);
				$(".station").animate({
					"left": "280px"
				}, 200);
				$(".footer").animate({
					"left": "280px"
				}, 200);
				$(".hb_switch").fadeOut(500)
			})
})