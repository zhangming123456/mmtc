const app = getApp(),
    util = app.util, regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');
function get60s () {
    return new Date().getTime() + 59000;
}
const appPage = {
    data: {
        text: "Page landline",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        info: {},
        myFormat: ['秒'],
        targetTime: get60s(),
        clearTimer: true
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
    telephoneFormSubmit(e){
        let that = this,
            telephone = e.detail.value.telephone;
        if (that.data.isTelephoneFormSubmit)return;
        if (!util.regExpUtil.isPhone(telephone)) {
            that.$Message({content: "手机号码格式不正确~", type: 'error'})
            return;
        }
        that.data.isTelephoneFormSubmit = true;
        util.showLoading();
        ApiService.myGetCheckCode({telephone}).finally(res => {
            that.data.isTelephoneFormSubmit = false;
            util.hideLoading(true);
            if (res.status === 1) {
                that.setData({
                    targetTime: get60s(),
                    clearTimer: false
                });
                that.$Message({content: '短信发送成功', type: 'success'});
            } else {
                that.$Message({content: '短信发送失败', type: 'error'});
            }
        });
    },
    myLinsterner(){
        this.setData({clearTimer: true});
    },
    formSubmit(e){
        let that = this,
            telephone = e.detail.value.telephone,
            code = e.detail.value.code;
        if (that.data.isFormSubmit)return;
        if (!util.regExpUtil.isPhone(telephone)) {
            that.$Message({content: "手机号码格式不正确~", type: 'error'})
            return;
        }
        if (!code || !util.regExpUtil.isCode(code)) {
            that.$Message({content: "验证码格式不正确~", type: 'error'});
            return;
        }
        that.data.isFormSubmit = true;
        util.showLoading();
        ApiService.shopChangeServicePhone({telephone, code}).finally(res => {
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