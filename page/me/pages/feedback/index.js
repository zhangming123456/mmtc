const app = getApp(),
    util = app.util, regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');
const appPage = {
    data: {
        text: "Page meFeedback",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        img_src: ''
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
    },
    loadData () {

    },
    selectPic(){
        this.ImageUpload(1, 'img_src').finally(res => {

        })
    },
    doSubmit(e) {
        console.log(e);
        let that = this,
            value = e.detail.value,
            content = value.content,
            contact = value.contact,
            img_srcs = this.data.img_srcs || '';
        if (!value.content) {
            that.$Toast({content: "请输入您要反馈的意见"});
            return;
        }
        if (!value.contact) {
            that.$Toast({content: "请输入您的邮箱地址"});
            return;
        }
        if (that.data.isDoSubmit)return;
        util.showLoading();
        that.data.isDoSubmit = true;
        ApiService.submitShopFeedback({content, contact, img_srcs}).finally(res => {
            that.data.isDoSubmit = false;
            util.hideLoading(false);
            if (res.status === 1) {
                that.$Toast({content: "提交成功，感谢您的反馈！"});
                that.$route.tab('/page/tabBar/me/index');
            } else {
                that.$Toast({content: res.message});
            }
        })
    }
};
Page(new utilPage(appPage, methods));