const c = require("../../utils/common.js");
const map = require("../../utils/map.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showMasker: false,
        hasGotUserInfo: false
    },
    docash(e) {
        // this.showMasker()
        this.doGetPhone(e)
    },
    doGetPhone(e) {
        if (this.hasGotphone) {
            this.showMasker()
            return
        }
        var that = this;
        if (e.detail.encryptedData) {
            c.showLoading();
            if (c.hasLoginWx()) {
                loginByPhone()
            } else {
                wx.login({
                    success: res => {
                        // 发送 res.code 到后台换取 openId, sessionKey, unionId
                        if (res.code) {
                            c.get('/api/wx2/login', {code: res.code}, function () {
                                c.setHasLoginWx()
                                loginByPhone()
                            });
                        }
                    }
                });
            }

            function loginByPhone () {
                c.post('/api/wx2/loginByPhone', {
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv,
                    invite_id: that.invite_id || 0
                }, function (res) {
                    c.hideLoading();
                    if (res.status == 1) {
                        res.info.nickname = that.userInfo.nickName || res.info.telephone
                        res.info.avatar = that.userInfo.avatarUrl
                        c.post('/api/wx2/updateUserInfo', {
                            nickname: that.userInfo.nickName,
                            avatar: that.userInfo.avatarUrl,
                            gender: that.userInfo.gender,
                            province: that.userInfo.province,
                            city: that.userInfo.city,
                            country: that.userInfo.country
                        });
                        c.setUserInfo(res.info)
                        that.showMasker()
                        that.hasGotphone = 1
                        that.setData({
                            hasGotphone: 1
                        })
                    } else {
                        c.alert(res.info);
                    }
                });
            }
        }
    },
    noop() {

    },
    closeMasker() {
        this.setData({
            showMasker: false
        })
    },

    showMasker() {
        this.setData({
            showMasker: true
        })
    },
    loaderr() {
        this.setData({
            avatar: '/imgs/default.png'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        debugger
        if (options.scene) {
            var scene = decodeURIComponent(options.scene)
            if (scene) {
                let kv = scene.split(':');
                if (kv[0] == 'invite_id') {
                    this.invite_id = kv[1];
                }
            }
        } else if (options.invite_id) {
            this.invite_id = options.invite_id
        }
        c.showLoading()
        this.setData({
            bg2img: c.absUrl('/little/bg2.png'),
            tipimg: c.absUrl('/little/tipimgs.png')
        })
        c.getLocation(res => {
            let lat = res.latitude
            let lon = res.longitude
            map.reverseGeocoder({
                location: {
                    latitude: lat,
                    longitude: lon
                },
                success: (res) => {
                    if (res.result && res.result.address_component.city == '深圳市') {
                        this.is_from_sz = 1
                    }
                    this.loadUser()
                }
            });
        }, () => {
            this.is_from_sz = 0
            this.loadUser()
        })
        c.get('/api/activity/notice', (res) => {
            if (res.status == 1) {
                this.setData({
                    records: res.info
                })
            }
        })
    },
    getUserInfo() {
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.userInfo']) {
                    wx.openSetting({
                        success: (res) => {
                            if (res.authSetting['scope.userInfo']) {
                                this.loadUser()
                            }
                        }
                    });
                } else {
                    this.loadUser()
                }
            }
        })
    },
    loadUser() {
        wx.getUserInfo({
            fail() {
                // c.alert('无法获取您的用户信息')
                c.hideLoading()
            },
            success: (rt) => {
                this.setData({
                    hasGotUserInfo: true
                })
                let userInfo = rt.userInfo
                this.userInfo = userInfo
                c.post('/api/activity/register', {
                    is_from_sz: this.is_from_sz || 0
                }, (res) => {
                    c.hideLoading()
                    if (res.status == 1) {
                        this.setData({
                            avatar: userInfo.avatarUrl,
                            nickname: userInfo.nickName,
                            money: res.info
                        })
                        if (!c.hasLoginWx()) {
                            wx.login({
                                success: res => {
                                    if (res.code) {
                                        c.get('/api/wx2/login', {code: res.code}, function () {
                                            c.setHasLoginWx()
                                        });
                                    }
                                }
                            });
                        }
                    }
                })
            }
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})