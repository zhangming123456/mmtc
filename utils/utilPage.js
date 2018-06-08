/**
 * Created by Aaronzm on 2018/5/10.
 */
"use strict";
const app = getApp(),
    authorize = require('../utils/azm/authorize'),
    c = require('../utils/common'),
    ApiService = require('../utils/azm/ApiService');

let wxc_toastHideToast = function () {

}

const events = {

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad (options) {
        let that = this;
        try {
            if (options) {
                Object.assign(that.data.options, options);
                console.warn(`初始化${that.data.text}`, options);
            } else {
                throw {message: '初始化options为空'};
            }
        } catch (e) {
            console.warn(e, options);
        }
        that.__page.onLoad && that.__page.onLoad.call(this, options);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow (options) {
        let that = this;
        console.warn(`进入${this.data.text}`, options, 'onShow');
        this.__page.onShow && that.__page.onShow.call(this, options);
        if (that.data.isShow) {
            that.azmLocation_onRefresh && that.azmLocation_onRefresh.call(this, options, 'onShow');
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide (options) {
        console.warn(`离开${this.data.text}`, options, 'onHide');
        let that = this;
        this.__page.onHide && that.__page.onHide.call(this, options);
        that.setData({
            isShow: true
        });
        if (that.data.isShow) {

        }
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload (options) {
        console.log(`离开${this.data.text}`, options, 'onUnload');
        let that = this;
        that.setData({
            isShow: true
        });
        this.__page.onUnload && that.__page.onUnload.call(this, options);
    },

    /**
     * 页面渲染完成
     */
    onReady (options) {
        console.warn(`渲染完成${this.data.text}`, options, 'onReady');
        let that = this;
        that.setData({
            isShow: true
        });
        this.__page.onReady && that.__page.onReady.call(this, options);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh (options) {
        console.warn(`下拉触发事件${this.data.text}`, options, 'onPullDownRefresh');
        let that = this;
        this.__page.onPullDownRefresh && this.__page.onPullDownRefresh.call(this, options);
        that.azmLocation_onRefresh && that.azmLocation_onRefresh.call(this, options, 'onPullDownRefresh');
        that.data.isPullDownRefresh = true;
    },

    stopPullDownRefresh(options){
        console.warn(`下拉触发事件${this.data.text}结束`, options, 'onPullDownRefresh');
        let that = this;
        that.data.isPullDownRefresh = false;
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom (options) {
        console.warn(`上拉触底事件${this.data.text}`, options, 'onReachBottom');
        let that = this;
        this.__page.onReachBottom && this.__page.onReachBottom.call(this, options);
        this.azmGoTop_onReachBottom && this.azmGoTop_onReachBottom.call(this, options);
    },

    /**
     * 屏幕滚动事件
     * @param options
     */
    onPageScroll (options) {
        // console.warn(`屏幕滚动事件${this.data.text}`, options, 'onPageScroll');
        let that = this;
        this.__page.onPageScroll && this.__page.onPageScroll.call(this, options);
        this.azmGoTop_onPageScroll && this.azmGoTop_onPageScroll.call(this, options);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage (options) {
        console.warn(`用户点击右上角分享${this.data.text}`, options, 'onShareAppMessage');
        let that = this;
        this.__page.onShareAppMessage && this.__page.onShareAppMessage.call(this, options);
    },

    __login (bol) {
        return new Promise((resolve, reject) => {
            function login () {
                wx.login({
                    success(res){
                        resolve(res)
                    },
                    fail(){
                        reject()
                    }
                })
            }

            if (bol) {
                login();
            } else {
                wx.checkSession({
                    success: function () {
                        //session_key 未过期，并且在本生命周期一直有效
                        resolve();
                    },
                    fail: function () {
                        // session_key 已经失效，需要重新执行登录流程
                        login()
                    }
                });
            }
        })
    },

    __getUserInfo ({lang = 'en', withCredentials = false, timeout = null} = {}) {
        let that = this;
        return new Promise((resolve, reject) => {
            let options = {
                lang,
                withCredentials,
                success (res) {
                    resolve(res)
                },
                fail(res){
                    reject(res)
                }
            };
            if (timeout) {
                options.timeout = timeout
            }
            authorize.userInfo(true)
                .then(
                    () => {
                        if (withCredentials) {
                            that.__login().then(
                                res => {
                                    wx.getUserInfo(options);
                                }
                            );
                        } else {
                            wx.getUserInfo(options);
                        }
                    },
                    () => {
                        reject();
                    }
                );
        });
    },
    // 保存formId
    saveFormIds(e) {
        let formId = e.detail.formId;
        console.log(formId);
        if (formId !== 'the formId is a mock one') {
            ApiService.saveFormIds({form_id: formId});
        }
    },
    azmRoute (e) {
        let dataset = e.currentTarget.dataset,
            path = dataset.path,
            type = dataset.type || '';
        app.util.go(path, {type});
    },
    bindPageToast(e){
        let dataset = e.currentTarget.dataset,
            message = dataset.message;
        c.alert(message)
    },
    azmShowToast(options){
        let str = null,
            $azmToast = this.data.$azmToast;
        try {
            if (app.util.common.isString(options)) {
                $azmToast.text = options;
            } else {
                $azmToast = {
                    text: options.text,
                    icon: options.icon,
                    src: options.src,
                    icon_color: options.icon_color,
                    duration: options.duration,
                    success: 'bindWxcToastSuccess'
                };
            }
            wxc_toastHideToast = function () {
                options.success && options.success();
            };
            this.setData($azmToast);
            this.selectComponent("#azm_wxc_toast").show($azmToast.text);
        } catch (e) {
            console.log("调用azmShowToast失败", e);
        }
    },
    bindWxcToastSuccess(){
        wxc_toastHideToast && wxc_toastHideToast();
    }
};

class Page {
    constructor (appPage = {}, methods = {}) {
        /**
         * 页面的初始数据
         */
        this.data = Object.assign({
            text: `Page`,
            isShow: false,
            isPullDownRefresh: false,
            options: {},
            imageUrl: '',
            $azmToast: {
                show: false,
                text: '',
                icon: '',
                src: '',//
                icon_color: '#fff',
                duration: 2000,
                success: 'bindAzmToastSuccess'
            }
        }, appPage.data);
        this.__page = appPage;
        for (let k in events) {
            this[k] = events[k]
        }
        for (let k in methods) {
            this[k] = methods[k]
        }
    }
}

module.exports = Page;