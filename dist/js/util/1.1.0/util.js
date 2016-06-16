/*=============================================================================
#     FileName: util.js
#         Desc: 方法集
#       Author: zhouyunlong
#   LastUpdate: 2016-06-12
=============================================================================*/
define(function(require, exports, module) {
    require('zepto');    

    var baseURL = "http://121.41.0.124:81/";
    exports.apiUrl = {
        loginURL : "http://m.holichat.com/ceshi/login.html", //登录URL
        imgURL : "http://holichat-res-inside.img-cn-hangzhou.aliyuncs.com/uploads/", 

        eventListURL : baseURL + 'event/view/event_list',     // 赛事列表
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
    }

    /**
    * 设置localStorage || cookie
    * @param a:name  b:value
    */
    exports.setItem = function(a,b){
        if(window.localStorage){
            window.localStorage.setItem("hlq_"+a,b);
        }else{
            var c=new Date;
            c.setTime(c.getTime()+31536e6),
            document.cookie="hlq_"+a+"="+escape(b)+";expires="+c.toGMTString()
        }
    };


    /**
    * 获取localStorage || cookie
    * @param  a:name
    */
    exports.getItem = function(a){
        if(window.localStorage){
            return window.localStorage.getItem("hlq_"+a);
        }else{
            var b=document.cookie.match(new RegExp("(^| )hlq_"+a+"=([^;]*)(;|$)"));
            return null!=b?unescape(b[2]):null
        }
    };

    /**
    * 删除localStorage || cookie
    * @param  a:name
    */  
    exports.removeItem = function(a) {
        var b, c;
        window.localStorage ? window.localStorage.removeItem("hlq_" + a) : (b = new Date, b.setTime(b.getTime() - 1), c = H.getItem(a), null != c && (document.cookie = "hlq_" + a + "=" + c + ";expires=" + b.toGMTString()))
    };

    /**
    * 获取URL的值
    * @param  a:name
    */ 
    exports.getURLVar = function(a) {
        var b = new RegExp("(^|&)" + a + "=([^&]*)(&|$)", "i"),
            c = window.location.search.substr(1).match(b);
        return null != c ? unescape(c[2]) : null
    };


    /**
    * 获取赛事当前状态
    * @param  signline:报名开始时间   deadline:报名截止   begin_date:赛事开始时间   end_date: 赛事结束
    */ 
    exports.getCurrentStatus = function(signline,deadline,begin_date,end_date){
        var signlineDate = signline.substring(0,10).split('-');
        var deadlineDate = deadline.substring(0,10).split('-');
        var beginDate = begin_date.substring(0,10).split('-');
        var endDate = end_date.substring(0,10).split('-');
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
    };


    /**
    * 提示框
    * @param  msg:提示内容  type:是否加loading
    */
    exports.tips = function (msg,type){
        var html  ='<div class="tips">';
            html +='<div class="tips-message"> ' +  (type ? '<i class="loading-bright"></i>' + msg : msg)  + ' </div>';
            html +='</div>';
            $('body').append(html);
            setTimeout('$(".tips").remove();',1500);
    };


    /**
     * 字符限制
     * @param 输入框
     */
    exports.wordLimit = function(target) {
        var maxLen = target.attr('maxlength');
        var showLen = target.attr('maxlength');
        var thisForm = target.parents('form');
        var curLen = 0;

        var tmpl = '<p class="inputFontTip r"><span class="inputFont">可以输入<em id="J_InputNum">' + showLen + '</em>字</span></p>';


        thisForm.find('input.btn').last().after(tmpl);
        target.on('keyup change', function() {
            curLen = target.val().length;
            showLen = maxLen - curLen;
            thisForm.find('#J_InputNum').text(showLen);
        });
    };


    /**
     * 整数秒格式化
     * @param 秒数
     */
    exports.formatSecond = function(sec) {
        var result = _format(parseInt(sec / 60)) + ":" + _format(sec % 60);

        function _format(min) {
            return min < 10 ? '0' + min : min;
        }
        return result;
    };


    /*特殊字符转义处理*/
    String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {　
        if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
            return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
        } else {
            return this.replace(reallyDo, replaceWith);
        }
    };

    exports.toStringItem = function(str) {
        str = str.replaceAll("&", "&amp;");
        return str;
    };



    /*编码*/
    exports.toUnicode = function(str){
        return escape(str).replace(/%/g,"\\").toLowerCase();
    };

    /*编码*/
    exports.isWeixin = function(){
        return "micromessenger" == navigator.userAgent.toLowerCase().match(/MicroMessenger/i)
    };

    /*判断是否手机号码*/
    exports.isPhone = function(s){
        return /^1[3|4|5|7|8]\d{9}$/.test(s);
    };

    /*替换成换行*/
    exports.textEnter = function(t){
        return t.replace("\r\n","<br>");
    };

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
	
	
	
	
    /*

    //判断是否为安卓系统
    function checkPlatform() {
        if (/android/i.test(navigator.userAgent)) {
            $("#down_app").show();
            $(".downios").hide();
        } else if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            $("#down_app").show();
            $(".downandroid").hide();
        } else if (/Linux/i.test(navigator.userAgent)) {
            $("#down_app").show();
            $(".downios").hide();
        } else if (/Linux/i.test(navigator.platform)) {
            $("#down_app").show();
            $(".downios").hide();
        } else {
            $("#down_app").hide();
            $("#app_downli").hide();
            $(".copyrg").css("margin-bottom", "0").css("padding-bottom", '20px');
        }
    }

    //检测系统是否安装app，如果安装就打开，没有安装就下载app
    function checkInstalled() {
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            window.location.href = "OnlinePharnaciesByKAD://";
            setTimeout(function () {
                window.location.href = "http://um0.cn/5o5ti/";
            }, 500);
        } else {
            window.location.href = "http://res.360kad.com/app/k/kad-wp1.apk";
        }
    }
    */
 



});