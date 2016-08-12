//var rootweb = "/charity2013";
//var noneImg1 = "/charity2013/images/common/none.jpg";
var rootweb = "";
var noneImg1 = "/images/common/none.jpg";

function openPage(event){
	var url = event;
	event=window.event==null?event:window.event;
	obj = event.srcElement ? event.srcElement : event.target;
	$(obj).attr("href","###");
	location.href=url;
	return false;
}
function openNewPage(){
	var args = openNewPage.arguments;
	window.open(args[0]);
}
function openValidatePage(){
	var args = openValidatePage.arguments;
	var url = args[0];
	$("#url").val(url);
	callDivPage('verifyLoginDiv','verifyLoginForm');
}
function openValidateScreenPage(){
	var args = openValidateScreenPage.arguments;
	var visiturl = args[0];
	$("#visiturl").val(visiturl);
	callDivPage('tishiDiv','verifyScreenForm',visiturl);
}
function closePage(){
	opener=null;
	window.close();
}
function closeDivPage(){
	var divname = closeDivPage.arguments[0];
	$("#"+divname).dialog('close');
}
//参数： 1、form名称  2、action地址  3、是否js验证
function callPage(){
	var args = callPage.arguments;
	var form = document.forms[0];
	var checkJs = "Y";
	if(args.length > 0){
		form = document.forms[args[0]];
	}
	var formId = form.id;
	clearTipText(formId);
	if(args.length > 2 && args[2].length>0){
		checkJs = args[2];
	}
	if(checkJs == 'Y'){
		var ret = '';
		if(args.length == 0){
			ret = checkAll();
		}
		else if(args.length > 0){
			ret = checkAll(formId);
		}
		if(ret.length > 0){
			//alert(ret);
			setFocus(focuspos);
			return ;
		}
	}
	if(form != null){
		if(args.length>1 && args[1].length>0){
			form.action = args[1];
		}
		form.submit();
	}
}
function resetPage(){
	var args = resetPage.arguments;
	var form = document.forms[0];
	if(args.length > 0){
		form = document.forms[args[0]];
	}
	if(form != null){
		form.reset();
		setFocus(0);
	}
}
function callTabPage(pageurl){
	location.href = pageurl;
}
//参数： 1、div名称  2、提交的表单名称  3、action地址  4、html追加方式  5、是否js验证
function callDivPage(){
	var args = callDivPage.arguments;
	var url = "";
	var params = "";
	var divname = "";
	var htmlOpt = "replace";
	var checkJs = "Y";
	if(args.length<2 || args.length>5){
		return;
	}
	divname = args[0];
	if(args[1].length>0){
		clearTipText(args[1]);
		params = $("#" + args[1]).serialize();
		url = $("#" + args[1]).attr("action");
	}
	if(args.length>2 && args[2].length>0){
		url = args[2];
	}
	if(args.length>3 && args[3].length>0){
		htmlOpt = args[3];
	}
	if(args.length>4 && args[4].length>0){
		checkJs = args[4];
	}
	
	if(args[1].length>0){
		clearTipText(args[1]);
		if(checkJs == 'Y'){
			var ret = checkAll(args[1]);
			if(ret.length > 0){
				setFocus(focuspos);
				return;
			}
		}
	}
	//alert(url);
	$.ajax({
		type: "POST",
		url: url,
		cache: false,
		ifModified: true,
		data: params,
		//contentType: "application/x-www-form-urlencoded; charset=utf-8",
		dataType: "html",
		success: function(html){
			if(htmlOpt == 'replace'){
				//alert(html);
				$("#"+divname).html(html);
			}
			else if(htmlOpt == 'append'){
				$("#"+divname).append(html);
			}
			$("#"+divname).dialog('open');
      	},
      	error: function(html){
      		//alert(html.readyState);
      		//alert(html.status);
      		//alert("请求失败或超时，请稍后再试！");
		}
	});
}

function clearTipText(formName){
	$("form[name='"+formName+"']").find("input,textarea").each(function(i,child){
		var tipText = $(child).attr("tipText");
		if(isEmpty(tipText)==false){
			var currValue = $(child).val();
			if(currValue==tipText){
				$(child).val('');
			}
		}
	});
}

var FORMNAME= 0; //表单名称
var NAME    = 1; //输入框的名称
var TYPE    = 2; //输入的类型：String、Number、Date、DateTime、Mask
var MAXNUM  = 3; //String（最大长度）、Number（最大值）
var MINNUM  = 4; //String（最小长度）、Number（最小值）
var VALUE   = 5; //保存输入之前的值
var DISNAME = 6; //输入不正确，而报警时，显示的名称
var ISNONULL= 7; //是否不能为空
var NEXT    = 8; //下一组信息存放的位置

