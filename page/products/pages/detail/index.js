const app = getApp(),
    util = app.util, regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');
const appPage = {
    data: {
        text: "Page productsDetail",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        id: '',
        info: {},
        article: null,
        timeflag: ''
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
            setData = {id: options.id};
        that.siteItemInfo(setData)
    },
    loadData () {

    },
    siteItemInfo (setData = {}) {
        let that = this,
            id = setData.id || that.data.id;
        if (!id || that.data.isSiteItemInfo) return;
        that.data.isSiteItemInfo = true;
        util.showLoading();
        ApiService.siteItemInfo({id}).finally(res => {
            that.data.isSiteItemInfo = false;
            util.hideLoading(true);
            if (res.status === 1) {
                let info = res.info;
                if (info.auth_status == 0) {
                    setData.timeflag = "提交";
                } else if (that.status == 1) {
                    setData.timeflag = "上架";
                } else {
                    setData.timeflag = "下架";
                }
                that.$wxParse.wxParse('article', 'html', info.intro, that, 5);
                setData.info = info;
            } else {
                that.$Toast({content: res.message})
            }
            that.setData(setData)
        })
    }
};
Page(new utilPage(appPage, methods));