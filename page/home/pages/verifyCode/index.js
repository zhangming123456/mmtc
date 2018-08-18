const app = getApp(),
    util = app.util,regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');
const appPage = {
    data: {
        text: "Page verifyCode",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        num: "",
        isEnabled: false
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
        that.getData(1, true).finally(res => {
            that.stopPullDownRefresh()
        })
    },
    /**
     * 上拉触底
     */
    onReachBottom () {
        let that = this,
            page = that.data.page;
        that.getData(page)
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
            isShow = that.data.isShow
    },
    loadData () {

    },
    deleteNum () {
        let num = this.data.num;
        if (num && num.length > 0) {
            this.setData({
                num: num.substr(0, num.length - 1)
            })
        }
    },
    tapNum (e) {
        let dataset = e.target.dataset;
        let num = this.data.num;
        if (num && num.length >= 12) return;
        this.setData({
            num: `${num || ''}${dataset.num || ''}`
        });
    },
    doCheck () {
        let that = this, pwd = this.data.num;
        this.__verificationSee(pwd)
    }
};
Page(new utilPage(appPage, methods));