const app = getApp(),
    util = app.util, regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../../utils/config'),
    utilPage = require('../../../utils/utilPage'),
    ApiService = require('../../../utils/ApiService');
const appPage = {
    data: {
        text: "Page home",
        isFixed: false,
        noMore: false,
        itemList: [],
        page: 1,
        scrollTop: 0,
        pullDownRefreshStatus: 0,
        touchStartY: 0,
        touchEndY: 0,
        touchMoveY: 0,
        isTopFixed: null
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
            let p = that.data.page;
            that.getShopSite(p)
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
        this.setData({
            pullDownRefreshStatus: 2
        });
        wx.vibrateShort({});
        that.getShopSite(1, true).finally(res => {
            that.stopPullDownRefresh()
        });
    },
    /**
     * 上拉触底
     */
    onReachBottom () {
        let that = this,
            page = that.data.page;
        that.getShopSite(page++)
    },
    /**
     * 页面滚动
     * @param scrollTop //页面在垂直方向已滚动的距离（单位px）
     */
    onPageScroll (options) {
        let scrollTop = this.data.scrollTop;
        // if (options.scrollTop <= 50 && this.data.isTopFixed && scrollTop - options.scrollTop >= 0) {
        //     this.setData({isTopFixed: false})
        // } else if (options.scrollTop > 0 && !this.data.isTopFixed) {
        //     this.setData({isTopFixed: true})
        // }
        if (options.scrollTop > 10) {
            this.setData({isTopFixed: true})
        } else {
            this.setData({isTopFixed: false})
        }
        this.data.scrollTop = options.scrollTop;
    }
};
/**
 * 方法类
 */
const methods = {
    handletouchtart (e) {
        let scrollTop = this.data.scrollTop;
        let pageY = e.changedTouches[0].pageY;
        this.data.touchStartY = pageY;
        if (e.changedTouches && scrollTop <= 0) {
            // console.log(e.changedTouches[0].pageY, 'handletouchtart');
        }
    },
    handletouchmove (e) {
        let scrollTop = this.data.scrollTop;
        let pageY = e.changedTouches[0].pageY;
        let pullDownRefreshStatus = this.data.pullDownRefreshStatus;
        this.data.touchMoveY = pageY;
        if (e.changedTouches && scrollTop <= 0) {
            let y = pageY - this.data.touchStartY,
                setData = {};
            if (y > 50) {
                this.setData({
                    pullDownRefreshStatus: 1
                })
            } else {
                this.setData({
                    pullDownRefreshStatus: 0
                })
            }
            // console.log(y, e.changedTouches[0].pageY, 'handletouchmove');
        }
    },
    handletouchend (e) {
        let scrollTop = this.data.scrollTop;
        let pageY = e.changedTouches[0].pageY;
        let pullDownRefreshStatus = this.data.pullDownRefreshStatus;
        this.data.touchEndY = pageY;
        if (e.changedTouches && scrollTop <= 0 && pullDownRefreshStatus === 1) {
            // console.log(e.changedTouches[0].pageY, 'handletouchend');
        }
    },

    async loadCb () {
        let that = this,
            time,
            options = that.data.options;
        await that.getShopSite();
        if (options.q) {
            await that.__scanVerifyCode(options.q)
        }
    },
    loadData () {

    },
    showCheckValidPage () {
        this.$route.push('/page/home/pages/verifyCode/index')
    },
    getShopSite (page = 1, bol) {
        let that = this, setData = {};
        if (that.data.isGetShopSite) return;
        that.data.isGetShopSite = true;
        if (!bol) {
            util.showLoading();
        }
        if (page === 1) {
            that.setData({noMore: false, scrollTop: 0});
        } else {
            that.setData({noMore: false});
        }
        return ApiService.getShopSite({p: page}).finally(res => {
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
    showSearchWin (e) {
        util.router.push({path: '/page/home/pages/search/index', query: {order_type: 0}})
    }
};
Page(new utilPage(appPage, methods));