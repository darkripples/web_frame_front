// 简化日期格式
function smpDate(date){
    date = date.trim();
    var re = /^\d{4}\-\d{2}\-\d{2}\s+\d{2}:\d{2}(:\d{2})?$/;
    //var re2 = /^\d{4}\-\d{2}\-\d{2}\s+\d{2}:\d{2}$/;
    if(re.test(date)){
        return date.substring(2, 16);
    }else{
        return date;
    }
}

// 判断页面是否引入了某个js或css
function isInclude(name){
    var js = /js$/i.test(name);
    var es = document.getElementsByTagName(js?'script':'link');
    for(var i=0;i<es.length;i++){
        if(es[i][js?'src':'href'].indexOf(name) != -1){
            return true;
        }
    }
    return false;
}

/**
 * 获取URL中携带的参数
 * @param url
 */
function getUrlParams(location_search){
    url_dict={};
    location_search.replace(/([^?&=]+)=([^&]+)/g,(_,k,v)=>url_dict[k]=v);
    return url_dict;
}

/**
 * 获取当前系统日期 yyyy-mm-dd
 * 
 */
function CurentTime(){ 
    var now = new Date();
    
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();          //秒
    
    var clock = year + "-";
    
    if(month < 10)
        clock += "0";
    
    clock += month + "-";
    
    if(day < 10)
        clock += "0";
        
    clock += day;

    return(clock); 
}

/**
 * 获取当前日期前n天的日期 yyyy-mm-dd
 * 
 */
function getBeforeDate(n){
    var d = new Date();
    var year = d.getFullYear();
    var mon = d.getMonth()+1;
    var day = d.getDate();
    if(day <= n){
        if(mon>1) {
            mon=mon-1;
        } else {
            year = year-1;
            mon = 12;
        }
    }
    d.setDate(d.getDate()-n);
    year = d.getFullYear();
    mon = d.getMonth()+1;
    day = d.getDate();
    s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);
    return s;
}

/**
 * 判断对象是否为空：字符串、数组
 * @param obj
 * @returns {boolean}
 */
function isNull(obj) {
    if (!obj) {
        return true;
    }
    if (typeof(obj) == "string") {
        return !/\S/.test(obj)
    }
    else if (obj instanceof Array) {
        return obj.length > 0;
    }
    else return !!obj;
}

/**
 * 获取文件的后缀名
 * @param fileName 文件名
 */
function getFileSuffix(fileName) {
    var index1 = fileName.lastIndexOf(".");
    var index2 = fileName.length;
    var suffix = fileName.substring(index1, index2);
    return suffix;
}

/**
 * 操作成功提示
 * @param _callBack_ok 点击确定按钮的回调
 * @param message 成功提示语
 */
function tipSuccess(_callBack_ok, message){
    if(!message){
        message = '操作成功！';
    }
    top._layer.alert(message, {title: '提示', icon: 6}, function(index){
        if(_callBack_ok){
            _callBack_ok(index);
        }else{
            top._layer.close(index);
        }
    })
}

/**
 * 操作失败提示
 * @param _callBack_ok 点击确定按钮的回调
 * @param message 失败提示语
 */
function tipFail(_callBack_ok, message){
    if(!message){
    	message = '操作失败，请联系管理员！';
    }
    top._layer.alert(message, {title: '提示', icon: 5}, function(index){
        if(_callBack_ok){
        	_callBack_ok(index);
        }else{
            top._layer.close(index);
        }
    });
}

/**
 * 自定义分页标签
 * @param pageCnt 总页数
 * @param currentPage 当前第几页
 * @param funcName 要执行的函数名称
 * @returns {string}
 */
function getPageHtml(pageCnt, currentPage, funcName) {
    pageCnt = parseInt(pageCnt);
    currentPage = parseInt(currentPage);
    let navigateNumsHtml = "";

    // 判断是否存在上一页
    if(currentPage > 1 && pageCnt >= currentPage){
        navigateNumsHtml += "<li>" +
                                "<a href=\"javascript:" + funcName + "('" + (currentPage-1) + "');\"><i class='icon icon-prve'></i></a>" +
                            "</li>";
    }else{
        navigateNumsHtml += "<li><i class='icon icon-prve'></i></li>";
    }

    // 获取页码
    navigateNumsHtml += __getNavigateNums(pageCnt, currentPage, funcName);

    // 判断是否存在下一页
    if(currentPage < pageCnt){
        navigateNumsHtml += "<li>" +
                                "<a href=\"javascript:" + funcName + "('" + (currentPage + 1) + "');\"><i class='icon icon-next'></i></a>" +
                            "</li>";
    }else{
        navigateNumsHtml += "<li><i class='icon icon-next'></i></li>";
    }

    // 跳转至第几页
    // navigateNumsHtml += '<li class="pginput">跳转至<input type="text" class="form-control" value="1" id="_goPage" />页<button type="button" class="btn btn-default" onclick="__goPage(\'' + funcName + '\')" >Go</button></li>';
    // 共多少页
    navigateNumsHtml += '<span>共 ' + pageCnt + ' 页</span>';
    
    return navigateNumsHtml;

}

/**
 * 获取页码
 * @param pageCnt
 * @param currentPage
 * @param funcName
 * @returns {string}
 * @private
 */
