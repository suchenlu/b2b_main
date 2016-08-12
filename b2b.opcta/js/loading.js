
jQuery.fn.extend({
    propertychange: function(fn) {
        if (!+ [1, ] != true) {
            $(this).get(0).addEventListener("input", fn, false)
        }
        $(this).bind("propertychange", fn);
        return this
    }
});

$(window).load(function() {
	defaultSet();
	$('body').keydown(function(event){checkKeyDown(event);});
	$('body').keyup(function(event){checkKeyUp(event);});
	tishiBox = new LightBox("tishiDiv");
});

function defaultSet(){
	imgzoom();
	inputValue();
}

function imgzoom(){
	$("div").each(function(i,child){
		var maxwidth = $(child).attr("maxwidth");
		var maxheight = $(child).attr("maxheight")
		if(isEmpty(maxwidth)==false && isEmpty(maxheight)==false){
			$(child).css("position","relative");
		//	var divwidth = $(child).css("width");
		//	var divheight = $(child).css("height");
		//	if(divwidth.length>2 && divwidth.substring(divwidth.length-2)=="px"){
		//		divwidth = divwidth.substring(0,divwidth.length-2);
		//	}else{
		//		divwidth = maxwidth;
		//	}
		//	if(divheight.length>2 && divheight.substring(divheight.length-2)=="px"){
		//		divheight = divheight.substring(0,divheight.length-2);
		//	}else{
		//		divheight = maxheight;
		//	}
			var divwidth = maxwidth;
			var divheight = maxheight;
			
			var imgObject = $(child).find("img").eq(0);
			var img = new Image();
			img.onload = function(){
				var width = img.width;
				var height = img.height;
				var showwidth = width;
				var showheight = height;
				if(width>maxwidth && width/height>=maxwidth/maxheight){
					showwidth = maxwidth;
					showheight = maxwidth/width*height;
				}
				if(height>maxheight && height/width>=maxheight/maxwidth){
					showheight = maxheight;
					showwidth = maxheight/height*width;
				}
				//alert(img.src);
				//alert("AA || " + maxwidth + " || " + maxheight + " || " + width + " || " + height + " || " + showwidth + " || " + showheight);
				//alert("DD || " + parseInt((divwidth-showwidth)/2) + " || " + parseInt((divheight-showheight)/2));
				//imgObject.css({"position":"absolute","margin-left":parseInt((divwidth-showwidth)/2),"margin-top":parseInt((divheight-showheight)/2)});
				imgObject.css('width',showwidth+'px');
				imgObject.css('height',showheight+'px');
				imgObject.css({"margin-left":parseInt((divwidth-showwidth)/2),"margin-top":parseInt((divheight-showheight)/2),"margin-right":parseInt((divwidth-showwidth)/2),"margin-buttom":parseInt((divheight-showheight)/2)});
			};
			img.src = imgObject.attr("src");
		}
	});
}

function inputValue(){
	$("input,textarea,select,hidden").each(function(i,child){
		var tipText = $(child).attr("tipText");
		var validateType = $(child).attr("validateType");
		if(isEmpty(tipText)==false){
			var currValue = $(child).val();
			if(isEmpty(currValue)){
				$(child).val(tipText);
				$(child).css({"color":"#888"});
			}
			$(child).focus(function(){
				$(child).css({"color":"#000"})
				if($(child).val()==tipText){
					$(child).val("");
				}
			})
			$(child).blur(function(){
				if($(child).val()=="" || $(child).val()==tipText){
					$(child).val(tipText).css({"color":"#888"})
				}else{
					$(child).css({"color":"#000"})
				}
			})
		}
		if(isEmpty(validateType)==false){
			if(validateType == "HideText"){
				var sName = $(child).attr("id");
				var vName = sName.substring(0,sName.length-5);
				//alert(vName);
				$(child).focus(function(){
					$('#'+sName).hide();  
                    $('#'+vName).show();
                    $('#'+vName).focus();
				})
				$('#'+vName).blur(function(){
					if($('#'+vName).val()==""){
						$('#'+sName).show();  
	                    $('#'+vName).hide();
					}
				})
			}else{
				var formName = $(child).parents("form").attr('name');
				var objName = $(child).attr('id');
				if(objName == null || objName.length==0) {
					objName = $(child).attr('name');
				}
				var disName = $(child).attr("disName");
				//alert(disName);
				var maxTextLength = $(child).attr("maxTextLength");
				var minTextLength = $(child).attr("minTextLength");
				var isnotnull = $(child).attr("isnotnull");
			//	if(isEmpty(maxTextLength)==false || isEmpty(minTextLength)==false || (isEmpty(isnotnull)==false && isnotnull!='n')){
					addField(formName, objName, validateType, maxTextLength, disName, isnotnull, minTextLength);
			//	}
			}
		}
	});
	
	$("a,span,img").each(function(i,child){
		var userId = $(child).attr("userId");
		var groupId = $(child).attr("groupId");
		var showMenu = $(child).attr("showMenu");
		var id = $(child).attr("id");
		if(isEmpty(userId)==false){
			$(this).css("cursor","pointer"); 
			$(this).unbind( "click" );
			$(this).click(function() {
				gotoUserPage(userId);
			});
		}
		if(isEmpty(groupId)==false){
			$(this).unbind( "click" );
			$(this).click(function() {
				gotoGroupPage(groupId);
			});
		}
		if(isEmpty(userId)==false && isEmpty(showMenu)==false){
			var tanchu;
			$(this).mouseover(function() {
	        	tanchu=setInterval(function(){getMenuInfo(userId,id)},1000);
	        });
			$(this).mouseout(function() {
				clearInterval(tanchu);
	       	});
		}
	});
}


$(document).ready(function() {
	$("tbody[name='dataBody'] tr:nth-child(odd)").css("background-color", "#ebebeb");
	$("tbody[name='dataBody'] tr:nth-child(even)").css("background-color", "#f6f6f6");
	$("tbody[name='dataBody'] td:nth-child(even)").css("background-color", "#f6f6f6");
	$("tbody[name='dataBody'] tr:nth-child(even) td:nth-child(even)").css("background-color", "#fff");
});
