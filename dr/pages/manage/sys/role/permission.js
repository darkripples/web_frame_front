$(function(){
	let dataList = new Vue({
		el: '#permissionData',
		data: {
            roleName:'',
            roleCode:''
		},
		mounted() {
            var setting = {
                showLine: true,
                check:{
                    chkStyle: "checkbox",
                    enable:true
                }
            };
            this.$nextTick(function () {
                let that = this;
                that.roleId = top.roleId;
                that.roleCode = top.roleCode;
                that.roleName = top.roleName;
                top.roleId = '';
                top.roleCode = '';
                top.roleName = '';
                var html = "<span>角色名称："+that.roleName+"("+that.roleCode+")</span>";
                $("#info").prepend(html);
                if(that.roleId!='' && that.roleId != undefined){
                    app.request(URL_MANAGE.GET_ROLE_MENU+that.roleId, {}, function(json){
                        that.zTreeObj = $.fn.zTree.init($("#permission"), setting, json.data);
                        that.zTreeObj.expandAll(true);
                    }, function (json) {
                        app.fail(null, json.msg);
                    }, shouldShowLoading=false, method='GET');
                }

			});
		},
		methods: {
		    selectAll: function(){
		      let that = this;
		      that.zTreeObj.checkAllNodes(true);
            },
            clear: function(){
                let that = this;
                that.zTreeObj.checkAllNodes(false);
            },
            // 保存
            saveData: function () {
                let that = this;
                var nodes = that.zTreeObj.getCheckedNodes(); //获取选中节点
                var ids = '';
                for (var i=0;i<nodes.length; i++) {
                    ids += ","+nodes[i].id;
                }
                ids = ids.substr(1,ids.length);
                app.request(URL_MANAGE.SAVE_ROLE_MENU_RIGHTS+that.roleId, {ids:ids}, function(json){
                    app.success(function(){
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);//关闭当前页
                    });
                }, function (json) {
                    app.fail(null, json.msg);
                });
            }
		}
	});
});