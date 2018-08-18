const app = getApp(),
    util = app.util, regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');
const appPage = {
    data: {
        text: "Page detailedAddress",
        isFixed: false,
        loadingMore: true,
        noMore: false
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
        this.setData({
            clearTimer: true
        });
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
    },
    loadData () {

    },
    formSubmit(e){
        let that = this,
            address = e.detail.value.address;
        if (that.data.isFormSubmit)return;
        if (!util.trim(address)) {
            that.$Message({content: "详细地址不能为空~", type: 'error'})
            return;
        }
        that.data.isFormSubmit = true;
        util.showLoading();
        ApiService.shopSaveDetailAddr({address}).finally(res => {
            that.data.isFormSubmit = false;
            util.hideLoading(true);
            if (res.status === 1) {
                that.$route.back()
            } else {
                that.$Message({content: res.message, type: 'error'});
            }
        })
    }
};
Page(new utilPage(appPage, methods));