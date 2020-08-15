
document.write("<script src='/common/static/js/conf/config.js'></script>");
// document.write("<script src='/common/static/js/libs/jquery/jquery.min.js'></script>");
document.write("<script src='/common/static/js/utils/app.js'></script>");
//document.write("<script src='https://cdn.jsdelivr.net/npm/vue'></script>");
document.write("<script src='/common/static/js/libs/vue/vue.js'></script>");

// 禁用回车按键，防止页面中所有的按钮未失去焦点时重复点击
$(document).keyup(function(event) {
    if (event.keyCode == 13) {
        $('button').blur();
        $('a').blur();
    }
});
$(document).keydown(function(event) {
    if (event.keyCode == 13) {
        $('button').blur();
        $('a').blur();
    }
});

