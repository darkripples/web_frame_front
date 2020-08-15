$(function(){
	let userList = new Vue({
		el: '#userList',
		data: {
            account:'',
			name:'',
            roleSelect:''
		},
		mounted() {
			let that = this;
			this.$nextTick(function () {
				// 初始化列表
                that.initTable();

				// 初始化下拉框
                // 角色列表
                app.request(URL_MANAGE.GET_ROLE_LIST, {}, function(json){
                    var strHtml = "<option value=''>角色</option>";
                    var response = json.data.list;
                    $.each(response, function (i) {
                        strHtml += "<option value='"+response[i].id+"'>"+response[i].roleName+"</option>"
                    });
                    $("#roleSelect").html(strHtml);
                    layui.use("form",function () {
                        that.form = layui.form;
                        that.form.render();
                        that.form.on('select(roleSelect)', function(data){
                            that.roleSelect = data.value;
                            that.initTable();
                        });
                        $('#roleSelect').change(function(){
                            var p1=$(this).children('option:selected').val();//这就是selected的值
                            that.roleSelect = p1;
                            that.initTable();
                        });
                    });
                },function(json){
                }, shouldShowLoading = false, method='GET');
			});

            $("#add").on('click', function(){
                top.userId = '';
                top.roleIds = '';
                top._layer.open({
                    title: '添加用户',
                    type: 2,
                    //shadeClose: true, //点击遮罩关闭层
                    anim: 0,
                    resize: true,
                    area: ['600px', '600px'],
                    content: 'pages/sys/user/add.html',
                    end:function(){
                        top.roleIds ='';
                        top.userId = '';
                        that.initTable();
                    }
                });
            });
		},
		methods: {
            // 重置查询条件
            resetSearch: function(){
                let that = this;
                that.name = '';
                that.account = '';
                that.roleSelect = '';
                $("#roleSelect").val("");
                that.form.render();
            },
			initTable: function(){
                let that = this;
				let userTable = app.initLayuiTable('userTable', URL_MANAGE.GET_USER_LIST,
				    {name:that.name, account:that.account, roleId:that.roleSelect} );
                top.roleIds ='';
                top.userId = '';

                // 行单击事件
                userTable.on('row(userTable)', function(obj){
                    //标注选中样式
                    obj.tr.removeClass('layui-table-click');
                });

                //监听工具条toolBar
                userTable.on('tool(userTable)', function(obj){ //注：tool是工具条事件名，userTable是table原始容器的属性 lay-filter="对应的值"
                    var data = obj.data; //获得当前行数据
                    var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                    var tr = obj.tr; //获得当前行 tr 的DOM对象
                    if(layEvent === 'del'){ //删除
//                        app.confirm('确定要删除该用户？', function(index){
//                            layer.close(index);
//                            // 向服务端发送删除指令
//                            app.request(URL_ADMIN.USER_DEL, {ids: data.id}, function(json){
//                                if(json.status==0){
//                                    obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
//                                }else{
//                                    app.fail(null, json.message);
//                                }
//                            });
//                        });
                    } else if(layEvent === 'edit'){ //编辑
//                        top.userId = data.id;
//                        top.roleIds = "";
//                        top.roleCodes = "";
//                        // 防止indexOf判断出错，多加一个^符号
//                        for(var i=0;i<data.roleIds.split(",").length;i++){
//                            top.roleIds += "^"+data.roleIds.split(",")[i]+"^,";
//                        }
//                        for(var i=0;i<data.roleCodes.split(",").length;i++){
//                            top.roleCodes += "^"+data.roleCodes.split(",")[i]+"^,";
//                        }
//                        top._layer.open({
//                            title: '修改',
//                            type: 2,
//                            anim: 0,
//                            resize: true,
//                            area: ['600px', '600px'],
//                            content: 'pages/sys/user/add.html',
//                            end:function(){
//                                top.roleIds ='';
//                                top.userId = '';
//                                that.initTable();
//                            }
//                        });
                    }else if(layEvent === 'detail'){
//                        top.userId = data.id;
//                        top.roleIds = "";
//                        top.roleCodes = "";
//                        // 防止indexOf判断出错，多加一个^符号
//                        for(var i=0;i<data.roleIds.split(",").length;i++){
//                            top.roleIds += "^"+data.roleIds.split(",")[i]+"^,";
//                        }
//                        for(var i=0;i<data.roleCodes.split(",").length;i++){
//                            top.roleCodes += "^"+data.roleCodes.split(",")[i]+"^,";
//                        }
//                        top._layer.open({
//                            title: '用户信息',
//                            type: 2,
//                            shadeClose: true, //点击遮罩关闭层
//                            anim: 0,
//                            resize: true,
//                            area: ['600px', '600px'],
//                            content: 'pages/sys/user/view.html',
//                            end:function(){
//                                top.roleIds ='';
//                                top.userId = '';
//                            }
//                        });
                    }else if(layEvent === 'freeze'){
//                        app.confirm('确定要冻结该用户？', function(index){
//                            layer.close(index);
//                            // 向服务端发送指令
//                            app.request(URL_ADMIN.USER_FREEZE, {userId: data.id}, function(json){
//                                if(json.status==0){
//                                    app.alert("已冻结该用户!");
//                                    that.initTable();
//                                }else{
//                                    app.fail(null, json.message);
//                                }
//                            });
//                        });
                    }else if(layEvent === 'unfreeze'){
//                        app.confirm('确定要解冻该用户？', function(index){
//                            layer.close(index);
//                            // 向服务端发送指令
//                            app.request(URL_ADMIN.USER_UNFREEZE, {userId: data.id}, function(json){
//                                if(json.status==0){
//                                    app.alert("已解冻该用户!");
//                                    that.initTable();
//                                }else{
//                                    app.fail(null, json.message);
//                                }
//                            });
//                        });
                    }else if(layEvent === 'resetpwd'){
                        app.alert("用户可自行找回密码...");
//                        app.confirm('确定要重置该用户密码为默认密码？', function(index){
//                            layer.close(index);
//                            // 向服务端发送指令
//                            app.request(URL_MANAGE.USER_RESETPWD, {userId: data.id}, function(json){
//                                app.alert("已置为默认密码!");
//                            });
//                        });
                    }
                });

				userTable.render({
					cols: [[
						{field: 'account', title: '账号', width:150, sort: true},
                        {field: 'userName', title: '姓名', width:200, sort: true},
                        {field: 'sexType', title: '性别', width:110, templet: function(d){
                        		if(d.status=='1'){
                                    return '男';
								}else if(d.status=='0'){
                                    return '女';
								}else{
                        			return '未设置';
								}
                            }},
                        {field: 'roleNames', title: '角色', width:210},
                        {field: 'phone', title: '手机号', width:180},
                        {field: 'addTime', title: '添加时间', width:180, sort: true},
                        {field: 'cz', title: '操作', width:250, minWidth:250,
                            toolbar: '#barCz'
                        }
					]]
				});
			}
		}
	});
});