const app = getApp(),
    util = app.util, regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');
const appPage = {
    data: {
        text: "Page orderInfo",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        order_id: '',
        orderInfo: null
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
    onReachBottom () {
        let that = this,
            page = that.data.page;
        that.getData(page)
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
            setData = {order_id: options.order_id};
        that.verificationOrderInfo(setData)
    },
    loadData () {

    },
    verificationOrderInfo (setData = {}) {
        let that = this,
            id = setData.order_id || that.data.order_id;
        if (!id || that.data.isVerificationOrderInfo) return;
        that.data.isVerificationOrderInfo = true;
        util.showLoading();
        ApiService.verificationOrderInfo({id}).finally(res => {
            that.data.isVerificationOrderInfo = false;
            util.hideLoading(true);
            if (res.status === 1) {
                setData.orderInfo = res.info
            } else {
                that.$Toast({content: res.message})
            }
            that.setData(setData)
        })
    },
    checkValid () {
        let that = this,
            orderInfo = this.data.orderInfo;
        if (orderInfo && orderInfo.id) {
            util.showLoading();
            ApiService.verification({id: orderInfo.id}).finally(res => {
                if (res.status === 1) {
                    if (!!res.info.verify) {
                        that.$route.replace({
                            path: '/page/common/pages/verifySucceed/index',
                            query: {order_no: orderInfo.order_no}
                        })
                    } else {
                        that.$route.replace({
                            path: '/page/home/pages/verifyHas/index',
                            query: {order_id: orderInfo.id}
                        })
                    }
                } else {
                    that.$Toast({content: res.message});
                    that.$route.replace({
                        path: '/page/common/pages/verifyFail/index',
                        query: {order_id: orderInfo.id}
                    })
                }
            });
            // this.$get('/shopapi/verification/verification', {id: this.order.id}, (info) => {
            //     this.$goto('checksuc?order_no=' + this.order.order_no)
            // }, () => {
            //     this.hideLoading()
            // }, (info) => {
            //     if (info == '订单已验证') {
            //         this.$goto('haschecked?order_id=' + this.order.id)
            //     } else {
            //         this.$alert(info)
            //     }
            // })
        }
    }
};
Page(new utilPage(appPage, methods));