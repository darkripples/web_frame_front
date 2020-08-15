$(function () {
    let dataList = new Vue({
        el: '#v',
        data: {
            account: '',
            pwd: '',
            userName:'',
            phone:'',
            email:'',
            vcodesid: '',
            verifyCodeImg: '',
            isShowPic: false,
            authCode: '',
            regVCode:'',
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
                $("#vcodeBtn").text("获取注册码...");
                // 需选择是手机号或者邮箱验证
                let url = URL_DR.REG_SEND_EMAIL;
                if(that.phone){
                    url = URL_DR.REG_SEND_SMS;
                }
                app.request(url + that.vcodesid + "/" + that.authCode,
                    {phone:that.phone, email:that.email, userAcc:that.account},
                    function (json) {
                        $("#vcodeBtn").text("获取注册码");
                        // 请求成功
                        alert(json.msg);
                    }, function (json) {
                        $("#vcodeBtn").text("获取注册码");
                        // 请求失败
                        alert(json.msg);
                    }, shouldShowLoading = false, method = 'POST');
            },
            // 注册
            doReg: function () {
                let that = this;
                if(!that.regVCode){
                    alert('注册码空着呢');
                    return false;
                }
                if(!that.account){
                    alert('用户名空着呢');
                    return false;
                }
                if(!that.pwd){
                    alert('密码空着呢');
                    return false;
                }
                if(!that.userName){
                    alert('昵称空着呢');
                    return false;
                }
                if(!that.phone && !that.email){
                    alert('手机号跟邮箱选一个');
                    return false;
                }
                $("#regBtn").text("注册中...");
                app.request(URL_DR.DO_REG,
                    {authCode: that.regVCode, userAcc: that.account, pwd: $.md5(that.pwd), userName:that.userName,
                    phone:that.phone, email:that.email},
                    function (json) {
                        // 请求成功
                        $("#regBtn").text("注册");
                        alert(json.msg);
                    }, function (json) {
                        $("#regBtn").text("注册");
                        // 请求失败
                        alert(json.msg);
                    }, shouldShowLoading = false, method = 'POST');
            }

        }
    });
});