var objArray=new Array();
var focuspos = -1;
//添加一组监控信息
function addField(){
	var args = addField.arguments;
	if(args.length < 3)
		return false;
	objArray = getObjArray();
	if(objArray == null)
		return false;
	var size = objArray.length;
	objArray[size+FORMNAME]= args[0];
	objArray[size+NAME]    = args[1];
	objArray[size+TYPE]    = args[2];
	if(args[3])
		objArray[size+MAXNUM]  = args[3];
	else
		objArray[size+MAXNUM]  = -1;
	objArray[size+VALUE]   = '';
	if(args[4])
		objArray[size+DISNAME] = args[4];
	else
		objArray[size+DISNAME] = objArray[size+NAME];
	if(args[5])
		objArray[size+ISNONULL] = args[5];
	else
		objArray[size+ISNONULL] = 'n';
	if(args[6])
		objArray[size+MINNUM] = args[6];
	else
		objArray[size+MINNUM] = '0';
}
//输入时，按键前的检查
function checkKeyDown(event){
	objArray = getObjArray();
	if(objArray == null)
		return true;
	obj = event.srcElement ? event.srcElement : event.target;
	if(obj == null)
		return true;
	pos = getObjPosition(obj);
	//alert("pos = " + pos);
	if(pos < 0)
		return true;
	//取出当前输入框的类型
	type = objArray[pos+TYPE];
	//取出当前输入框的长度限制
	maxnum = objArray[pos+MAXNUM];
	//alert("type = " + type);
	//alert("maxnum = " + maxnum);
	if(isNumber(maxnum) && maxnum>0){
		if(getObjectValue(obj).length > maxnum){
			setObjectValue(obj, objArray[pos+VALUE]);
			return;
		}
	}
	//检查当前值是否有效，如果无效则回执为原来的值
	if(!checkType(obj, type, maxnum)){
		setObjectValue(obj, objArray[pos+VALUE]);
		getJqueryObject(pos).change();
	}
	else
		objArray[pos+VALUE] = getObjectValue(obj);
}
//输入时，按键后的检查
function checkKeyUp(event){
	objArray = getObjArray();
	if(objArray == null)
		return false;
	obj = event.srcElement ? event.srcElement : event.target;
	if(obj == null)
		return true;
	pos = getObjPosition(obj);
	if(pos < 0)
		return true;
	type = objArray[pos+TYPE];
	maxnum = objArray[pos+MAXNUM];
	if(isNumber(maxnum) && maxnum>0){
		if(getObjectValue(obj).length > maxnum){
			setObjectValue(obj, objArray[pos+VALUE]);
			return;
		}
	}
	if(!checkType(obj, type, maxnum)){
		setObjectValue(obj, objArray[pos+VALUE]);
		getJqueryObject(pos).change();
	}
	else
		objArray[pos+VALUE] = getObjectValue(obj);
	//如果是回车，转移焦点或者提交当前页面
//	if(event.keyCode == 13){
//		if(pos+NEXT == objArray.length){
		//	var ret = checkAll();
		//	if(ret.length > 0){
		//		alert(ret);
		//		setFocus(focuspos);
		//		return true;
		//	}
//		}
//		else
//			setFocus(pos+NEXT);
//	}
	return true;
}
//设置焦点位置
function setFocus(pos){
	objArray = getObjArray();
	if(objArray == null)
		return false;
	obj = getObject(pos);
	if(obj != null){
		obj.focus();
	}
}
//获得jquery对象
function getJqueryObject(pos){
	objArray = getObjArray();
	if(objArray == null)
		return;
	if(objArray[pos+FORMNAME]==null || objArray[pos+FORMNAME].length==0){
		if(objArray[pos+NAME] != null){
			var obj = $("#" + objArray[pos+NAME]);
			if(obj.length == 0){
				obj = $("*[name='" + objArray[pos+NAME] + "']");
			}
			return obj;
		}
	}
	else{
		if(objArray[pos+NAME] != null){
			var obj = $("form[name='" + objArray[pos+FORMNAME] + "']").find("*[name='" + objArray[pos+NAME] + "']");
			if(obj.length == 0){
				obj = $("#" + objArray[pos+NAME]);
			}
			return obj;
		}
	}
	return;
} 
//获得某个页面对象
function getObject(pos){
	objArray = getObjArray();
	if(objArray == null)
		return;
	if(objArray[pos+FORMNAME]==null || objArray[pos+FORMNAME].length==0){
		if(objArray[pos+NAME] != null){
			var obj = $("#" + objArray[pos+NAME]);
			if(obj.length == 0){
				obj = $("*[name='" + objArray[pos+NAME] + "']");
			}
			return obj.get(0);
		}
	}
	else{
		if(objArray[pos+NAME] != null){
			var obj = $("form[name='" + objArray[pos+FORMNAME] + "']").find("*[name='" + objArray[pos+NAME] + "']");
			if(obj.length == 0){
				obj = $("#" + objArray[pos+NAME]);
			}
			return obj.get(0);
		}
	}
	return;
}
function getObjectValue(obj){
		pos = getObjPosition(obj);
		if(pos < 0) return null;
		var type = objArray[pos+TYPE];
		if(type == 'FCKString'){
			var oEditor = FCKeditorAPI.GetInstance(obj.name);
			return oEditor.EditorDocument.body.innerText;
		}else{
			return obj.value;
		}
}
function setObjectValue(obj, value){
		pos = getObjPosition(obj);
		if(pos < 0) return null;
		var type = objArray[pos+TYPE];
		if(type == 'FCKString'){
			var oEditor = FCKeditorAPI.GetInstance(obj.name);
			oEditor.EditorDocument.body.innerText = value;
		}else{
			obj.value = value;
		}
}
function getObjectTishiDiv(pos){
	objArray = getObjArray();
	if(objArray == null)
		return;
	if(objArray[pos+FORMNAME]==null || objArray[pos+FORMNAME].length==0){
		return $("#" + objArray[pos+NAME] + "TishiDiv");
	}
	else{
		var obj = $("form[name='" + objArray[pos+FORMNAME] + "']").find("*[name='" + objArray[pos+NAME] + "TishiDiv']");
		if(obj.length == 0){
			obj = $("#" + objArray[pos+NAME] + "TishiDiv");
		}else{
			obj = obj[0];
		}
		return obj;
	}
	return;
}
function getFormname(pos){
	objArray = getObjArray();
	if(objArray == null)
		return;
	if(objArray[pos+FORMNAME] != null){
		return objArray[pos+FORMNAME];
	}
	return;
}
//对所有监控信息进行检查
function checkAll(){
	var ret = '';
	objArray = getObjArray();
	if(objArray == null)
		return ret;
	setFocuspos(-1);
	var args = checkAll.arguments;
	var checkFname = "";
	if(args.length > 0){
		checkFname = args[0];
	}
	for(var i=0;i<objArray.length;i+=NEXT){
		if(checkFname != "" && checkFname!=getFormname(i))
			continue;
		obj = getObject(i);
		if(obj == null) continue;
		type = objArray[i+TYPE];
		isnonull = objArray[i+ISNONULL];
		var errorFlag = false;
		var objTishiDiv = getObjectTishiDiv(i);
		maxnum = objArray[i+MAXNUM];
		if(isnonull=='y' || (getObjectValue(obj).length>0)){
			if((getObjectValue(obj).length == 0)&&(objArray[i+ISNONULL] == 'y'))
			{
				errorFlag = true;
				ret = ret + objArray[i+DISNAME] + '不能为空\n';
				objTishiDiv.html(objArray[i+DISNAME] + '不能为空');
				setFocuspos(i);
			}
			else if(!checkType(obj, type, maxnum, true))
			{
				errorFlag = true;
				ret = ret + objArray[i+DISNAME] + ' 类型为 ' + type + '，与输入不符\n';
				objTishiDiv.html(objArray[i+DISNAME] + '输入格式不正确');
				setFocuspos(i);
			}
		}
		if(type=='FCKString' && maxnum>0 && getObjectValue(obj).length>maxnum){
			errorFlag = true;
			ret = ret + objArray[i+DISNAME] + ' 不能大于 ' + maxnum + '个字符\n';
			objTishiDiv.html(objArray[i+DISNAME] + '不能大于' + maxnum + '个字符');
			setFocuspos(i);
		}
		minnum = objArray[i+MINNUM];
		if(type=='String' || type == 'SubString' || type == 'AllString' || type=='FCKString'){
			if(minnum>0 && getObjectValue(obj).length>0 && getObjectValue(obj).length<minnum){
				errorFlag = true;
				ret = ret + objArray[i+DISNAME] + ' 不能少于 ' + minnum + '个字符\n';
				objTishiDiv.html(objArray[i+DISNAME] + '不能少于' + minnum + '个字符');
				setFocuspos(i);
			}
		}
		else if(type == 'int' || type == 'Integer' || type == 'Long' || type == 'Double'){
			if(minnum>0 && getObjectValue(obj).length>0 && parseInt(value, 10)<minnum){
				errorFlag = true;
				ret = ret + objArray[i+DISNAME] + ' 不能小于 ' + minnum + '\n';
				objTishiDiv.html(objArray[i+DISNAME] + '不能小于' + minnum);
				setFocuspos(i);
			}
		}
		if(errorFlag == false){
			objTishiDiv.html("");
		}
	}
	return ret;
}
function setFocuspos(posnum){
	if(focuspos == -1){
		focuspos = posnum;
	}
	if(posnum == -1){
		focuspos = posnum;
	}
}
//对某一监控信息进行检查
function checkType(obj, type, maxnum, lastCheck)
{
	if(type == 'String')
	{
		return checkString(obj, maxnum);
	}
	else if(type == 'SubString')
	{
		return checkSubString(obj, maxnum);
	}
	else if(type == 'AllString')
	{
		return checkAllString(obj, maxnum);
	}
	else if(type == 'FCKString')
	{
		return checkFCKString(obj, maxnum);
	}
	else if(type == 'int')
	{
		return checkLong(obj, maxnum, lastCheck);
	}
	else if(type == 'Integer')
	{
		return checkLong(obj, maxnum, lastCheck);
	}
	else if(type == 'Long')
	{
		return checkLong(obj, maxnum, lastCheck);
	}
	else if(type == 'Double')
	{
		return checkDouble(obj, maxnum, lastCheck);
	}
	else if(type == 'Date')
	{
		if(lastCheck)
			return checkDate(obj);
		else
			return formatDate(obj);
	}
	else if(type == 'Mask')
	{
		if(lastCheck)
			return checkMask(obj);
		else
			return formatMask(obj);
	}
	else if(type == 'Mac')
	{
		if(lastCheck)
			return checkMac(obj);
		else
			return formatMac(obj);
	}
	else if(type == 'DateTime' || type == 'Timestamp')
	{
		if(lastCheck)
			return checkDateTime(obj);
		else
			return formatDateTime(obj);
	}
	else if(type == 'Time')
	{
		if(lastCheck)
			return checkTime(obj, 3);
		else
			return formatTime(obj, 3);
	}
	else if(type == 'ShortTime')
	{
		if(lastCheck)
			return checkTime(obj, 2);
		else
			return formatTime(obj, 2);
	}
	else if(type == 'Email')
	{
		if(lastCheck)
			return checkEmail(obj);
	}
	else if(type == 'Phone')
	{
		if(lastCheck)
			return checkPhone(obj);
	}
	else if(type == 'Tel')
	{
		if(lastCheck)
			return checkTel(obj);
	}
	else if(type == 'Mobile')
	{
		if(lastCheck)
			return checkMobile(obj);
	}
	else if(type == 'Url')
	{
		if(lastCheck)
			return checkUrl(obj);
	}
	else if(type == 'Zip')
	{
		if(lastCheck)
			return checkZip(obj);
	}
	else if(type == 'ICNumber')
	{
		return checkICNumber(obj, lastCheck);
	}
	else if(type == 'Number')
	{
		return checkNumber(obj);
	}
	return true;
}

