$(function () {
    let dataList = new Vue({
        el: '#v',
        data: {
            pwd: '',
            phone:'',
            email:'',
            vcodesid: '',
            verifyCodeImg: '',
            isShowPic: false,
            authCode: '',
            regVCode:'',
            loginType:'',
        },
        mounted() {
            this.$nextTick(function () {
                let that = this;
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
                if (that.vcodesid && !that.isShowPic) {
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
            // 发送验证码
            sendCode:function(){
                let that = this;
                if(!that.phone && !that.email){
                    alert('手机号跟邮箱选一个');
                    return false;
                }
                if(!that.authCode){
                    alert("验证码空着呢");
                    return false;
                }
                $("#vcodeBtn").text("获取验证码...");
                // 需选择是手机号或者邮箱验证
                let url = URL_DR.USER_SET_PWD_SEND_EMAIL;
                that.loginType = 'emailcode';
                if(that.phone){
                    url = URL_DR.USER_SET_PWD_SEND_SMS;
                    that.loginType = 'smscode';
                }
                app.request(url + that.vcodesid + "/" + that.authCode,
                    {phone:that.phone, email:that.email},
                    function (json) {
                        $("#vcodeBtn").text("获取验证码");
                        // 请求成功
                        alert(json.msg);
                    }, function (json) {
                        $("#vcodeBtn").text("获取验证码");
                        // 请求失败
                        alert(json.msg);
                    }, shouldShowLoading = false, method = 'POST');
            },
            // 保存
            doSave: function () {
                let that = this;
                if(!that.loginType){
                    alert('手机号跟邮箱选一个');
                    return false;
                }
                if(!that.regVCode){
                    alert('验证码空着呢');
                    return false;
                }

                if(!that.pwd){
                    alert('密码空着呢');
                    return false;
                }
                if(!that.phone && !that.email){
                    alert('手机号跟邮箱选一个');
                    return false;
                }
                $("#regBtn").text("保存中...");
                app.request(URL_DR.USER_SET_PWD_SAVE + that.loginType + "/" + that.vcodesid,
                    {authCode: that.regVCode, newPwd: $.md5(that.pwd)},
                    function (json) {
                        // 请求成功
                        $("#regBtn").text("保存");
                        alert(json.msg);
                    }, function (json) {
                        $("#regBtn").text("保存");
                        // 请求失败
                        alert(json.msg);
                    }, shouldShowLoading = false, method = 'POST');
            }

        }
    });
});