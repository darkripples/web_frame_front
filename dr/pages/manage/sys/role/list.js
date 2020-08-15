$(function(){

	let roleList = new Vue({
		el: '#roleList',
		data: {
			name:''
		},
		mounted() {
			let that = this;
			this.$nextTick(function () {
				// 初始化列表
				this.initTable();
			});
            $("#add").on('click', function(){
                top.roleId = '';
                top._layer.open({
                    title: '添加角色',
                    type: 2,
                    //shadeClose: true, //点击遮罩关闭层
                    anim: 0,
                    resize: true,
                    area: ['600px', '500px'],
                    content: 'sys/role/add.html',
                    end:function(){
                        that.initTable();
                    }
                });
            });
		},
		methods: {
			initTable: function(){
			    let that = this;
				let roleTable = app.initLayuiTable('roleTable', URL_MANAGE.GET_ROLE_LIST);
                //监听工具条toolBar
                roleTable.on('tool(roleToolBar)', function(obj){ //注：tool是工具条事件名，dataTable是table原始容器的属性 lay-filter="对应的值"
                    var data = obj.data; //获得当前行数据
                    var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                    var tr = obj.tr; //获得当前行 tr 的DOM对象
                    if(layEvent === 'del'){ //删除
                        app.confirm('确定要删除该角色？', function(index){
                            layer.close(index);
                            // 向服务端发送删除指令
                            app.request(URL_MANAGE.DO_ROLE_DEL, {id: data.id}, function(json){
                                obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                                that.initTable();
                            });
                        });
                    } else if(layEvent === 'edit'){ //编辑
                        top.roleId = data.id;
                        top.level = data.level;
                        top._layer.open({
                            title: '修改',
                            type: 2,
                            //shadeClose: true, //点击遮罩关闭层
                            anim: 0,
                            resize: true,
                            area: ['600px', '500px'],
                            content: 'sys/role/add.html',
                            end:function(){
                                top.roleId = '';
                                top.level = '';
                                that.initTable();
                            }
                        });
                    }else if(layEvent == 'clearPermission'){
//                        app.confirm('确定要清空该角色权限？', function(index){
//                            layer.close(index);
//                            // 向服务端发送删除指令
//                            app.request(URL_ADMIN.ROLE_MENU_SAVE, {roleId:data.id}, function(json){
//                                app.alert(json.msg,null);
//                                that.initTable();
//                            });
//                        });
                    }else  if(layEvent == 'assignPermission'){
                        top.roleId = data.id;
                        top.roleName = data.roleName;
                        top.roleCode = data.id;
                        top._layer.open({
                            title: '权限分配',
                            type: 2,
                            //shadeClose: true, //点击遮罩关闭层
                            anim: 0,
                            resize: true,
                            area: ['600px', '500px'],
                            content: 'sys/role/permission.html',
                            end: function () {
                                top.roleId = '';
                                top.roleName = '';
                                top.roleCode = '';
                                that.initTable();
                            }
                        });
                    }
                });
				this.roleRender(roleTable);
			},
            reset:function(){
			    roleList.name = '';
            },
            search : function () {
                let roleTable = app.initLayuiTable('roleTable', URL_MANAGE.GET_ROLE_LIST, {name:roleList.name});
                this.roleRender(roleTable);
            },
			roleRender: function (roleTable) {
                roleTable.render({
                    cols: [[
                        {field:'level',title:"等级",width:"0px",hide:true},
                        {field: 'id',width:'10%' , title: 'ID'},
                        {field: 'roleName', width:'10%' ,title: '名称'},
                        {field: 'note', width:'10%' ,title: '备注'},
                        {field: 'orderNo',width:'10%' , title: '排序',sort: true},
                        {field: 'addTime',width:'20%' , title: '添加日期',sort:true},
                        {field: 'cz',width:'20%' , title: '操作', toolbar: '#roleToolBar'}
                    ]],
                    done:function (res,page,count) {
                        $("[data-field='level']").children().each(
                            function () {
                                if($(this).text() == '1'){
                                    $(this).parents("tr").children().find('#del').css("display","none")
                                }
                            }
                        )
                    }
                });
            }
		}
	});


});