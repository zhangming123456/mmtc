const app = getApp(),
    util = app.util, regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');
const appPage = {
    data: {
        text: "Page storeTag",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        tag: '',
        my_tags: [],
        hot_tags: [],

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
        that.showGetAllTags();
    },
    loadData () {

    },
    showGetAllTags(){
        let that = this;
        util.showLoading();
        ApiService.showGetAllTags().finally(res => {
            util.hideLoading(true);
            if (res.status === 1) {
                that.setData({
                    my_tags: res.info.my_tags,
                    hot_tags: res.info.hot_tags
                })
            }
        })
    },
    setTag(e){
        let value = e.detail.value;
        this.data.tag = util.trim(value);
        return util.trim(value)
    },
    bindCloseInput(){
        this.setData({tag: ''})
    },
    bindCloseTag(e){
        let index = e.currentTarget.dataset.index,
            my_tabs = this.data.my_tags;
        if (index >= 0) {
            my_tabs.splice(index, 1);
            let tags = util.unique(my_tabs);
            this.setData({my_tags: tags})
        }
    },
    bindAddTag(e){
        let that = this,
            index = e.currentTarget.dataset.index,
            my_tabs = this.data.my_tags,
            hot_tabs = this.data.hot_tags,
            value = this.data.tag;
        if (index >= 0) {
            value = hot_tabs[index]
        }
        value = util.trim(value);
        if (!!value) {
            if (my_tabs.length >= 7) {
                that.$Message({content: '不超过7个~', type: "warning"});
                return;
            }
            my_tabs.push(value);
            let tags = util.unique(my_tabs);
            this.setData({my_tags: tags, tag: ''})
        }
    },
    bindSubmit(){
        let that = this, tags = that.data.my_tags;
        if (tags.length === 0) {
            that.$Message({content: '至少一个', type: "warning"});
            return;
        }
        if (tags.length > 7) {
            that.$Message({content: '不超过7个~', type: "warning"});
            return;
        }
        if (that.data.isSubmit)return;
        that.data.isSubmit = true;
        util.showLoading();
        ApiService.showSetShopTags({tags: tags.toString()}).finally(res => {
            that.data.isSubmit = false;
            util.hideLoading(true);
            if (res.status === 1) {
                that.$route.back();
            } else {
                that.$Message({content: res.message, type: 'error'})
            }
        })
    }
};
Page(new utilPage(appPage, methods));