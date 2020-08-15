$(function(){
	var userSetting = new Vue({
		el: '#userSetting',
		data: {
			_form: null,
			userInfo: {},
			headImg: URL_BASE.DEFAULT_HEAD_IMG,
			newHeadImg: '',
		},
		mounted() {
			this.$nextTick(function () {
				let that = this;
				layui.use(['form', 'upload'], function(){
					that._form = layui.form;
					var upload = layui.upload;
					// 初始化头像上传
					var uploadInst = upload.render({
						elem: '#uploadBtn',
						url: URL_BASE.FILE_UPLOAD,
						size: 2048,
						headers: {
							'token': app.getToken(),
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
							if(res.status == 0){
								// 上传成功，更新到数据库
								that.newHeadImg = res.data.newName;
								that.updHeadImg();
							}else{
								app.hideLoading();
								app.fail();
							}
						},
						error: function(){
							app.hideLoading();
							app.fail(null, '头像上传出错，请稍后再试');
						}
					});
				});
				// 初始化用户基本信息
				that.getUserBaseInfo();
				
				// 初始化表单验证
				that._form.verify({
					email: function(value, item){
						let re = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
						if(value && !re.test(value)){
							return '请填写正确格式的电子邮箱';
						}
					},
					wechat: function(value, item){
						let re = /^[a-zA-Z\d_]{5,}$/;
						if(value && !re.test(value)){
							return '请填写正确格式的微信号';
						}
					},
					qq: function(value, item){
						let re = /[1-9][0-9]{4,}/;
						if(value && !re.test(value)){
							return '请填写正确格式的QQ号';
						}
					}
				});
				
				// 监听表单提交事件
				that._form.on('submit(userInfoForm)', function(){
					that.updUserInfo();
					return false;
				});
			});
		},
		methods: {
			// 退出登录
			logout: function(){
				let that = this;
				app.confirm('确定要退出登录吗？', function(index){
					app.request(URL_BASE.LOGOUT, {}, function(json){
						app.removeToken();
						app.clrSessionStorage();
						window.location.href = '/etms_jinan/login.html'
					});
				});
			},
			// 获取用户基本信息
			getUserBaseInfo: function(){
				let that = this;
				// 先从本地session缓存中取,如果没有则从数据库中获取并放入缓存
				let _userBaseInfo = window.sessionStorage.getItem('__jn_userBaseInfo');
				if(_userBaseInfo){
					that.userInfo = JSON.parse(_userBaseInfo);
                    if(that.userInfo.headImg){
                        that.headImg = that.userInfo.headImg;
                    }
				}else{
					app.request(URL_BASE.USER_BASEINFO, {}, function(json){
						that.userInfo = json.data;
                        if(that.userInfo.headImg){
                            that.headImg = that.userInfo.headImg;
                        }
						window.sessionStorage.setItem('__jn_userBaseInfo', JSON.stringify(json.data));
					});
				}
			},
			// 提交表单
			updUserInfo: function(){
				let that = this;
				app.request(URL_BASE.USER_BASEINFO_UPD, that.userInfo, function(){
					app.success(function(){
						app.clrSessionStorage();
						window.location.reload();
					});
				});
			},
			// 更新用户头像
			updHeadImg: function(){
				let that = this;
				app.request(URL_BASE.USER_HEADIMG_UPD, {'headImg': that.newHeadImg}, function(){
					app.success(function(){
						app.clrSessionStorage();
						window.location.reload();
					});
				});
			}
		},
		updated: function(){
			let that = this;
			// 重新渲染整个form表单，解决vue和layui渲染冲突问题
			this.$nextTick(function(){
				that._form.render();
			})
		}
	});
});