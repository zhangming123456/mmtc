const app = getApp(),
    util = app.util,regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');
const appPage = {
    data: {
        text: "Page verifyHas",
        isFixed: false,
        loadingMore: true,
        noMore: false,
    },
    onLoad: function (options) {
        let that = this;
        that.loadCb();
    },
    /**
     * 进入页面
     */
    onShow: function (options) {
        let that = this;

    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    /**
     * 页面渲染完成
     */
    onReady: function () {
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this;
    },
    /**
     * 上拉触底
     */
    onReachBottom () {
        let that = this;
    },
    /**
     * 页面滚动
     * @param scrollTop //页面在垂直方向已滚动的距离（单位px）
     */
    onPageScroll (options) {

    }
};
/**
 * 方法类
 */
const methods = {
    loadCb () {
        let that = this,
            options = that.data.options,
            isShow = that.data.isShow;
    },
    loadData () {

    },
    scanAgain () {
        let that = this;
        that.$route.tab('/page/tabBar/home/index').finally(res => {
            if (res.status === 1) {
                setTimeout(function () {
                    that.scanCodeVerify()
                }, 400)
            }
        })
    },
    checkValid () {
        let pages = this.$route.getCurrentPages();
        console.log(pages);
        let findIndex = pages.findIndex(function (v) {
            return v.route === 'page/home/pages/verifyCode/index'
        });
        if (findIndex > -1) {
            this.$route.go(pages.length - 1 - findIndex)
        } else {
            this.$route.tab({
                path: '/page/tabBar/home/index',
                redirectedFrom: '/page/home/pages/verifyCode/index'
            })
        }
    }
};
Page(new utilPage(appPage, methods));