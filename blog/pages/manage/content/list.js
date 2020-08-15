$(function(){

	let dataList = new Vue({
		el: '#dataList',
		data: {
			title:'',
			rlevel: -1,
		},
		mounted() {
			let that = this;
			this.$nextTick(function () {
				// 初始化列表
				this.initTable();
			});
            $("#add").on('click', function(){
                top.bId = '';
                top._layer.open({
                    title: '添加',
                    type: 2,
                    //shadeClose: true, //点击遮罩关闭层
                    anim: 0,
                    resize: true,
                    area: ['800px', '700px'],
                    content: '/blog/manage/content/add.html',
                    end:function(){
                        that.initTable();
                    }
                });
            });
		},
		methods: {
			initTable: function(){
			    let that = this;
				let roleTable = app.initLayuiTable('roleTable', URL_BLOG.INDEX_LIST, {rlevel:that.rlevel, needtoken:1});
                //监听工具条toolBar
                roleTable.on('tool(roleToolBar)', function(obj){ //注：tool是工具条事件名，dataTable是table原始容器的属性 lay-filter="对应的值"
                    var data = obj.data; //获得当前行数据
                    var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                    var tr = obj.tr; //获得当前行 tr 的DOM对象
                    if(layEvent === 'del'){ //删除
                        app.confirm('确定要删除？', function(index){
                            layer.close(index);
                            // 向服务端发送删除指令
                            app.request(URL_BLOG.BLOG_DEL + data.id, {}, function(json){
                                obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                                that.initTable();
                            });
                        });
                    } else if(layEvent === 'edit'){ //编辑
                        top.bId = data.id;
                        top.bType = data.blogType;
                        top._layer.open({
                            title: '修改',
                            type: 2,
                            //shadeClose: true, //点击遮罩关闭层
                            anim: 0,
                            resize: true,
                            area: ['800px', '700px'],
                            content: '/blog/manage/content/add.html',
                            end:function(){
                                top.roleId = '';
                                top.level = '';
                                that.initTable();
                            }
                        });
                    }
                });
				this.roleRender(roleTable);
			},
            reset:function(){
			    dataList.title = '';
            },
            search : function () {
                let roleTable = app.initLayuiTable('roleTable', URL_BLOG.INDEX_LIST, {title:dataList.title, rlevel:dataList.rlevel, needtoken:1});
                this.roleRender(roleTable);
            },
			roleRender: function (roleTable) {
                roleTable.render({
                    cols: [[
                        {field: 'title', width:'15%', title:'标题'},
                        {field: 'typeName', width:'4%', title: '类型'},
                        {field: 'blogTags', width:'10%', title: '标签'},
                        {field: 'readCnt', width:'5%', title: '浏览量'},
                        {field: 'authName', width:'7%', title: '作者'},
                        {field: 'titleNotes', title: '副标题'},
                        {field: 'readLevel', width:'7%', title: '阅读权限'},
                        {field: 'addTime',width:'10%' , title: '添加日期', sort:true},
                        {field: 'cz',width:'15%', title: '操作', toolbar: '#roleToolBar'}
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