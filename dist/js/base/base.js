define(function(require, exports, module) {
	var baseURL = "http://121.41.0.124:81/";
	var H = {
		loginURL : "http://m.holichat.com/ceshi/login.html", //登录URL
        imgURL : "http://holichat-res-inside.img-cn-hangzhou.aliyuncs.com/uploads/", 
        eventList : baseURL + 'event/view/event_list',     // 赛事列表
        eventSearchURL: baseURL + 'event/view/event_search',  // 赛事搜索
        getBriefURL : baseURL + 'event/view/get_brief',       // 赛事简介信息
        getInfoURL : baseURL + 'event/view/get_info',         // 赛事详细信息
        getEnrollInfoURL : baseURL + 'event/view/get_enroll_info', // 赛事报名表信息
        eventEnrollURL : baseURL + 'event/interface/event_enroll', // 赛事报名
        eventOrderInfoURL : baseURL + 'event/interface/event_order_info',  //获取赛事订单详细
        userEventURL : baseURL + 'event/user/user_event',   //我的报名赛事
        eventProGroupInfoURL : baseURL + 'event/view/event_pro_group_info',   //赛事项目和组别
        getGeocodingURL : baseURL + 'other/api/get_geocoding',   //逆地理编码
        wxSignURL : baseURL +'other/api/wx_js_sign',
        checkSessionUrl : baseURL +'login/api/check_session', //会话检查
        eventEnrollSelectURL : baseURL + "event/interface/event_enroll_select",
        weixinUnifiedorderURL : baseURL + 'pay/api/weixin_unifiedorder',
        eventSignCheckURL : baseURL + 'event/interface/event_sign_check', //赛事入场验证检测
        eventTeamInfoURL : baseURL + 'event/team/event_team_info',
        wxSubscribeURL : baseURL + 'other/api/wx_subscribe', //微信订阅检查
        newsPfInfoURL : baseURL + 'news/pf/info', //活力圈资讯内容

		setItem:function(a,b){
			if(window.localStorage){
				window.localStorage.setItem("hlq_"+a,b);
			}else{
				var c=new Date;
				c.setTime(c.getTime()+31536e6),
				document.cookie="hlq_"+a+"="+escape(b)+";expires="+c.toGMTString()
			}
		},
		getItem:function(a){
			if(window.localStorage){
				return window.localStorage.getItem("hlq_"+a);
			}else{
				var b=document.cookie.match(new RegExp("(^| )hlq_"+a+"=([^;]*)(;|$)"));
				return null!=b?unescape(b[2]):null
			}
		},
		removeItem: function(a) {
			var b, c;
			window.localStorage ? window.localStorage.removeItem("hlq_" + a) : (b = new Date, b.setTime(b.getTime() - 1), c = H.getItem(a), null != c && (document.cookie = "hlq_" + a + "=" + c + ";expires=" + b.toGMTString()))
		},
		getURLVarByURL: function(a, b) {
			var d, e, c = b.split("?")[1];
			return c ? (d = new RegExp("(^|&)" + a + "=([^&]*)(&|$)", "i"), e = c.match(d), null != e ? unescape(e[2]) : null) : null
		},
		getURLVar: function(a) {
			var b = new RegExp("(^|&)" + a + "=([^&]*)(&|$)", "i"),
				c = window.location.search.substr(1).match(b);
			return null != c ? unescape(c[2]) : null
		},
		getCurrentStatus : function(signline,deadline,begin_date,end_date){
			var signlineDate = signline.substring(0,10).split('-'); //报名开始时间 
			var deadlineDate = deadline.substring(0,10).split('-'); //报名截止
			var beginDate = begin_date.substring(0,10).split('-'); //赛事开始时间 
			var endDate = end_date.substring(0,10).split('-'); //赛事结束
			signlineDate = signlineDate[1] + '/' + signlineDate[2] + '/' + signlineDate[0] + ' ' + signline.substring(10, 19);
			deadlineDate = deadlineDate[1] + '/' + deadlineDate[2] + '/' + deadlineDate[0] + ' ' + deadline.substring(10, 19);
			beginDate = beginDate[1] + '/' + beginDate[2] + '/' + beginDate[0] + ' ' + begin_date.substring(10, 19);
			endDate = endDate[1] + '/' + endDate[2] + '/' + endDate[0] + ' ' + end_date.substring(10, 19); 
			var today = new Date().getTime();
			if(today < Date.parse(signlineDate)){
				return '<span class="red">预热中</span>';
			}else if(today < Date.parse(deadlineDate)){
				return '<span class="green">报名中</span>';
			}else if(today < Date.parse(beginDate)){
				return '<span class="green">即将开始</span>';
			}else if(today < Date.parse(endDate)){
				return '<span class="warning">进行中</span>';
			}else{
				return '<span class="gary">已结束</span>';
			}		
		},
		getGroup : function(project,group){
			var result;
			$.ajax({
				url: this.eventProGroupInfoURL,
				async: false,//改为同步方式
				type: "GET",
				data: {event_project_id : project,event_group_id : group},
				success: function (data) {
					result = data;
				}
			});
			return result;
		},
		getAddress : function(region){	
			var address = [];
			$.each(province_data, function(index,item){
				if((region.substring(0,2) + '0000') == index){
					address.push(item.name)
				}
			});
			$.each(city_data, function(index,item){
				if( (region.substring(0,4) + '00') == index){
					address.push(item.name)
				}
			});		
			$.each(region_data, function(index,item){
				if( region == index){
					address.push(item.name)
				}
			});
			return address.join('');
		},
		search : function(){
			var content =$.trim( $('#keyword').val());
	        if(content ==''){
	         	H.tips("内容不能为空");
	         	return false;
	        };
	        window.location.href = 'search.html?content='+ encodeURI(encodeURI(content));
		},
		tips : function(msg,type){
			var html  ='<div class="tips">';
				html +='<div class="tips-message"> ' +  (type ? '<i class="loading-bright"></i>' + msg : msg)  + ' </div>';
				html +='</div>';
				$('body').append(html);
				setTimeout('$(".tips").remove();',1500);
		},
		goTop : function(){
			$(window).scroll(function(){
			    if($(window).scrollTop() > $(window).height()/2){
			        $("#back_top").addClass('active');
			    }else{
			        $("#back_top").removeClass("active");
			    }
			});
			$(function(){
				$('#back_top').on("tap",function(){
			        window.scrollTo(0,0);
			        return false;
			    })	
			})
			
		},
		isPhone : function(s){
			return /^1[3|4|5|7|8]\d{9}$/.test(s);
		},
		textEnter : function(txt){		
			return txt.replace("\r\n","<br>");
		},
		isWeixin: function() {
			return "micromessenger" == navigator.userAgent.toLowerCase().match(/MicroMessenger/i)
		},
		WXversion : function(){
			var version = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
			return version[1] < "5.0" ;
		},
		toUnicode : function(str){
			return escape(str).replace(/%/g,"\\").toLowerCase();
		},
		hideOptionMenuWx : function(){	
			var href = window.location.href;
			var url = href.split('#')[0];
			$.ajax({
				type: 'get',
				url: this.wxSignURL,
				data: {
					appid:'wxcc5c198d146a1779', 
					url:url
				},
				dataType: 'json',
				success: function(data){
					console.log(data);
					console.log('禁止微信');
					wx.config({
						debug     : false,
						appId     : "wxcc5c198d146a1779",
						timestamp : data.data.timestamp,
						nonceStr  : data.data.noncestr,
						signature : data.data.signature,
						jsApiList : ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo"] 
					});					
					wx.ready(function(){		
						wx.hideOptionMenu();
					});
				}
			});
		}
	};
	module.exports = H
})

