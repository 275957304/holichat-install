
define(function(require, exports, module){
    //require('./login.css'); 
    var H = require('util');
    var uid = H.getItem('uid'),
        session = H.getItem('session'),
        device = H.getItem("device"),
        wxappid = 'wxcc5c198d146a1779',
        setval ='',
        event_id = H.getURLVar("event_id"),
        source = H.getURLVar("source"); 

    $.get( H.apiUrl.checkSessionUrl,{target_uid: uid , save_session:session, device:device},function(response){
        console.log(response);
        //console.log(H.apiUrl.loginURL);
        if(response.ret != 0){           
            if(event_id){
                setval = H.apiUrl.loginURL + '?event_id=' + event_id;          
            }else if(source){
                setval = H.apiUrl.loginURL + '?source=user_event'; 
            }else{
                setval = H.apiUrl.loginURL;
            }
            if(H.isWeixin()){               
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + wxappid + "&redirect_uri=" + encodeURIComponent(setval) + "&response_type=code&scope=snsapi_userinfo#wechat_redirect";
            }else{              
                //window.location.href = 'http://m.holichat.com/enter_login.html';
                H.tips('请登录')
            };
            
        }
    },'json');
});