function getObjArray()
{
	return objArray;
}
function getObjPosition(obj)
{
	objArray = getObjArray();
	if(objArray == null)
		return -1;
	for(var i=0; i<objArray.length; i=i+NEXT)
	{
		if(objArray[i + NAME] == obj.id)
			return i;
		else if(objArray[i + NAME] == obj.name)
			return i;
		else continue;
	}
	return -1;
}
//对String型进行检查,不能输入特殊字符且不能超长
function checkString(obj, maxnum)
{
	value = obj.value;
//	if(value.indexOf('\\') != -1) return false;
//	if(value.indexOf('\'') != -1) return false;
//	if(value.indexOf('"') != -1) return false;
//	if(value.indexOf('<') != -1) return false;
//	if(value.indexOf('>') != -1) return false;
	if(maxnum>0)
	{
		if(obj.value.length > maxnum)
			return false;
	}
	return true;
}
//对SubString型进行检查，控制其只能为字母加数字，且不能超长
function checkSubString(obj, maxnum)
{
	value = obj.value;
	for(var j=0; j<value.length; j++)
	{
		if(checkSubStringSingleChar(value.substr(j,j+1))==false)
			return false;
	}
	if(maxnum>0)
	{
		if(obj.value.length > maxnum)
			return false;
	}
	return true;
}
//对AllString型进行检查，不能超长
function checkAllString(obj, maxnum)
{
	if(maxnum>0)
	{
		if(obj.value.length > maxnum)
			return false;
	}
	return true;
}
//对FCKString型进行检查，不能超长
function checkFCKString(obj, maxnum)
{
	if(maxnum>0)
	{
		var oEditor = FCKeditorAPI.GetInstance(obj.name);
		var value = oEditor.EditorDocument.body.innerText;
		if(value.length > maxnum)
			return false;
	}
	return true;
}
//对Long型进行检查
function checkLong(obj, maxnum, lastCheck)
{
	value = obj.value;
	if(!lastCheck){
		if(value == '-') return true;
	}
	if(isNaN(value))	return false;
	if(value == '') 	return true;
	ivalue = parseInt(value, 10);
	if(isNaN(ivalue))	return false;
	if(value.indexOf('.') > 0)	return false;
	if(maxnum>0)
	{
		if(ivalue>maxnum)
		{
			return false;
		}
	}
	return true;
}
//对Double型进行检查
function checkDouble(obj, maxnum, lastCheck)
{
	value = obj.value;
	if(!lastCheck){
		if(value == '-') return true;
	}
	if(isNaN(value))	return false;
	if(value == '') 	return true;
	ivalue = parseInt(value, 10);
	if(isNaN(ivalue))	return false;
	if(maxnum>0)
	{
		if(value>maxnum)
		{
			return false;
		}
	}
	return true;
}
//对DateTime型进行检查
var datetimeSeparator=' ';
function formatDateTime(obj)
{
	var value = obj.value;
	var datetimeArray = value.split(datetimeSeparator);
	if (datetimeArray.length > 2)
		return false;
	if (value.length>0 && value.indexOf(datetimeSeparator)==value.length-1)
	{
		return checkDate(obj);
	}
	else if (datetimeArray.length == 1)
	{
		return formatDate(obj);
	}
	else if (datetimeArray.length == 2)
	{
		var datevalue = datetimeArray[0];
		var timevalue = datetimeArray[1];
		if(!checkDateValue(datevalue))
		{
			return false;
		}
		else
		{
			return formatDateTime_time(obj);
		}
	}
	else return false;
}

