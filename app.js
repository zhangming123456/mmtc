//app.js
const c = require("./utils/common.js"),
    config = require('./utils/config'),
    util = require('./utils/azm/util');
App({
    globalData: {
        userInfo: null,
        shop: {},
        pages: {},
        city: {},
        isLocation: false,
        lat_and_lon: {}
    },

    util,
    /**
     * 生命周期函数--监听小程序初始化
     * @param options
     */
    onLaunch: function (options) {
        console.warn('版本号：' + config.version);
        // 展示本地存储能力
        // var logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs)


        // wx.checkSession({
        //   success: function () {
        //     //session 未过期，并且在本生命周期一直有效
        //   },
        //   fail: function () {
        //     //登录态过期
        //     // wx.login() //重新登录
        //     wx.login({
        //       success: res => {
        //         // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //         if (res.code) {
        //           c.get('/api/wx2/login', { code: res.code });
        //         }
        //       }
        //     });
        //   }
        // });

        // 获取用户信息
        // wx.getSetting({
        //   success: res => {
        //     if (res.authSetting['scope.userInfo']) {
        //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //       wx.getUserInfo({
        //         success: res => {
        //           // 可以将 res 发送给后台解码出 unionId
        //           this.globalData.userInfo = res.userInfo

        //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //           // 所以此处加入 callback 以防止这种情况
        //           if (this.userInfoReadyCallback) {
        //             this.userInfoReadyCallback(res)
        //           }
        //         }
        //       })
        //     }
        //   }
        // })
    },
    /**
     * 生命周期函数--监听小程序显示
     * @param options
     */
    onShow: function (options) {
        console.log('当前页面显示：', util.getCurrentPages());

    },
    /**
     * 生命周期函数--监听小程序隐藏
     * @param options
     */
    onHide: function (options) {
        console.warn('监听小程序隐藏', options);
        if ('userInfo' === wx.getStorageSync('authorizeUserInfo')) {
            wx.setStorageSync('authorizeUserInfo', '');
        }
    },
    /**
     * 错误监听函数
     * @param msg
     */
    onError: function (msg) {
        // console.warn('错误监听函数', msg);
    },
    /**
     * 不存在页面监听
     * @param options
     */
    onPageNotFound (options) {
        console.warn('不存在页面监听', options);
    }
})