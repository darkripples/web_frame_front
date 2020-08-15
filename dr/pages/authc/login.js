$(function () {
    let dataList = new Vue({
        el: '#v',
        data: {
            account: '',
            pwd: '',
            pwdMd5:'',
            pwdBak:'',
            vcodesid: '',
            verifyCodeImg: '',
            isShowPic: false,
            authCode: '',
            loginType: 'piccode',
        },
        mounted() {
            this.$nextTick(function () {
                let that = this;
                if(app.getToken()){
                    alert("已登录");
                    window.location.href = "/";
                    return false;
                }
                that.vcodeSid();
            });
        },
        methods: {
            // 获取sid
            vcodeSid: function () {
                let that = this;
                app.request(URL_DR.VCODE_SID, {}, function (json) {
                    that.vcodesid = json.data;
                }, null, shouldShowLoading = false, method = 'POST');
            },
            // 显示验证码图片
            showPic: function () {
                let that = this;
                if (!that.isShowPic) {
                    app.request(URL_DR.VCODE_PIC + that.vcodesid, {}, function (json) {
                        that.verifyCodeImg = "data:image/png;base64," + json.data;
                        that.isShowPic = true;
                    }, null, shouldShowLoading = false, method = 'POST');
                    $("#verifyCodeImg").show();
                }
            },
            // 更换验证码
            changeCode: function () {
                let that = this;
                app.request(URL_DR.VCODE_SID, {}, function (json) {
                    that.vcodesid = json.data;
                    app.request(URL_DR.VCODE_PIC + that.vcodesid, {}, function (json) {
                        that.verifyCodeImg = "data:image/png;base64," + json.data;
                        that.isShowPic = true;
                    }, null, shouldShowLoading = false, method = 'POST');
                }, null, shouldShowLoading = false, method = 'POST');
            },
            // 恢复显示input框的pwd
            recoverPwd:function(){
              let that = this;
              that.pwd = that.pwdBak;
            },
            // 登录
            doLogin: function () {
                let that = this;
                if(!that.authCode || !that.account || !that.pwd){
                    alert("请输入完整");
                    return false;
                }
                $("#loginBtn").text("登录中...");
                // 隐藏input框的pwd
                that.pwdBak = that.pwd;
                that.pwd = 'hello!darkripples';
                app.request(URL_DR.DO_LOGIN + that.loginType + "/" + that.vcodesid,
                    {authCode: that.authCode, userAcc: that.account, pwd: $.md5(that.pwdBak)},
                    function (json) {
                        $("#loginBtn").text("登录");
                        that.recoverPwd();
                        app.setToken(json.data.token);
                        // 请求成功
                        alert(json.msg);
                        if(!getStorage("referer")){
                            window.location.href = "/";
                        }else{
                            window.location.href = getStorage("referer");
                        }
                    }, function (json) {
                        $("#loginBtn").text("登录");
                        that.recoverPwd();
                        // 请求失败
                        alert(json.msg);
                    }, shouldShowLoading = false, method = 'POST');
            }

        }
    });
});