var timeSeparator=':';  //时间的分隔符
//对Time型数据的检查
function formatTime(obj, areanum)
{
	var value = obj.value;
	var timevalue = obj.value;
	var timeArray = timevalue.split(timeSeparator);
	//areanum如果等于2，表示该时间为hh:mm，其他值则缺省表示为3
	if(areanum == 2)
	{
		if(timeArray.length>2) return false;
	}
	if (timeArray.length == 1) 
	{
		shour = timeArray[0];
		if(shour.length == 0)	return true;
		if(shour.length > 2)	return false;
		if(isNaN(shour))	return false;
		nhour = parseInt(shour, 10);
		if(isNaN(nhour))	return false;
		if(nhour >23 || nhour < 0)	return false;
		return true;
	}
	//输入小时、分钟
	else if (timeArray.length == 2)
	{
		shour = timeArray[0];
		sminute = timeArray[1];
		//判断小时
		if(isNaN(shour))	return false;
		if(shour.length > 2)	return false;
		nhour = parseInt(shour, 10);
		if(isNaN(nhour))	return false;
		if(nhour >23 || nhour < 0)	return false;
		//判断分钟
		if(sminute.length == 0)	return true;
		if(sminute.length > 2)	return false;
		if(isNaN(sminute))	return false;
		nminute = parseInt(sminute, 10);
		if(isNaN(nminute))	return false;
		if(nminute >59 || nminute < 0)	return false;
		return true;
	}
	//输入小时、分钟、秒
	else if (timeArray.length == 3)
	{
		shour = timeArray[0];
		sminute = timeArray[1];
		ssecond = timeArray[2];
			
		//判断小时
		if(isNaN(shour))	return false;
		if(shour.length > 2)	return false;
		nhour = parseInt(shour, 10);
		if(isNaN(nhour))	return false;
		if(nhour >23 || nhour < 0)	return false;
		
		//判断分钟
		if(sminute.length == 0)	return true;
		if(sminute.length > 2)	return false;
		if(isNaN(sminute))	return false;
		nminute = parseInt(sminute, 10);
		if(isNaN(nminute))	return false;
		if(nminute >59 || nminute < 0)	return false;
		
		//判断秒
		if(ssecond.length == 0)	return true;
		if(ssecond.length > 2)	return false;
		if(isNaN(ssecond))	return false;
		nsecond = parseInt(ssecond, 10);
		if(isNaN(nsecond))	return false;
		if(nsecond >59 || nsecond < 0)	return false;
		return true;
	}
	else return false; 
}
//对DateTime型数据中的time进行检查
function formatDateTime_time(obj)
{
	var value = obj.value;
	var datetimeArray = value.split(datetimeSeparator);
	var timevalue = datetimeArray[1];
	var timeArray = timevalue.split(timeSeparator);
	if (timeArray.length == 1) 
	{
		shour = timeArray[0];
		if(shour.length == 0)	return true;
		if(shour.length > 2)	return false;
		if(isNaN(shour))	return false;
		nhour = parseInt(shour, 10);
		if(nhour >23 || nhour < 0)	return false;
		//if(shour.length == 2)	obj.value = value+timeSeparator;
		//if(nhour > 2)	obj.value = value+timeSeparator;
		return true;
	}
	//输入小时、分钟
	else if (timeArray.length == 2)
	{
		shour = timeArray[0];
		sminute = timeArray[1];
		//判断小时
		if(isNaN(shour))	return false;
		if(shour.length > 2)	return false;
		nhour = parseInt(shour, 10);
		if(nhour >23 || nhour < 0)	return false;
		//判断分钟
		if(sminute.length == 0)	return true;
		if(sminute.length > 2)	return false;
		if(isNaN(sminute))	return false;
		nminute = parseInt(sminute, 10);
		if(nminute >59 || nminute < 0)	return false;
		//if(sminute.length == 2)	obj.value = value+timeSeparator;
		//if(nminute > 5)	obj.value = value+timeSeparator;
		return true;
	}
	//输入小时、分钟、秒
	else if (timeArray.length == 3)
	{
		shour = timeArray[0];
		sminute = timeArray[1];
		ssecond = timeArray[2];
			
		//判断小时
		if(isNaN(shour))	return false;
		if(shour.length > 2)	return false;
		nhour = parseInt(shour, 10);
		if(nhour >23 || nhour < 0)	return false;
		
		//判断分钟
		if(sminute.length == 0)	return true;
		if(sminute.length > 2)	return false;
		if(isNaN(sminute))	return false;
		nminute = parseInt(sminute, 10);
		if(nminute >59 || nminute < 0)	return false;
		
		//判断秒
		if(ssecond.length == 0)	return true;
		if(ssecond.length > 2)	return false;
		if(isNaN(ssecond))	return false;
		nsecond = parseInt(ssecond, 10);
		if(nsecond >59 || nsecond < 0)	return false;
		return true;
	}
	else return false; 
}

