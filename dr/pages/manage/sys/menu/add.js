$(function () {
    let dataList = new Vue({
        el: '#dataList',
        data: {
            id: '',
            aliasName: '',
            icon: '',
            name: '',
            parentId: '',
            href: '',
            orderNo: '',
            url:''
        },
        mounted() {
            this.$nextTick(function () {
                let that = this;
                if (top.id != undefined && top.id.length > 0) {
                    if (top.parentId != undefined) {
                        dataList.parentId = top.parentId;
                    }
                    that.initData();
                }
                app.request(URL_MANAGE.GET_ROLE_MENU, {}, function (json) {
                    layui.use(['treeSelect', 'form'], function () {
                        that.treeSelect = layui.treeSelect;
                        that.treeSelect.render({
                            // 选择器
                            elem: '#parentId',
                            // 数据
                            data: json.data,
                            // 异步加载方式：get/post，默认get
                            // 占位符
                            placeholder: '选择上级菜单',
                            // 点击回调
                            click: function (d) {
                                dataList.parentId = d.current.id;
                            },
                            // 加载完成后的回调函数
                            success: function (d) {
                                if (dataList.parentId.length > 0) {
                                    that.treeSelect.checkNode('parentId', dataList.parentId);
                                }
                                //                刷新树结构
                                //                treeSelect.refresh();
                            }
                        });
                    });

                }, {}, shouldShowLoading = false, method='GET');

            });

        },
        methods: {
            // 获取信息
            initData: function () {
                let that = this;
                dataList.id = top.id;
                dataList.aliasName = top.aliasName;
                dataList.icon = top.icon;
                dataList.name = top.name;
                dataList.href = top.href;
                dataList.orderNo = top.orderNo;
                dataList.url = top.url;
                top.id = '';
                top.aliasName = '';
                top.icon = '';
                top.name = '';
                top.parentId = '';
                top.href = '';
                top.orderNo = '';
                top.url = '';
            },
            // 保存
            saveData: function () {
                let that = this;
                var data = {
                    id: dataList.id,
                    aliasName: dataList.aliasName,
                    icon: dataList.icon,
                    showName: dataList.name,
                    parentId: dataList.parentId,
                    href: dataList.href,
                    orderNo: dataList.orderNo,
                    url: dataList.url
                };
                var url = URL_MANAGE.DO_MENU_SAVE + 'add';
                if (dataList.id.length > 0) {
                    url = URL_MANAGE.DO_MENU_SAVE + 'upd';
                }
                app.request(url, data, function (json) {
                    app.success(function () {
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);//关闭当前页
                    });
                }, function (json) {
                    app.fail(null, json.msg);
                });
            }
        }
    });
});

layui.config({
    base: '/common/static/vendor/'
}).extend({
    treeSelect: 'treeSelect/treeSelect'
});