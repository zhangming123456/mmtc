const app = getApp(),
    util = app.util,regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../utils/config'),
    utilPage = require('../../utils/utilPage'),
    ApiService = require('../../utils/ApiService');
var interval = null //倒计时函数
const appPage = {
    data: {
        text: "Page login",
        isFixed: false,
        loadingMore: true,
        focus: 0,
        username: "",
        password: "",
        isShowPassword: false,
        isSubmit: false
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
            options = that.data.options,
            isShow = that.data.isShow,
            id = options.id;
    },
    loadData() {

    },
    setField(e){
        let key = e.target.dataset.key, value = e.detail.value;
        if (key) {
            this.setData({[key]: value})
        }
    },
    getVerificationCode() {
        let that = this;
        let telephone = that.data.telephone;
        if (!util.regExpUtil.isPhone(telephone)) {
            console.log(util.regExpUtil.isPhone(telephone));
            that.$Toast({content: '手机号码格式不正确'});
            return;
        }
        if (that.data.isGetCode || (that.data.azm_clockCode && that.data.azm_clockCode.time > 0))return;
        that.data.isGetCode = true;
        ApiService.getRegisterSendSMS({telephone}).finally(res => {
            that.data.isGetCode = false;
            if (res.status === 1) {
                util.showToast('验证码已发送');
                that.data.clockCodeCountdown = new util.Countdown(that, {
                    time: 60 * 1000, type: 'ss', text: 'clockCode',
                    onEnd() {

                    }
                });
            } else {
                that.$Toast({content: res.message || '验证码获取失败'});
            }
        });
    },

    //登陆
    getLogin() {
        let that = this,
            username = that.data.username,
            password = that.data.password;
        if (!util.trim(username)) {
            that.$Toast({content: '请输入商户帐号'});
            return;
        }
        if (!util.trim(password)) {
            that.$Toast({content: '请输入商户密码'});
            return;
        }
        if (password.length < 6 || password.length > 16) {
            that.$Toast({content: '请输入6~16位的商户密码'});
            return;
        }
        if (that.data.isGetLogin)return;
        that.data.isGetLogin = true;
        util.showLoading();
        ApiService.shopLoing({username, password}).finally(res => {
            that.data.isGetLogin = false;
            util.hideLoading(true);
            if (res.status === 1) {
                app.globalData.userInfo = res.info;
                that.$route.tab('/page/tabBar/home/index')
            } else {
                that.$Toast({content: res.message});
            }
        });
    },


    LookPassword(){
        this.setData({isShowPassword: !this.data.isShowPassword, focus: 1})
    }
};
Page(new utilPage(appPage, methods));