var dateSeparator='-';  //日期的分隔符
//日期输入过程中的格式化
function formatDate(obj) 
{
	var value = obj.value;
	var dateArray = value.split(dateSeparator); 
	//只输入年
	if (dateArray.length == 1) 
	{
		syear = dateArray[0];
		if(syear.length == 0)	return true;
		if(isNaN(syear))	return false;
		iyear = parseInt(syear);
		if(isNaN(iyear))	return false;
		if(iyear < 0) return false;
		if(syear.length == 4)
			obj.value = value+dateSeparator;
		if(syear.length > 4)	return false;
		return true;
	}
	//输入年月
	else if (dateArray.length == 2)
	{
		syear = dateArray[0];
		smonth = dateArray[1];
		//判断年份
		if(isNaN(syear)) return false;
		iyear = parseInt(syear);
		if(isNaN(iyear))	return false;
		if(iyear < 0) return false;
		if(syear.length > 4)	return false;
		//判断月份
		if(smonth.length == 0)	return true;
		if(isNaN(smonth))	return false;
		nmonth = parseInt(smonth, 10);
		if(isNaN(nmonth))	return false;
		if(nmonth >12 || nmonth < 1)	return false;
		if(nmonth > 1)	obj.value = value+dateSeparator;
		return true;
	}
	//输入年月日
	else if (dateArray.length == 3)
	{
		syear = dateArray[0];
		smonth = dateArray[1];
		sday = dateArray[2];
		
		//年份未输入，或者在小于等于四位有效
		if(isNaN(syear)) return false;
		if(syear.length > 4)	return false;
		
		//月份未输入，或者在[1..12]之间有效
		if(isNaN(smonth))	return false;
		nmonth = parseInt(smonth, 10);
		if(isNaN(nmonth))	return false;
		if(nmonth >12 || nmonth < 1)	return false;
		if(sday.length == 0)	return true;
		if(sday.length > 2)	return false;
		if(isNaN(sday))	return false;
		iday=parseInt(sday,10);
		if(isNaN(iday))	return false;
		//如果月份未输入，则天[1..31]之间
		if(smonth.length == 0)
			if(iday > 0 && iday < 32)
				return true;
			else return false;
		if(syear.length == 0)	return true;
		return checkDate(obj);
	}
	else return false; 
} 
//输入日期完成后的校验
function checkDate(obj)
{
	var value =obj.value;
	var dateArray = value.split(dateSeparator); 
	if (dateArray.length != 3) 
		return false;
	syear = dateArray[0]; 
	smonth = dateArray[1]; 
	sday = dateArray[2];
	if(syear.length == 0 || smonth.length == 0 || sday.length == 0)
		return false;
	return validDate(syear,smonth,sday);
}
//输入时间完成后的校验
function checkTime(obj, areanum)
{
	var value = obj.value;
	return checkTimeValue(value, areanum);
}
//输入日期时间完成后的校验
function checkDateTime(obj)
{
	var value = obj.value;
	var datetimeArray = value.split(datetimeSeparator);
	if (datetimeArray.length != 2)
		return false;
	if(checkDateValue(datetimeArray[0]) && checkTimeValue(datetimeArray[1]))
		return true;
	return false;
}
function checkDateValue(value)
{
	var dateArray = value.split(dateSeparator); 
	if (dateArray.length != 3) 
		return false;
	syear = dateArray[0]; 
	smonth = dateArray[1]; 
	sday = dateArray[2];
	if(syear.length == 0 || smonth.length == 0 || sday.length == 0)
		return false;
	return validDate(syear,smonth,sday);
}
function checkTimeValue(value, areanum)
{
	var timeArray = value.split(timeSeparator); 
	if(areanum == 2)
	{
		if (timeArray.length != 2) 
			return false;
		shour = timeArray[0]; 
		sminute = timeArray[1]; 
		if(shour.length == 0 || sminute.length == 0 )
			return false;
		var ihour=parseInt(shour,10);
		var iminute=parseInt(sminute,10);
		if(ihour > 23 || ihour < 0) return false;
		if(iminute > 59 || iminute < 0) return false;
	}
	else
	{
		if (timeArray.length != 3) 
			return false;
		shour = timeArray[0]; 
		sminute = timeArray[1]; 
		ssecond = timeArray[2];
		if(shour.length == 0 || sminute.length == 0 || ssecond.length == 0)
			return false;
		var ihour=parseInt(shour,10);
		var iminute=parseInt(sminute,10);
		var isecond=parseInt(ssecond,10);
		if(ihour > 23 || ihour < 0) return false;
		if(iminute > 59 || iminute < 0) return false;
		if(isecond > 59 || isecond < 0) return false;
	}
	return true;
}
//日期合法性判断
function validDate(syear,smonth,sday)
{
	var iyear=parseInt(syear,10);
	var imonth=parseInt(smonth,10);
	var iday=parseInt(sday,10);
	if(imonth > 12 || imonth < 1)
		return false;
  	if (imonth == 1 || imonth == 3 || 
		imonth == 5 || imonth == 7 || 
		imonth == 8 || imonth == 10 || imonth== 12) 
		if(iday > 31 || iday < 1)
			return false; 
	if (imonth == 4 || imonth == 6 || imonth == 9 || imonth == 11) 
		if(iday > 30 || iday < 1)
			return false; 
	if (imonth == 2) 
	{ 
		if (iday < 1) return false; 
		if (LeapYear(iyear)) 
		{
			if (iday > 29) return false; 
		}
		else if (iday > 28) return false;  
   	} 
	return true; 
}
//闰年判断
function LeapYear(iyear) 
{
	if(iyear % 100 == 0) 
	{
		if(iyear % 400 == 0)
			return true;
	}
	else if ((iyear % 4) == 0)
		return true;
	return false; 
}
//对Mask型进行检查
function checkMask(obj)
{
	var value = obj.value;
	var maskArray = value.split('.'); 
	if(maskArray.length != 4)
		return false;
	for(var i=0; i<4; i++)
	{
		var sd = maskArray[i];
		if(isNaN(sd) || sd.length == 0)
			return false;
		var id = parseInt(sd);
		if(id < 0 || id > 255)
			return false;
	}
	return true;
}
function formatMask(obj)
{
	var value = obj.value;
	var maskArray = value.split('.'); 
	if(maskArray.length > 4) return false;
	for(var i=0; i<maskArray.length; i++)
	{
		var sd = maskArray[i];
		if(i<maskArray.length-1)
		{
			if(sd.length == 0)	return false;
		}
		if(sd.length>1 && sd.indexOf('0')==0) return false;
		if(isNaN(sd))	return false;
		var id = parseInt(sd);
		if(id < 0 || id > 255)
			return false;
		//如果是当前最后一个且不是第四个
		//if((i+1 == maskArray.length) && (i < 3))
		//	if(id > 25)	obj.value = value + '.';
	}
	return true;
}
//对Mac型进行检查
function checkMac(obj)
{
	var value = obj.value;
	var macArray = value.split(':');
	if(macArray.length != 6)
		return false;
	for(var i=0; i<6; i++)
	{
		var sd = macArray[i];
		if(sd.length != 2)
			return false;
		if(checkMacSingleChar(sd.substr(0,1))==false || checkMacSingleChar(sd.substr(1,2))==false)
			return false;
	}
	return true;
}
function formatMac(obj)
{
	var value = obj.value;
	var macArray = value.split(':'); 
	if(macArray.length > 6) return false;
	for(var i=0; i<macArray.length; i++)
	{
		var sd = macArray[i];
		if(sd.length>2) return false;
		if(i<macArray.length-1)
		{
			if(sd.length != 2)	return false;
		}
		for(var j=0; j<sd.length; j++)
		{
			if(checkMacSingleChar(sd.substr(j,j+1))==false)
				return false;
		}
		//如果是当前最后一个且不是第四个
		//if((i+1 == macArray.length) && (i < 5))
		//	if(sd.length == 2)	obj.value = value + ':';
	}
	return true;
}
function checkMacSingleChar(singleChar)
{
	if(singleChar>="0" && singleChar<="9")
		return true;
	if(singleChar>="A" && singleChar<="F")
		return true;
	return false;
}
function checkSubStringSingleChar(singleChar)
{
	if(singleChar>="0" && singleChar<="9")
		return true;
	if(singleChar>="A" && singleChar<="W")
		return true;
	if(singleChar>="a" && singleChar<="z")
		return true;
	return false;
}
function checkNumber(obj){
	var value = obj.value;
	if (value.search(/^[0-9]*$/) != -1)
		return true;
	else
		return false;
}
function checkEmail(obj) {
	var value = obj.value;
	if (value.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1)
		return true;
	else
		return false;
}
function checkPhone(obj) {
	if(checkTel(obj) || checkMobile(obj))
		return true;
	else
		return false;
}
function checkTel(obj) {
	var value = obj.value;
	if (value.search(/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/) != -1)
		return true;
	else
		return false;
}
function checkMobile(obj) {
	var value = obj.value;
	if (value.search(/^((\(\d{2,3}\))|(\d{3}\-))?1[3-8]\d{9}$/) != -1)
		return true;
	else
		return false;
}
function checkUrl(obj) {
	var value = obj.value;
	if (value.search(/^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/) != -1)
		return true;
	else
		return false;
}
function checkZip(obj) {
	var value = obj.value;
	if (value.search(/^[1-9]\d{5}$/) != -1)
		return true;
	else
		return false;
}
function checkICNumber(obj, lastCheck){
	value = obj.value;
	if(!lastCheck){
		if(value.length == 0)
			return true;
		if (value.search(/^[1-9]\d{0,14}[0-9]{0,2}[0-9Xx]{0,1}$/) != -1)
			return true;
		else
			return false;
	}else{
		var result = checkIdentityCardNumber(value);
		if(result == 'ok')
			return true;
		else
			return false;
	}
	return true;
}

