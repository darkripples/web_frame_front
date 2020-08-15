$(function(){
	let menuList = new Vue({
		el: '#menuList',
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
                that.initTree();
			});

            $("#add").on('click', function(){
                top.id = '';
                top.aliasName = '';
                top.icon = '';
                top.name = '';
                top.parentId = '';
                top.href = '';
                top.orderNo = '';
                top.url = '';
                top._layer.open({
                    title: '添加菜单',
                    type: 2,
                    //shadeClose: true, //点击遮罩关闭层
                    anim: 0,
                    resize: true,
                    area: ['600px', '600px'],
                    content: 'sys/menu/add.html',
                    end:function(){
                        that.initTable();
                        that.initTree();
                    }
                });
            });
		},
		methods: {
			initTable: function(){
                let that = this;
				let menuTable = app.initLayuiTable('menuTable', URL_MANAGE.GET_MENU_LIST, {name:that.name,orderField:'orderNo',orderType:'asc'});

                //监听工具条toolBar
                menuTable.on('tool(menuTable)', function(obj){ //注：tool是工具条事件名，menuTable是table原始容器的属性 lay-filter="对应的值"
                    var data = obj.data; //获得当前行数据
                    var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                    var tr = obj.tr; //获得当前行 tr 的DOM对象
                    if(layEvent === 'del'){ //删除
                        app.confirm('确定要删除该菜单？', function(index){
                            layer.close(index);
                            // 向服务端发送删除指令
                            app.request(URL_MANAGE.DO_MENU_DEL, {id: data.id}, function(json){
                                obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                                that.initTree();
                            });
                        });
                    } else if(layEvent === 'edit'){ //编辑
                        top.id = data.id;
                        top.aliasName = data.aliasName;
                        top.icon = data.icon;
                        top.name = data.showName;
                        if(data.parentId != undefined) {
                            top.parentId = data.parentId;
                        }
                        top.url = data.url;
                        top.href = data.href;
                        top.orderNo = data.orderNo;
                        top._layer.open({
                            title: '修改',
                            type: 2,
                            anim: 0,
                            resize: true,
                            area: ['600px', '600px'],
                            content: 'sys/menu/add.html',
                            end:function(){
                                top.id = '';
                                top.aliasName = '';
                                top.icon = '';
                                top.name = '';
                                top.url = '';
                                top.href = '';
                                top.orderNo = '';
                                that.initTable();
                                that.initTree();
                            }
                        });
                    }
                });
                that.renderTable(menuTable);
			},
            renderTable:function(table){
                table.render({
                    cols: [[
                        {field: 'id', title: 'id', width:0,hide:true},
                        {field: 'parentId', title: 'parentId', width:0,hide: true},
                        {field: 'showName', title: '名称', width:120},
                        {field: 'aliasName', title: '别名', width:150},
                        {field: 'icon', title: '图标', width:140},
                        {field: 'parentName', title: '上级菜单', width:120},
                        {field: 'href', title: 'HREF', width:260 },
                        {field: 'url', title: 'URL', width:260 },
                        {field: 'orderNo', title: '排序', width:60, sort: true},
                        {field: 'cz', title: '操作', width:90,
                            toolbar: '#barCz'
                        }
                    ]]
                });
            },
			initTree:function () {
			    let that = this;
                that.setting = {
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onClick:function (event, treeId, treeNode) {
                            var menuTable = app.initLayuiTable('menuTable', URL_MANAGE.GET_MENU_LIST,
                            {pId:treeNode.id,orderField:'orderNo',orderType:'asc'});
                            that.renderTable(menuTable);
                        }
                    }
                };
                app.request(URL_MANAGE.GET_MENU_DISPLAY, {}, function(json){
                    that.zTreeObj = $.fn.zTree.init($("#treeDemo"), that.setting, json.data);
                },function(json){}, shouldShowLoading = false, method='GET');
            }
		}
	});
});
