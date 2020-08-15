$(function () {
    let dataList = new Vue({
        el: '#v',
        data: {
            initUrl:"/blog",
            listData:[],
            titleValue:'darkripples',
            typeId:'',
            blogType:'',
            limit:15,
            page:1,
            pageCount:1,
            count:1,
            nextPage:1,
            visiblePages:5,//设置最多显示的e页码数 可以手动设置
        },
        mounted() {
            this.$nextTick(function () {
                let that = this;
                let urlDic = getUrlParams(location.search);
                that.typeId = urlDic.type;
                var url = window.location.toString();
                var id = url.split("#")[1];
                if(that.typeId){
                    var typeListStr = window.sessionStorage.getItem("dr_blog_types");
                    if(typeListStr){
                        // 修改title
                        var typeList = JSON.parse(typeListStr);
                        var typeName = "";
                        for(var i=0;i<typeList.length;i++){
                            if(typeList[i].typeId==that.typeId){
                                typeName = typeList[i].typeName;
                                break;
                            }
                        }
                        if(typeName){
                            $("title").html(typeName + " - " + $("title").html());
                        }else{
                            // 不存在的话其实是不合法的
                            that.typeId = "";
                            id = "";
                        }

                    }else{
                        // 不存在的话其实是不合法的
                        that.typeId = "";
                        id = "";
                    }
                }
                that.page = urlDic.page ? parseInt(urlDic.page) : that.page;
                that.blogType = urlDic.type || '';
                // 主内容
                that.indexList();
                // 锚点确定
                if(id){
                    $("#headerDown").click();
                }
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
                app.request(URL_BLOG.INDEX_LIST, {page: that.page, limit:that.limit, type:that.blogType}, function (json) {
                    that.listData = json.data.list;
                    that.pageCount = json.data.pageCount;
                    that.count = json.data.count;
                    if(that.pageCount > that.page){
                        that.nextPage = that.page + 1;
                    }
                    if(that.page < that.pageCount){
                        $("#nextPage").attr("disabled",true);
                        $("#nextPage").css("pointer-events","none");
                    }

                    that.loadpage(parseInt(that.page), parseInt(that.pageCount));
                }, null, shouldShowLoading = false, method = 'GET');

            },
            // 副标题设置
            setTitle: function () {
                let that = this;
                app.request(URL_BLOG.TITLE_VALUE, {}, function (json) {
                    that.titleValue = json.data.paramValue;
                }, null, shouldShowLoading = false, method = 'GET');

            },
            // 分页初始化
            loadpage: function(currentPage, count){
                let that = this;
                var searchStr = "";
                if(that.typeId){
                    searchStr += "?type="+that.typeId;
                }
                var myPageCount = count;
                var myPageSize = that.limit;
                //var countindex = Math.ceil((myPageCount % myPageSize) > 0 ? (myPageCount / myPageSize) + 1 : (myPageCount / myPageSize));
                //$("#countindex").val(countindex);
                $.jqPaginator('#pagination', {
                    totalPages: count,//parseInt($("#countindex").val()),
                    visiblePages: that.visiblePages,
                    currentPage: currentPage,
                    first: '<a class="pagination__item" href="/blog'+searchStr+'">首页</a>',
                    prev: '<a class="pagination__item vditor-tooltipped__n vditor-tooltipped" aria-label="上一页" href="javascript:;">上页</a>',
                    next: '<a class="pagination__item vditor-tooltipped__n vditor-tooltipped" aria-label="下一页" href="javascript:;">下页</a>',
                    last: '<a class="pagination__item" href="javascript:;">末页</a>',
                    page: '<a class="pagination__item" href="javascript:;">{{page}}</a>',
                    onPageChange: function (num, type) {
                        if (type == "change") {
                            location.href = that.initUrl + "?page=" + num + "#v";
                        }
                    }
                });
            },
        }
    });
});