$(function () {
    let dataList = new Vue({
        el: '#v',
        data: {
            oldPwd: '',
            newPwd:'',
        },
        mounted() {
            this.$nextTick(function () {
                let that = this;
            });
        },
        methods: {
            // 保存
            doSave: function () {
                let that = this;
                if(!that.oldPwd){
                    alert('原密码空着呢');
                    return false;
                }
                if(!that.newPwd){
                    alert('新密码空着呢');
                    return false;
                }
                $("#saveBtn").text("保存中...");
                app.request(URL_DR.USER_MOD_PWD,
                    {oldPwd: $.md5(that.oldPwd), newPwd: $.md5(that.newPwd)},
                    function (json) {
                        // 请求成功
                        $("#saveBtn").text("保存");
                        alert(json.msg);
                    }, function (json) {
                        $("#saveBtn").text("保存");
                        // 请求失败
                        alert(json.msg);
                    }, shouldShowLoading = false, method = 'POST');
            }

        }
    });
});