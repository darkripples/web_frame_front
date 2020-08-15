$(function(){
    // 菜单动画
    $('.custom-nav-child dd a').click(function() {
    	
	});

    let navbar = new Vue({
        el: '#navbar',
        data: {
            menuLst: [],
            webName: "黑色涟漪",
            headImg: URL_MANAGE.DEFAULT_HEAD_IMG,
			layElem: null,
            userName: ''
        },
        mounted() {
            this.$nextTick(function () {

				if(!app.getToken()){
                    app.alert("请登录");
                    setStorage('referer', window.location.href);
                    window.location.href = "/dr/authc/login.html";
                    return false;
                }

				// 初始化layer，方便其他子页面直接使用
				layui.use('layer', function() {
					window._layer = layui.layer;
				});

				$('#tablist').css('width', $('#tablist').width()+'px')
				
                // 初始化用户的菜单
                this.initMenus();
                
                // 获取用户基本信息
                this.getUserBaseInfo();
            });
        },
        methods: {
            // 菜单打开和收起
            menuOpen: function(id){
                $('#' + id).parent('.custom-nav-item').toggleClass('opend').children('.custom-nav-child').slideToggle(200);
            },
            // 初始化用户的菜单
            initMenus: function(){
                let that = this;
                // 先从本地session缓存中取,如果没有则从数据库中获取并放入缓存
                let _menuLst = getStorage('menuLst');
                if(_menuLst){
                    that.menuLst = JSON.parse(_menuLst);
					that.$nextTick(function(){
						that.addTab();
					});
                }else{
                    app.request(URL_MANAGE.GET_USER_MENU, {}, function(json){
                        that.menuLst = json.data;
                        if(that.menuLst.length>0){
                            setStorage('menuLst', JSON.stringify(json.data));
                            that.$nextTick(function(){
                                that.addTab();
                            });
                        }
                    }, {}, shouldShowLoading=false, method="GET");
                }
            },
            // 打开新的tab或聚焦到已打开的tab
            addTab: function(tabId){
				let that = this;
				layui.use('element', function() {
					let layElem = layui.element;
					if(!tabId){
						// 初始化显示第一个tab页
						let firstMenu = that.menuLst[0];
						if(firstMenu.hasChildren){
							tabId = firstMenu.children[0].menuId;
						}else{
							tabId = firstMenu.menuId;
						}
					}
					let _filter = 'tab-container';
					let obj = $(".layui-tab-title li[lay-id='" + tabId + "']");
					if(obj.length < 1){
						let _url = $('#'+tabId).data('url');
						let _title = $('#'+tabId).data('title');
						layElem.tabAdd(_filter, {
							id: tabId,
							title: $('#'+tabId).data('title'),
							content: '<iframe id="iframe_' + tabId + '" src="' + $('#'+tabId).data('url') + '" class="frame"></iframe>',
							tabId: tabId,
						});
					}
					layElem.tabChange(_filter, tabId);
                    $('#iframe_' + tabId).attr('src', $('#'+tabId).data('url'));
                    
                    layElem.on('tab(' + _filter + ')', function(data){
                        var _tabId = $(this).attr('lay-id');
                        // 更换菜单样式
                        $('.custom-nav-child dd a').removeClass('active');
                        $('.custom-nav-item a').removeClass('active');
                        $('#'+_tabId).toggleClass('active');
                    });
					
					// 更换菜单样式
                    $('.custom-nav-child dd a').removeClass('active');
                    $('.custom-nav-item a').removeClass('active');
					$('#'+tabId).toggleClass('active');
				});
            },
            // 获取用户基本信息
            getUserBaseInfo: function(){
            	let that = this;
            	// 先从本地session缓存中取,如果没有则从数据库中获取并放入缓存
            	let _userBaseInfo = getStorage('userInfo');
            	if(_userBaseInfo){
            		let userInfoJson = JSON.parse(_userBaseInfo);
                        that.userName = userInfoJson.userName;
            		if(userInfoJson.headImg){
            			that.headImg = userInfoJson.headImg;
            		}
            	}else{
            		app.request(URL_MANAGE.USER_INFO, {}, function(json){
            			let userInfoJson = json.data;
            			that.userName = userInfoJson.userName;
            			if(userInfoJson.headImg){
            				that.headImg = userInfoJson.headImg;
            			}
            			setStorage('userInfo', JSON.stringify(json.data));
            		},{}, shouldShowLoading=false, method="GET");
            	}
            },
            // 退出登录
            logout: function(){
            	let that = this;
            	app.confirm('确定要退出登录吗？', function(index){
            		app.request(URL_DR.DO_LOGOUT, {}, function(json){
            			app.removeToken();
            			app.clrSessionStorage();
            			window.location.href = '/';
            		});
            	});
            },
            // 修改密码
            repassword: function(){
            	top._layer.open({
					title: '修改密码',
					type: 2,
					anim: 0,
					resize: true,
					area: ['600px', '400px'],
					content: '/dr/manage/ucenter/repwd.html'
				});
            },
        }
    });
});