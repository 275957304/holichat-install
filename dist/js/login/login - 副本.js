
define(function(require, exports, module){
    //require('./login.css');
    var tpl = {
        login : '<div id="login_phone">'+
                    '<div class="login_close login_active" title="关闭"></div>'+
                    '<div class="loginbox448 loginbox_mail"><span class="loginbox_title">邮箱登录</span>'+
                        '<table cellpadding="0" cellspacing="0" class="loginboxTable5">'+
                            '<tr>'+
                                '<th> </th>'+
                                '<th style="padding:0"><div class="msg"></div></th>'+
                                '<td> </td>'+
                            '</tr>'+
                            '<tr>'+
                                '<th>邮箱：</th>'+
                                '<td><input class="inpt_mail username" type="text" id="J_LoginUsername" value="" name="username" /></td>'+
                                '<td><span class="tipTxt"></span></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<th>密码：</th>'+
                                '<td><input class="inpt_pass password" type="password" id="J_LoginPwd" value="" name="password" /></td>'+
                                '<td><span class="tipTxt"></span></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<th></th>'+
                                '<td><span class="loginbox_longin btn btn-large"><a href="javascript:;">登录</a></span></td>'+
                                '<td></td>'+
                            '</tr>'+
                        '</table>'+
                        '<div class="txt_fgPas"><a href="/user/forget">忘记密码？</a></div>'+
                        '<div class="login_line"></div>'+
                        '<span class="loginbox_bySns"><a href="javascript:;">使用社交帐号登录</a></span></div>'+
                '</div>',

        mask : '<div id="mask" style="height:' + $(document).height() + 'px;"></div>'
    };
    function init(){
        $('body').append(tpl.login+tpl.mask);
    }
    function close(){
        $("#mask").remove();//遮罩层隐藏
        $("#login_phone").remove();//登录框隐藏  
    }
    $(document).delegate('.login_close','click',close);     
    
    $(document).delegate('.loginbox_bySns','click', 
    function(){
        /*close();
        require.async('login_sns', function(login){
            login.init();
        });*/
        $(this).closest('.loginbox_mail').animate({top:'-334px'});
    })
    
    /*========== Public verify Mail ==========*/
    function verifyInputMail(target_val,target_tip){
        var _ruleMail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            _tipA = '请输入邮箱',
            _tipB = '邮箱格式错误';
        if(target_val == ''){
            target_tip.html(_tipA);
            return false;
        };  
        if(!(_ruleMail.test($.trim(target_val)))){
            target_tip.html(_tipB);
            return false;
        };
        target_tip.empty();
        return true;
    }
    /*========== Public verify Mail End==========*/
    
    function clkVerify(){
        var _targetTip = $('.loginboxTable5').find('.tipTxt'),
            _verifyInputMail = verifyInputMail($('#J_LoginUsername').val(),_targetTip.eq(0));
        if($('#J_LoginPwd').val() == ''){
            $('.msg').removeClass('wrong').html('');
            _targetTip.eq(1).html('请输入密码');
            
            return;
        };
        if(_verifyInputMail){
            login_fn();
        }
    };
    
    //登录之后的AJAX封装函数
    function login_fn(){
        var _targetTip = $('.loginboxTable5').find('.tipTxt');
        $.ajax({
            type: "POST",
            url: "/user/login",
            dataType:"json",
            data: "username="+$.trim($('.username').val())+"&password="+$.trim($('.password').val()),
            success: function(data){

                if(data.status == 1){
                    var spclPage = window.location.pathname;
                    if(spclPage == "/user/forget" || spclPage == "/user/logout" || spclPage == "/user/userfrozen" || spclPage == "/user/sendresult" || spclPage == "/user/resetpasspage" || spclPage == "/user/resetpassword"  || spclPage == "/"){
                        window.location = "/space/index";
                    } else {
                        window.location.reload();
                    }
                }else if(data.status == 5){
                    window.location = "/user/userfrozen";
                }else if(data.status == 6){
                    window.location = "/";
                }else{
                    _targetTip.html('');
                    $('.msg').addClass('wrong').html(data.msg);
                    //_targetTip.eq(1).html('邮箱或密码不匹配');
                }
            },
            error: function(data){
                alert("请求失败")   
            }
        });     
    }
    
    //邮箱失去焦点验证
    $(document).delegate('#J_LoginUsername','blur',
    function(){ 
        var _this = $(this),
            _targetTip = _this.closest('table').find('.tipTxt');
        verifyInputMail(_this.val(),_targetTip.eq(0));
    });

    //登录按钮的点击
    $(document).delegate('.loginbox_longin','click',function(){
        clkVerify();
    })
    
    //点击回车键之后实现登录按钮功能
    $(document).keydown(function(event){
        if(event.keyCode==13){
            clkVerify();
        }
    });

    module.exports = {
        init : init
    };
});
