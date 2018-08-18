const app = getApp(),
    util = app.util,regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');
const appPage = {
    data: {
        text: "Page search",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        list: [],
        type: 0
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
    onReachBottom() {
        let that = this,
            page = that.data.page;
        that.getData(page)
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
            isShow = that.data.isShow
        that.filterSearchHistory()
    },
    loadData() {

    },
    filterSearchHistory(setData = {}, value){
        if (typeof arguments[0] === 'string') {
            value = arguments[0];
            setData = {}
        }
        let that = this,
            list = wx.getStorageSync('_search_history_'),
            i = 0;
        while (i < list.length) {
            if (util.trim(list[i]) === '') {
                list.splice(i, 1)
            }
            i++;
        }
        list && value && list.unshift(value);
        list = util.unique(list);
        wx.setStorageSync("_search_history_", list);
        that.setData(Object.assign(setData, {list}))
    },
    /**
     * 清除搜索历史记录
     */
    clearHistories() {
        wx.removeStorageSync("_search_history_");
        this.setData({list: []})
    },
    doSearchTxt(e) {
        let v = util.trim(e.detail.value);
        this.filterSearchHistory(v);
        this.doSearch(null, v)
    },
    doSearch(e, v){
        let value = e ? e.target.dataset.value : v;
        util.router.push({
            path: '/page/home/pages/searchResult/index',
            query: {
                kw: value,
                type: this.data.type
            }
        })
    }
};
Page(new utilPage(appPage, methods));