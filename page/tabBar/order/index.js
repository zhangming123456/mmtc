const app = getApp(),
    util = app.util,regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../../utils/config'),
    utilPage = require('../../../utils/utilPage'),
    ApiService = require('../../../utils/ApiService');
const appPage = {
    data: {
        text: "Page me",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        Bdusers: {}
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
            this.getUserInfo()
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
    onReachBottom() {

    },
    /**
     * 页面滚动
     * @param scrollTop //页面在垂直方向已滚动的距离（单位px）
     */
    onPageScroll(options) {

    }
};
/**
 * 方法类
 */
const methods = {
    loadCb() {
        let that = this,
            options = that.data.options;
        that.getUserInfo()
    },
    loadData() {

    },
    getUserInfo(){
        let that = this;
        return ApiService.getBdusersInfo({}).then(res => {
            if (res.status === 1 && res.info.id) {
                app.globalData.userInfo = res.info;
                that.setData({
                    Bdusers: res.info
                })
            }
        });
    },
    onShareAppMessage: function (e) {
        let Bdusers = this.data.Bdusers,
            id = Bdusers.id;
        wx.showShareMenu({withShareTicket: true});
        if (!id) {
            util.failToast('邀请失败');
        } else {
            return {
                title: '美美天成',
                desc: '邀请新人',
                path: '/page/me/pages/meInvite/index?parent_id=' + id,
                imageUrl: '../../../image/icon/icon-Invitation .png',
                success: function (res) {
                    util.showToast('邀请成功');
                },
                fail: function (res) {
                    util.failToast('取消邀请');
                }
            }
        }
    }
};
Page(new utilPage(appPage, methods));