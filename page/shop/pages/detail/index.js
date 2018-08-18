const app = getApp(),
    util = app.util, regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');
const appPage = {
    data: {
        text: "Page shopDetail",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        info: {}
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
    async  loadCb () {
        let that = this,
            options = that.data.options,
            isShow = that.data.isShow;
        that.getRegisterInfo();
    },
    loadData () {

    },
    getRegisterInfo(){
        let that = this;
        if (that.data.isGetRegisterInfo)return;
        that.data.isGetRegisterInfo = true;
        util.showLoading();
        ApiService.getRegisterInfo({}).finally(res => {
            that.data.isGetRegisterInfo = false;
            util.hideLoading(true);
            if (res.status === 1) {
                that.setData({info: res.info})
            } else {
                that.$Toast({content: res.message})
            }
        })
    }
};
Page(new utilPage(appPage, methods));