//返回项部
$(window).scroll(function(){
	if($(window).scrollTop() > $(window).height()/2){
		$("#back_top").addClass('active');
	}else{
		$("#back_top").removeClass("active");
	}
});
$(function(){
	$('#back_top').on("tap",function(){
		window.scrollTo(0,0);
		return false;
	})  
})

//解决输入框input获取焦点时，虚拟键盘会把fixed元素顶上去
$('input[name = text]').on('focus',function(){
	$('.footer,.header').css('position','static');
}).on('blur',function(){
	$('.footer,.header').css({'position':'fixed','bottom':'0'})
})


//提示用户安装app区 的关闭按钮  
$('.prompt-close').on('click',function(){
    $(this).parents('.prompt-app').remove();
})



//检测系统是否安装app，如果安装就打开，没有安装就下载app
// function checkInstalled() {
//     if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
//         window.location.href = "holichat://";
//         setTimeout(function () {
//             window.location.href = "http://www.holichat.com/down";
//         }, 500);
//     } else {
//         window.location.href = "http://www.holichat.com/down.apk";
//     }
// }




























//计算字符串长度
String.prototype.strLen = function() {
    var len = 0;
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) len += 2; else len ++;
    }
    return len;
}

//将字符串拆成字符，并存到数组中
String.prototype.strToChars = function(){
    var chars = new Array();
    for (var i = 0; i < this.length; i++){
        chars[i] = [this.substr(i, 1), this.isCHS(i)];
    }
    String.prototype.charsArray = chars;
    return chars;
}

//判断某个字符是否是汉字
String.prototype.isCHS = function(i){
    if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0)
        return true;
    else
        return false;
}

//截取字符串（从start字节到end字节）
String.prototype.subCHString = function(start, end){
    var len = 0;
    var str = "";
    this.strToChars();
    for (var i = 0; i < this.length; i++) {
        if(this.charsArray[i][1])
            len += 2;
        else
            len++;
        if (end < len)
            return str;
        else if (start < len)
            str += this.charsArray[i][0];
    }
    return str;
}

//截取字符串（从start字节截取length个字节）
String.prototype.subCHStr = function(start, length){
    return this.subCHString(start, start + length);
}

