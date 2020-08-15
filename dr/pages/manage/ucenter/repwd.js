$(function(){
	let repwd = new Vue({
		el: '#repwd',
		data: {
			_form: null,
			oldPwd: '',
			newPwd: '',
			confirmPwd: ''
		},
		mounted() {
			this.$nextTick(function(){
				let that = this;
				layui.use(['form'], function(){
					that._form = layui.form;
				});
				
				// 初始化表单验证
				that._form.verify({
					password: function(value, item){
						if(!value){
							return '必填项不能为空'
						}else if(value.length < 6 || value.length > 16){
							return '请填写长度为6~16位的密码'
						}
					},
					password2: function(value, item){
						if(!value){
							return '必填项不能为空'
						}else if(value != that.newPwd){
							return '新密码与确认密码不一致';
						}
					},
					
				});
				
				// 监听表单提交事件
				that._form.on('submit(repwdForm)', function(){
					that.repwd();
					return false;
				});
			});
		},
		methods: {
			repwd: function(){
				let that = this;
				app.confirm('确定要提交本次密码修改吗？', function(){
					app.request(URL_DR.USER_MOD_PWD, {'oldPwd': that.oldPwd, 'newPwd': that.newPwd}, function(){
						app.success(function(){
							top._layer.closeAll();
						});
					}, function(resp){
						app.fail(null, resp.message);
					});
				});
			}
		}
	});
});