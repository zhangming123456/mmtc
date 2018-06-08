const app = getApp(),
    utilPage = require('../../../utils/utilPage'),
    config = require('../../../utils/config'),
    ApiService = require('../../../utils/azm/ApiService'),
    c = require("../../../utils/common"),
    map = require("../../../utils/map");
const appPage = {
    data: {
        text: "Page userLogin",
        isFixed: false,
        loadingMore: true
    },
    onLoad: function (options) {
        let that = this;
        that.loadCb();
    },
    /**
     * 进入页面
     */
    onShow: function (options) {
        if (this.data.isShow) {
            this.loadCb();
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
    onReachBottom(){

    },
    /**
     * 页面滚动
     * @param scrollTop //页面在垂直方向已滚动的距离（单位px）
     */
    onPageScroll(options){

    }
}
/**
 * 方法类
 */
const methods = {
    loadCb(){
        let that = this,
            options = that.data.options;
    },

};
Page(new utilPage(appPage, methods));