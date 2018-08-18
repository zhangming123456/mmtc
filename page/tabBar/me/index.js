const app = getApp(),
    util = app.util, regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../../utils/config'),
    utilPage = require('../../../utils/utilPage'),
    ApiService = require('../../../utils/ApiService');
const appPage = {
    data: {
        text: "Page mime",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        userInfo: {},
        bdInfo: {}
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
        if (that.data.isShow) {
            that.loadData()
        }
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
    async  loadCb () {
        let that = this,
            options = that.data.options,
            isShow = that.data.isShow;
        await that.loadData();
    },
    async  loadData () {
        let that = this;
        await that.getUserInfo();
        await that.getIndxSite();
    },
    getUserInfo (setData = {}) {
        let that = this;
        if (that.data.isGetUserInfo) return;
        that.data.isGetUserInfo = true;
        util.showLoading();
        return ApiService.getUserInfo({}).finally(res => {
            that.data.isGetUserInfo = false;
            util.hideLoading(true);
            if (res.status === 1) {
                setData.userInfo = res.info;
            } else {
                that.$Toast({content: res.message})
            }
            that.setData(setData)
        })
    },
    getIndxSite (setData = {}) {
        let that = this;
        if (that.data.isGetIndxSite) return;
        that.data.isGetIndxSite = true;
        util.showLoading();
        return ApiService.getIndxSite({}).finally(res => {
            that.data.isGetIndxSite = false;
            util.hideLoading(true);
            if (res.status === 1) {
                setData.bdInfo = res.info;
            } else {
                that.$Toast({content: res.message})
            }
            that.setData(setData)
        })
    },
    toMimeInfo(){
        this.$route.push('/page/shop/pages/info/index')
    }
};
Page(new utilPage(appPage, methods));