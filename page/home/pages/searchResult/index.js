const app = getApp(),
    util = app.util, regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');
const appPage = {
    data: {
        text: "Page searchResult",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        kw: "",
        type: 0,
        itemList: [],
        page: 1
    },
    onLoad: function (options) {
        let that = this;
        that.loadCb();
    },
    /**
     * 进入页面
     */
    onShow: function (options) {

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
        that.getShopSite(1, true).finally(function () {
            that.stopPullDownRefresh()
        })
    },
    /**
     * 上拉触底
     */
    onReachBottom() {
        let that = this, page = that.data.page;
        that.getShopSite(page++, true)
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
            options = that.data.options,
            kw = options.kw || "",
            type = options.type || 0;
        that.setData({kw, type});
        that.getShopSite();
    },
    loadData() {

    },

    getShopSite(page = 1, bol) {
        let that = this,
            setData = {},
            kw = util.trim(that.data.kw),
            type = that.data.type;
        if (that.data.isGetShopSite)return;
        that.data.isGetShopSite = true;
        if (!bol) {
            util.showLoading();
        }
        that.setData({noMore: false});
        return ApiService.getShopSite({p: page, kw, type}).finally(res => {
            let info = res.info;
            util.hideLoading(true);
            that.data.isGetShopSite = false;
            if (res.status === 1) {
                if (info.length > 0) {
                    if (page === 1) {
                        setData.itemList = [info];
                    } else {
                        setData[`itemList[${page - 1}]`] = info
                    }
                    setData.page = page + 1;
                } else if (info.length === 0) {
                    if (page > 1) {
                        setData.page = page - 1;
                    }
                    setData.noMore = true;
                }
                that.setData(setData);
            }
        })
    },

    doSearchTxt(e) {
        let v = util.trim(e.detail.value),
            list = wx.getStorageSync('_search_history_');
        if (list && list.length > 10) {
            list = list.splice(10);
        }
        list && list.unshift(v);
        list = util.unique(list);
        wx.setStorageSync("_search_history_", list);
        this.setData({kw: v});
        this.getShopSite(1)
    },
};
Page(new utilPage(appPage, methods));