// pages/login/index.js
const app = getApp(),
    utilPage = require('../../utils/utilPage'),
    c = require("../../utils/common.js");

const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page loginIndex',
        isLogin: true,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userInfo: {}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        let that = this;
        that.loadCb();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow (options) {
        if (this.data.isShow) {
            this.loadCb()
        }
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide () {

    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload () {

    },
    /**
     * 页面渲染完成
     */
    onReady () {

    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh () {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom (options) {

    },
    onPageScroll(options){

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(options) {

    }
};

const methods = {
    loadCb () {
        let options = this.data.options,
            that = this;
        if (options.scene) {
            let scene = decodeURIComponent(options.scene)
            if (scene) {
                let kv = scene.split(':');
                if (kv[0] == 'invite_id') {
                    this.invite_id = kv[1];
                }
            }
        }
        if (!c.hasLoginWx()) {
            this.__login(true).then(
                res => {
                    if (res.code) {
                        c.get('/api/wx2/login', {code: res.code}, function () {
                            c.setHasLoginWx()
                        });
                    }
                }
            )
        }
    },
    showPhoneWin () {
        wx.navigateTo({
            url: 'phone?invite_id=' + (this.invite_id || 0),
        })
    },
    getPhoneNumber (e) {
        let that = this;
        if (e.detail.errMsg !== "getPhoneNumber:fail user deny") {
            this.__getUserInfo().then(
                res => {
                    if (res.userInfo) {
                        that.data.userInfo = res.userInfo;
                        that.doGetPhone(e);
                    }
                },
                rsp => {
                    that.data.userInfo = {};
                }
            );
        }
    },
    doGetPhone(e){
        let that = this;
        if (e.detail.encryptedData) {
            c.showLoading();
            c.post('/api/wx2/loginByPhone', {
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv,
                    invite_id: this.invite_id || 0
                }, function (res) {
                    c.hideLoading();
                    if (res.status == 1) {
                        that.setUserInfo(e)
                    } else if (res.status == 202) {
                        c.logoff()
                        wx.login({
                            success: res => {
                                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                                if (res.code) {
                                    c.get('/api/wx2/login', {code: res.code}, function () {
                                        that.getPhoneNumber(e);
                                    });
                                }
                            }
                        });
                    } else {
                        c.alert(res.info);
                    }
                }
            )
        }
    },
    setUserInfo(rt){
        let that = this,
            userInfo = that.data.userInfo;
        c.post('/api/wx2/updateUserInfo', userInfo);
        c.setUserInfo(userInfo);
        c.refreshPrevPage();
        app.util.go(-1)
    },
    userLogin(){
        app.util.go('/pages/login/getUserInfo/index')
    }
}

Page(new utilPage(appPage, methods))