$(function () {
    let dataList = new Vue({
        el: '#v',
        data: {
            initUrl:"/blog",
            listData:[],
            titleValue:'darkripples',
        },
        mounted() {
            this.$nextTick(function () {
                let that = this;
                // 主内容
                that.indexList();
                // 锚点确定
                // $("#headerDown").click();
                // 副标题设置
                that.setTitle();
                setTimeout(function(){
                    $('#titleValue').text(that.titleValue);
                }, 2600);
            });
        },
        methods: {
            // 获取信息
            indexList: function () {
                let that = this;
                app.request(URL_BLOG.TYPES_LIST, {}, function (json) {
                    that.listData = json.data;
                }, null, shouldShowLoading = false, method = 'GET');

            },
            // 副标题设置
            setTitle: function () {
                let that = this;
                app.request(URL_BLOG.TITLE_VALUE, {}, function (json) {
                    that.titleValue = json.data.paramValue;
                }, null, shouldShowLoading = false, method = 'GET');

            },

        }
    });
});