function __getNavigateNums(pageCnt, currentPage, funcName) {
    pageCnt = parseInt(pageCnt);
    currentPage = parseInt(currentPage);
    let navigateNumsHtml = "";
    let positionCnt = 9;
    let leftPositionCnt = (positionCnt - 1) / 2;    // 左边最多显示的页码数量
    let rightPositionCnt = positionCnt - leftPositionCnt - 1;   // 右边最多显示的页码数量
    // 根据当前页码计算左右两边实际显示的页码数量
    let rightNeed = pageCnt - currentPage;
    let leftNeed = currentPage - 1;
    if (pageCnt <= positionCnt) {
        // 总页数小于等于需要展示的最多页码数，导航页码全部展示
        for (var i = 1; i <= pageCnt; i++) {
            if (i == currentPage) {
                navigateNumsHtml += "<li class='active'><a href=\"javascript:" + funcName + "(" + i + ");\">" + i + "</a></li>";
            } else {
                navigateNumsHtml += "<li><a href=\"javascript:" + funcName + "(" + i + ");\">" + i + "</a></li>";
            }
        }
    }
    else if (leftNeed <= leftPositionCnt && rightNeed >= rightPositionCnt) {
        // 左边需要的页码数小于等于规定的页码数并且右边需要的页码数大于等于规定的页码数，说明左边不需要显示点，右边需要显示点
        let cnt = 0;
        for (let i = 1; i <= currentPage; i++) {
            if (i == currentPage) {
                navigateNumsHtml += "<li class='active'><a href=\"javascript:" + funcName + "(" + i + ");\">" + i + "</a></li>";
            } else {
                navigateNumsHtml += "<li><a href=\"javascript:" + funcName + "(" + i + ");\">" + i + "</a></li>";
            }
            cnt++;
        }
        let leavePosition = positionCnt - 2 - cnt;  // 右边还剩余需要填充的页码数量
        for (let i = currentPage + 1; i <= currentPage + leavePosition; i++) {
            if (i == currentPage) {
                navigateNumsHtml += "<li class='active'><a href='\"javascript:" + funcName + "(" + i + ");\"'>" + i + "</a></li>";
            } else {
                navigateNumsHtml += "<li><a href=\"javascript:" + funcName + "(" + i + ");\">" + i + "</a></li>";
            }
        }
        navigateNumsHtml += "<li>...</li>";
        navigateNumsHtml += "<li><a href=\"javascript:" + funcName + "(" + pageCnt + ");\">" + pageCnt + "</a></li>";
    }
    else if (leftNeed > leftPositionCnt && rightNeed > rightPositionCnt) {
        // 左边需要的位置数大于规定的位置数并且右边需要的位置数大于规定的位置数，说明左边需要显示点，右边也需要显示点
        navigateNumsHtml += "<li><a href=\"javascript:" + funcName + "(" + 1 + ");\">" + 1 + "</a></li>";
        navigateNumsHtml += "<li>...</li>";
        let leftLeave = leftPositionCnt - 2;
        for (let i = currentPage - leftLeave; i < currentPage; i++) {
            navigateNumsHtml += "<li><a href=\"javascript:" + funcName + "(" + i + ");\">" + i + "</a></li>";
        }
        navigateNumsHtml += "<li class='active'><a href=\"javascript:" + funcName + "(" + currentPage + ");\">" + currentPage + "</a></li>";
        let rightLeave = rightPositionCnt - 2;
        for (let i = currentPage + 1; i <= currentPage + rightLeave; i++) {
            navigateNumsHtml += "<li><a href=\"javascript:" + funcName + "(" + i + ");\">" + i + "</a></li>";
        }
        navigateNumsHtml += "<li>...</li>";
        navigateNumsHtml += "<li><a href=\"javascript:" + funcName + "(" + pageCnt + ");\">" + pageCnt + "</a></li>";
    }
    else {
        // 左边需要的位置数大于规定的位置数并且右边需要的位置数小于规定的位置数，说明左边需要显示点，右边不需要显示点
        navigateNumsHtml += "<li><a href=\"javascript:" + funcName + "(" + 1 + ");\">" + 1 + "</a></li>";
        navigateNumsHtml += "<li>...</li>";
        let leftLeave = positionCnt - 2 - rightNeed - 1;
        for (let i = currentPage - leftLeave; i < currentPage; i++) {
            navigateNumsHtml += "<li><a href=\"javascript:" + funcName + "(" + i + ");\">" + i + "</a></li>";
        }
        for (let i = currentPage; i <= pageCnt; i++) {
            if (i == currentPage) {
                navigateNumsHtml += "<li class='active'><a href='\"javascript:" + funcName + "(" + i + ");\"'>" + i + "</a></li>";
            } else {
                navigateNumsHtml += "<li><a href=\"javascript:" + funcName + "(" + i + ");\">" + i + "</a></li>";
            }
        }
    }
    return navigateNumsHtml;
}

/**
 * 分页标签的跳转至
 * @param funcName 要执行的函数名
 * @returns {boolean}
 * @private
 */
function __goPage(funcName) {
    let pageNum = $("#_goPage").val();
    var type="^[0-9]*[1-9][0-9]*$";
    var re = new RegExp(type);
    if(pageNum.match(re) == null){
        layer.alert("请输入大于零的整数！", {title: '提示', icon: 0});
        return false;
    }else{
        eval(funcName + "(" + pageNum + ")");
    }
}
