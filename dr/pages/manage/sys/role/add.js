$(function(){
	let dataList = new Vue({
		el: '#dataInfo',
		data: {
		    dataInfo:{
                code:'',
                name: '',
                note:'',
                orderNo:''
            },
            id:'',
		},
		mounted() {
			this.$nextTick(function () {
                let that = this;

                if(top.roleId!='' && top.roleId != undefined){
                    // 修改
                    that.getDataInfo();
                }
                // 初始化表单验证
                layui.use(['form'], function(){
                    that._form = layui.form;
                    if(top.level == "1"){
                       $("#roleCode").attr("readonly","readonly");
                    }else {
                        $("#roleCode").removeAttr('readonly');
                    }
                    top.level = "";
                });

                // 监听表单提交事件
                that._form.on('submit(saveRole)', function(){
                    that.saveData();
                    return false;
                });
                // that._form.render();
			});
		},
		methods: {
            // 获取信息
            getDataInfo: function(){
                let that = this;
                app.request(URL_MANAGE.GET_ROLE_LIST, {id:top.roleId, page:1, limit:1}, function(json){
                    roleInfo = json.data.list[0];
                    that.id = roleInfo.id;
                    that.dataInfo.code = roleInfo.id;
                    that.dataInfo.name = roleInfo.roleName;
                    that.dataInfo.note = roleInfo.note;
                    that.dataInfo.orderNo = roleInfo.orderNo;
                    $("#roleCode").attr("disabled","disabled");
                },function(json){
                }, shouldShowLoading = false, method='GET');

            },
            // 保存
            saveData: function () {
                let that = this;
                let dataInfo = that.dataInfo;
                if(that.id != '' && that.id != undefined){
                    dataInfo ={
                        id:that.id,
                        name: that.dataInfo.name,
                        note:that.dataInfo.note,
                        orderNo:that.dataInfo.orderNo,
                        modType: "upd",
                    };
                }else{
                    dataInfo.id = that.dataInfo.code;
                    dataInfo.modType = "add";
                }
                app.request(URL_MANAGE.DO_ROLE_SAVE, dataInfo, function(json){
                    top.roleId = '';
                    app.success(function(){
                        var index = parent.layer.getFrameIndex(window.name);
                        //关闭当前页
                        parent.layer.close(index);
                    });
                }, function (json) {
                    app.fail(null, json.msg);
                });
            }
		}
	});
});