$(function () {
    let dataList = new Vue({
        el: '#mainDiv',
        data: {
            mainData:{},
            id:''
        },
        mounted() {
            this.$nextTick(function () {
                let that = this;
                // 副标题设置
                that.setTitle();
                setTimeout(function(){
                    $('#titleValue').text(that.titleValue);
                }, 2600);
                
                that.id = getUrlParams(location.search).id;
                that.indexList();
            });
        },
        methods: {
            // 获取信息
            indexList: function () {
                let that = this;
                app.request(URL_BLOG.DETAIL_INFO + that.id, {}, function (json) {
                    if(!json.data || Object.keys(json.data).length==0){
                        location.href='/404.html';
                        return false;
                    }
                    that.mainData = json.data;
                    if(that.mainData && json.data.content){
                        that.mainData.content = marked(json.data.content);
                        $("code").attr("class","python");
                        hljs.initHighlightingOnLoad();
                    }
                    if(that.mainData && json.data.bgUrl){
                        $("#detail_top1").attr("style","background-image: url("+json.data.bgUrl+")");
                        $("#detail_top2").attr("style","background-image: url("+json.data.bgUrl+")");
                    }
                    if(that.mainData.title){
                        $('title').text(that.mainData.title + " - " +$('title').text());
                        $('meta[name="description"]').attr('content', that.mainData.titleNotes + "...");
                        $('meta[property="og:description"]').attr('content', that.mainData.titleNotes + "...");
                        $('meta[property="og:title"]').attr('content', that.mainData.title +" - " +$('meta[property="og:title"]').attr('content'));
                        $('link[rel="prev"]').attr('title', that.mainData.title);
                    }
                    $('meta[property="og:url"]').attr('content', $('meta[property="og:url"]').attr('content')+"?id="+that.id);
                    $('link[rel="canonical"]').attr('content', $('link[rel="canonical"]').attr('content')+"?id="+that.id);
                    $('link[rel="prev"]').attr('href', $('link[rel="prev"]').attr('href')+"?id="+that.id);
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