function checkIdentityCardNumber(idcard){
	var Errors=new Array("ok","身份证号码位数不对!","身份证号码出生日期超出范围或含有非法字符!","身份证号码校验错误!","身份证地区非法!"); 
	var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"xinjiang",71:"台湾",81:"香港",82:"澳门",91:"国外"} 
	var idcard,Y,JYM;
	var S,M;
	var idcard_array = new Array();
	idcard_array = idcard.split("");
	if(area[parseInt(idcard.substr(0,2))]==null)
		return Errors[4];
	switch(idcard.length){
		case 15:
			if ((parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){
				ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性 
			}
			else{
				ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性 
			}
			if(ereg.test(idcard))
				return Errors[0]; 
			else 
				return Errors[2]; 
			break;
		case 18:
			if( parseInt(idcard.substr(6,4)) % 4 == 0 || ( parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 )){ 
				ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式 
			} 
			else{ 
				ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式 
			} 
			if(ereg.test(idcard)){
				S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3 ; 
				Y = S % 11; 
				M = "F"; 
				JYM = "10X98765432"; 
				M = JYM.substr(Y,1); 
				if(M == idcard_array[17]) 
					return Errors[0]; 
				else 
					return Errors[3]; 
			}
			else
				return Errors[2]; 
			break; 
		default: 
			return Errors[1]; 
		break;
	}
}
























