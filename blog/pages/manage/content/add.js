$(function(){
	let dataList = new Vue({
		el: '#dataInfo',
		data: {
		    dataInfo:{
                title:'',
                titleNotes: '',
                blogType:'',
                blogTags:'',
                content:'',
                id:'',
                bgUrl:'',
                rLevel:-1,
            },
            id:'',
            headImg:'',
            newHeadImg: '',
		},
		mounted() {
			this.$nextTick(function () {
                let that = this;

                layui.use(['form', 'upload'], function(){
					that._form = layui.form;
					var upload = layui.upload;
					// 初始化图片上传
					var uploadInst = upload.render({
						elem: '#uploadBtn',
						url: URL_DR.UPLOAD_FILE,
						size: 2048,
						headers: {
							'token': app.getToken(),
							'X-Requested-With': "XMLHttpRequest",
						},
						choose: function(obj){
							obj.preview(function(index, file, result){
								that.headImg = result;
							});
						},
						before: function(){
							app.showLoading();
						},
						done: function(res){
						    app.hideLoading();
							if(res.code == 0){
								// 上传成功，更新到数据库
								that.newHeadImg = res.data.newName;
							}else{
								app.fail({}, res.msg);
							}
						},
						error: function(){
							app.hideLoading();
							app.fail(null, '上传出错，请稍后再试');
						}
					});

					that._form.on('select(bType)', function(data){
                        var temp = data.value;
                        that.dataInfo.blogType = temp;
                    });
				});

                if(top.bId!='' && top.bId != undefined){
                    // 修改
                    that.getDataInfo();
                }

                // 初始化类型列表
                app.request(URL_BLOG.TYPES_LIST, {forManage:1}, function(json){
                    var html = "<option value=''></option>";
                    $.each(json.data,function (i,val) {
                        html += "<option value='"+val.typeId+"'";
                        if(top.bType && top.bType==val.typeId){
                            html += "selected";
                        }else{
                            html += "";
                        }
                        html += ">"+val.typeName+"</option>"
                    });
                    $("#bType").append(html);
                    that._form.render();
                },function(json){
                }, shouldShowLoading = false, method='GET');

                // 监听表单提交事件
                that._form.on('submit(saveRole)', function(){
                    that.saveData();
                    return false;
                });

			});
		},
		methods: {
            // 获取信息
            getDataInfo: function(){
                let that = this;
                app.request(URL_BLOG.DETAIL_INFO + top.bId, {forManage: 1}, function(json){
                    dataInfo = json.data;
                    that.id = dataInfo.id;
                    that.dataInfo.title = dataInfo.title;
                    that.dataInfo.content = dataInfo.content;
                    that.dataInfo.titleNotes = dataInfo.titleNotes;
                    that.dataInfo.readLevel = dataInfo.readLevel;
                    that.dataInfo.blogType = dataInfo.blogType;
                    that.dataInfo.blogTags = dataInfo.blogTags;
                    that.headImg = dataInfo.bgUrl ? dataInfo.bgUrl : window.location.host+dataInfo;
                    that.newHeadImg = that.headImg;
                    $("select[id='bType']").val(that.dataInfo.blogType);

                    that._form.render();
                },function(json){
                }, shouldShowLoading = false, method='GET');

            },
            // 保存
            saveData: function () {
                let that = this;
                let dataInfo = that.dataInfo;
                if(that.newHeadImg == ''){
                    app.alert("请上传背景图");
                    return false;
                }
                dataInfo.bgUrl = that.newHeadImg;
                if(top.bId != '' && top.bId != undefined){
                    dataInfo.modType = "upd";
                    dataInfo.id = that.id;
                }else{
                    dataInfo.id = that.dataInfo.code;
                    dataInfo.modType = "add";
                }
                app.request(URL_BLOG.BLOG_ADD + dataInfo.modType, dataInfo, function(json){
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