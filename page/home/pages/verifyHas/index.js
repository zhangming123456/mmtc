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
        order_id: '',
        itemInfo: {}
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
            isShow = that.data.isShow,
            setData = {order_id: options.order_id};
        that.verificationOrderInfo(setData)
    },
    loadData () {

    },
    verificationOrderInfo (setData = {}) {
        let that = this,
            id = setData.order_id || that.data.order_id;
        if (!id || that.data.isVerificationOrderInfo) return;
        that.data.isVerificationOrderInfo = true;
        util.showLoading();
        ApiService.verificationOrderInfo({id}).finally(res => {
            that.data.isVerificationOrderInfo = false;
            util.hideLoading(true);
            if (res.status === 1) {
                setData.itemInfo = res.info
            } else {
                that.$Toast({content: res.message})
            }
            that.setData(setData)
        })
    }
};
Page(new utilPage(appPage, methods));