function compareDateValue(begin_date, end_date)
{
	if(begin_date.length>0 && end_date.length>0)
	{
		if(begin_date > end_date)
			return false;
	}
	return true;
}



function toKiloFormat(str)
{
	//转换为千分位
	//123456-->123,456
	str = str.toString() + "";
	var tailstr="";
	var dotlocation = str.indexOf(".");
	var len = str.length;
	if (dotlocation>0)
	{
		tailstr = str.substr(dotlocation,len - dotlocation);
		str = str.substr(0,dotlocation);
	}
	var s ="";
	
	var diff = str.length % 3;	
	if (diff==1)
	{
		str="##" + str;
	}
	else if(diff==2)
	{
		str="#" + str;
	}
	
	for (j=0;j<str.length;j++)
	{
		if (j%3==0)
		{
			if (j==0)
				s=str.substr(j,3);
			else
				s=s+"," +str.substr(j,3);
		}
	}
	var newstr="";
	for (j=0;j<s.length;j++)
	{
		var subs = s.substr(j,1);
		if (subs!="#")
			newstr=newstr+subs;
	}
	if (tailstr!="") 
	{
		if (tailstr.length>3)
			tailstr = tailstr.substr(0,3); 
		if (tailstr!=".0")
			newstr=newstr+tailstr;
	}
	return newstr;
}

