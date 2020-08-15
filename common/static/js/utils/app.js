function app() {}

top = top || window;

app.getCookie = function(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

app.csrfSafeMethod = function (method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

/**
 * 获取Token
 */
app.getToken = function () {
    let token = window.sessionStorage.getItem("dr_token");
    return token ? token : "";
};

/**
 * 设置Token
 */
app.setToken = function (token) {
    window.sessionStorage.setItem("dr_token", token);
};

/**
 * 删除Token
 */
app.removeToken = function(){
	window.sessionStorage.removeItem('dr_token');
};

/**
 * 清除会话存储
 */
app.clrSessionStorage = function(){
    window.sessionStorage.removeItem('dr_token');
    window.sessionStorage.removeItem('dr_menuLst');
    window.sessionStorage.removeItem('dr_userInfo');
}

/**
 * ajax请求，可以选择是否显示加载中
 * @param url 接口请求地址
 * @param params 参数
 * @param _success 接口返回成功回调
 * @param _fail 接口返回失败回调
 * @param shouldShowLoading 
 */
app.request = function (url, params, _success, _fail, shouldShowLoading = true, method='POST') {
	if(sysconf.DEV_MODE){
		console.log('请求', url, '的参数为：', JSON.stringify(params));
	}
    if (shouldShowLoading) {
        app.showLoading();
    }
    if (!params) {
        params = {};
    }
    let obj = {
        url: url, 
        type: method,
        //crossDomain: false,
        xhrFields: {withCredentials: true}, // xhrFields参数解决跨域导致每次请求sessionID不同的问题
        beforeSend: function(request, settings) {
            // set header的时候，需对应后端的跨域配置settings
            let token = app.getToken() ? app.getToken() : "";
            request.setRequestHeader("Token", token);
            request.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
            request.setRequestHeader("X-CSRFToken", app.getCookie('csrftoken'));
            request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        }
    };
    obj.data = params;

    // 执行ajax请求成功
	obj.success = function (d) {
		if(shouldShowLoading){
			app.hideLoading();
		}
		let json = typeof(d) == "string" ? eval('(' + d + ')') : d;
		if (json.code == 0) {
			// 接口返回成功
			if(_success){
				_success(json);
			}else{
				app.success();
			}
		} else if(json.code == 1) {
			// 接口返回业务失败
			if (_fail) {
				_fail(json);
			}else{
				app.fail(null, json.msg);
			}
		} else {
			__doneErr(json);
		}
	};
    
    // 执行ajax请求出错
    obj.error = function (XMLHttpRequest, textStatus) {
        if(shouldShowLoading){
            app.hideLoading();
        }
        console.log('接口请求执行出错>>>>>>>>>>>>>>');
        console.log('XMLHttpRequest.status：' + XMLHttpRequest.status);
        console.log('XMLHttpRequest.readyState：' + XMLHttpRequest.readyState);
        console.log('textStatus：' + textStatus);
    }

    // 执行ajax请求
    $.ajax(obj);
};

/**
 * 初始化layui的table控件
 * @param tableId
 * @param requestUrl 请求URL
 * @param params 请求参数
 * @param isPage 是否分页：默认true
 */
app.initLayuiTable = function(tableId, requestUrl, params, isPage=true, _limit=25, method='GET'){
	if(!isInclude('layui.css') || !isInclude('layui.all.js')){
		app.alert('请引入layui.css && layui.all.js');
	}else{
		if(!params){
			params = {};
		}
		let _table;
		layui.use('table', function(){
			let filter = $('#' + tableId).attr('lay-filter');
			let _autoSort = true;
			if(filter){
				// server段排序
				_autoSort = false;
			}
			_table = layui.table;
			_table.set({
				elem: '#' + tableId,
				url: requestUrl,
				method: method,
				headers: {"X-Requested-With":"XMLHttpRequest", "token": app.getToken()},
				where: params,
				size: 'sm',
				even: 'true',
				autoSort: _autoSort,
				text: {
					none: '暂无相关数据'
				}
			});
			if(isPage){
				_table.set({
					page: true,
					limit: _limit,
					limits: [10, 20, 25, 30, 50],
					parseData: function(res){
						let code = res.code;
						let msg = res.msg;
						if(code == 0){
							return { "code": code, "msg": msg, "count": res.data.count, "data": res.data.list }
						}else if(code == 1) {
							// 接口返回业务失败
							return { "code": code, "msg": msg, "count": 0, "data": [] }
						} else {
							__doneErr(res);
						}
					},
				});
			}else{
				_table.set({
					page:false,
					parseData: function(res){

						let code = res.status;
						let msg = res.message;
						if(code == 0){
							return { "code": code, "msg": msg, "data": res.data }
						}else if(code == 1) {
							// 接口返回业务失败
							return { "code": code, "msg": msg, "data": [] }
						} else {
							__doneErr(res);
						}
					},
				});
			}

			// 监听排序
			if(filter){
				_table.on('sort(' + filter + ')', function(obj){
					params['orderField'] = obj.field;
					params['orderType'] = obj.type;
					_table.reload(tableId, {
						initSort: obj,
						where: params
					});
				});
			}
		});
		return _table;
	}
}

/**
 * ajax请求，不显示加载中效果
 */
app.request_noLoadding = function (url, params, _success, _fail) {
    app.request(url, params, _success, _fail, false);
};

/**
 * 发送消息到服务器
 */
app.sendMessage = function(url, params){
    app.request_noLoadding(url, params, function(){
        console.log("消息发送成功");
    }, function(){
        console.log("消息发送失败");
    });
}



/**
 * 弹出确认框
 * @param msg 提示信息
 * @param _yes 点击确认按钮的回调函数
 * @param _cancel 点击取消按钮的回调函数
 */
app.confirm = function(msg, _yes, _cancel){
	layer.confirm(msg, {icon: 3, title: '提示'}, function(index){
		layer.close(index);
		if(_yes){
			_yes(index);
		}
	}, function(index){
		layer.close(index);
		if(_cancel){
			_cancel(index)
		}
	});
}

/**
 * 弹出提示框
 * @param msg 提示信息
 * @param _yes 点击确认按钮的回调函数
 */
app.alert = function(msg, _yes){
	layer.alert(msg, {icon: 0, title: '提示'}, function(index){
		layer.close(index);
		if(_yes){
			_yes(index);
		}
	});
}

/**
 * 弹出操作成功提示
 * @param _yes 点击确认按钮的回调函数
 * @param msg 提示信息
 */
app.success = function(_yes, msg){
	if(!msg){
		msg = '操作成功！'
	}
	layer.alert(msg, {icon: 6, title: '提示'}, function(index){
		layer.close(index);
		if(_yes){
			_yes(index);
		}
	});
}

/**
 * 弹出操作失败提示
 * @param _yes 点击确认按钮的回调函数
 * @param msg 提示信息
 */
app.fail = function(_yes, msg){
	if(!msg){
		msg = '操作失败，请稍后再试！'
	}
	layer.alert(msg, {icon: 5, title: '提示'}, function(index){
		layer.close(index);
		if(_yes){
			_yes(index);
		}
	});
}

/**
 * 显示加载中
 */
app.showLoading = function(){
	let index = layer.load(0, {shade: [0.6, '#999']});
	return index;
}

/**
 * 隐藏加载中
 */
app.hideLoading = function(index){
	if(index){
		layer.close(index);
	}else{
		layer.closeAll('loading');
	}
}

/**
 * 请求异常情况处理
 */
function __doneErr(jsonObj){
	let code = jsonObj.code;
	if(code==8){
	    // 需登录
        app.removeToken();
        app.clrSessionStorage();
        window.location.href = '/dr/authc/login.html';
	}
	if(sysconf.DEV_MODE){
	    console.log(jsonObj);
	}
}

if(!sysconf.DEV_MODE){
	console.log("%cDarkRipples%c\n  黑色涟漪"+" © "+(new Date).getFullYear(),"font-size:96px;color:#3b3e43","font-size:12px;color:rgba(0,0,0,0.38);");
}

