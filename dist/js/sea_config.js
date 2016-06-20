seajs.config({
	//seajs.cache
	//base: "../dist/js/",

	//设置别名，方便调用
	alias:{
		"zepto": "zepto/zepto.min.js",
		"base" : "base/base.js",
		"tab" : "tab/scroll.js", //tab_nav

		"login" : "login/login.js", //判断用户是否登录	

		"jweixin" :"http://res.wx.qq.com/open/js/jweixin-1.0.0.js",
		"address" : "address/address.js",  //地址相关
		"dropload" : "dropload/dropload.js", //下拉加载
		"idcard" : "idcard.js",
		"base64" : "Base64.js",
	},

	// 预加载项
	preload: ['zepto', 'base','jweixin'],

	// 调试模式
	debug: true,

	// 文件编码
	charset: 'utf-8'
});