function LTrim(str)
{
	var i;
	for(i=0;i<str.length;i++)
	{
		if(str.charAt(i)!=" "&&str.charAt(i)!=" ")break;
	}
	str=str.substring(i,str.length);
	return str;
}
function RTrim(str)
{
	var i;
	for(i=str.length-1;i>=0;i--)
	{
		if(str.charAt(i)!=" "&&str.charAt(i)!=" ")break;
	}
	str=str.substring(0,i+1);
	return str;
}
function Trim(str)
{
	return LTrim(RTrim(str));
}

function setDefaultValue(obj, type, defaultValue){
	if(type == 1){
		if(obj.value == defaultValue)
			obj.value = "";
	}
	else{
		if(obj.value == "")
			obj.value = defaultValue;
	}
}

function isEmpty(s) {
	return ((s == undefined || s == null || s == "") ? true : false);
}

function isNumber(value)
{
	if(isNaN(value))	return false;
	if(value == '') 	return false;
	ivalue = parseInt(value, 10);
	if(isNaN(ivalue))	return false;
	return true;
}

//删除cookie
function delCookie(name){	
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
function displayOrHide(obj){
	if(obj != ""){
		var displayObj = document.getElementById(obj);
		if(displayObj){
			if(displayObj.style.display==""){
				displayObj.style.display = "none";
			}else{
				displayObj.style.display = "";
			}
		}
	}
}
//数据维护界面中，通过标题栏控制内容区显示与隐藏
function titleBarShowOrHide(objID){
	displayOrHide(objID);
	var showOrHideObj = document.getElementById(objID);
	var obj = document.getElementById(objID + "_btn");
	if(obj){
		if(showOrHideObj.style.display==""){
			obj.className = "title-bar2-btn-col";
		}else{
			obj.className = "title-bar2-btn-exp";
		}
	}
}


//自动完成
function AutoSearchComplete(auto, search, carlist) {
	var highlightindex = -1;   //高亮 
	var autoNode = $("#" + auto);   //缓存对象（弹出框）
	if (carlist.length == 0) {
		autoNode.hide();
		return;
	}
	autoNode.empty();  //清空上次的记录
	for (i in carlist) {
		var wordNode = carlist[i];   //弹出框里的每一条内容 
		var newDivNode = $("<div>").attr("id", i);    //设置每个节点的id值
		newDivNode.attr("style", "font:12px/20px arial;height:20px;padding:0 4px;cursor: pointer;"); 
		newDivNode.html(wordNode).appendTo(autoNode);  //追加到弹出框 
		//鼠标移入高亮，移开不高亮
		newDivNode.mouseover(function () {
			if (highlightindex != -1) {        //原来高亮的节点要取消高亮（是-1就不需要了）
				autoNode.children("div").eq(highlightindex).css("background-color", "white");
			}
			//记录新的高亮节点索引
			highlightindex = $(this).attr("id");
			$(this).css("background-color", "#ebebeb");
		});
		newDivNode.mouseout(function () {
			$(this).css("background-color", "white");
		}); 
		//鼠标点击文字上屏
		newDivNode.click(function () {
			//取出高亮节点的文本内容
			var comText = autoNode.hide().children("div").eq(highlightindex).text();
			highlightindex = -1;
			//文本框中的内容变成高亮节点的内容
			$("#" + search).val(comText);
		})
		if (carlist.length > 0) {    //如果返回值有内容就显示出来
			autoNode.show();
		} else {               //服务器端无内容返回 那么隐藏弹出框
			autoNode.hide();
			//弹出框隐藏的同时，高亮节点索引值也变成-1
			highlightindex = -1;
		}
	}
	//点击页面隐藏自动补全提示框
	document.onclick = function (e) {
		var e = e ? e : window.event;
		var tar = e.srcElement || e.target;
		if (tar.id != search) {
			if ($("#" + auto).is(":visible")) {
				$("#" + auto).css("display", "none");
			}
		}
	}
}