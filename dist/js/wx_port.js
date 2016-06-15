var href = window.location.href;
var url = href.split('#')[0];
$.ajax({
	type: 'get',
	url: baseURL + "other/api/wx_js_sign",
	data: {
		appid:'wxcc5c198d146a1779', 
		url:url
	},
	dataType: 'json',
	success: function(data){
		console.log(data);
		
		var wechat_debug     = false;
		var wechat_appid     = "wxcc5c198d146a1779";
		var wechat_timestamp = data.data.timestamp;
		var wechat_noncestr  = data.data.noncestr;
		var wechat_signature = data.data.signature;
		var wechat_jsapilist = ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo",
							"startRecord", "stopRecord", "onVoiceRecordEnd", "playVoice", "pauseVoice", "stopVoice",
							"onVoicePlayEnd", "uploadVoice", "downloadVoice", "translateVoice",
							"chooseImage", "previewImage", "uploadImage", "downloadImage",
							"getNetworkType", "openLocation", "getLocation"];
		var wechat_message   = "ok";		
		
		//通过config接口注入权限验证配置
		wx.config({
			debug     : wechat_debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId     : wechat_appid, // 必填，公众号的唯一标识
			timestamp : wechat_timestamp, // 必填，生成签名的时间戳
			nonceStr  : wechat_noncestr, // 必填，生成签名的随机串
			signature : wechat_signature,// 必填，签名，见附录1
			jsApiList : wechat_jsapilist, // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
		
		wx.ready(function(){
			
			// 分享到朋友圈
			wx.onMenuShareTimeline({
				title: "我是趣运动的分享标题------", // 分享标题
				link: "http://inside.m.holichat.com/list/index.html", // 分享链接
				imgUrl: "", // 分享图标
				success: function () { 
					// 用户确认分享后执行的回调函数
					share();
				},
				cancel: function () { 
					// 用户取消分享后执行的回调函数
				}
			});
		
			wx.getLocation({
				type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				success: function (res) {
					var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
					var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
					console.log(latitude);
					console.log(longitude);
					H.setItem("latitude", latitude);
					H.setItem("longitude", longitude);					
				}
			});
		});
	},
	error: function(res) {
		H.tips("没有获取到微信接口");
	}
});