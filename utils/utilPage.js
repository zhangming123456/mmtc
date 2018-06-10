/**
 * Created by Aaronzm on 2018/5/10.
 */
"use strict";
const app = getApp(),
    util = app.util,
    authorize = require('../utils/azm/authorize'),
    config = require('../utils/config'),
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
                for (let k in that.data.options) {
                    that.data.options[k] = decodeURIComponent(that.data.options[k]);
                }
                console.warn(`初始化${that.data.text}`, options);
            } else {
                throw {message: '初始化options为空'};
            }
        } catch (e) {
            console.warn(e, options);
        }
        that.__page.onLoad && that.__page.onLoad.call(this, options);
        let _this2 = app.util.getCurrentPage(2);
        if (_this2) {
            _this2.setData({
                isShow: true
            })
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow (options) {
        let that = this;
        console.warn(`进入${this.data.text}`, options, 'onShow');
        this.__page.onShow && that.__page.onShow.call(this, options);
        if (that.data.isShow) {
            that.setData({
                isShow: false
            });
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
        if (that.data.isShow) {

        }
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload (options) {
        console.log(`卸载${this.data.text}`, options, 'onUnload');
        let that = this;
        this.__page.onUnload && that.__page.onUnload.call(this, options);
    },

    /**
     * 页面渲染完成
     */
    onReady (options) {
        console.warn(`渲染完成${this.data.text}`, options, 'onReady');
        let that = this;
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

    stopPullDownRefresh (options) {
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
        if (this.__page.onShareAppMessage) {
            return this.__page.onShareAppMessage.call(this, options)
        } else {

        }
    },

    __login (bol) {
        return new Promise((resolve, reject) => {
            function login () {
                wx.login({
                    success (res) {
                        resolve(res)
                    },
                    fail () {
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
                fail (res) {
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
    __imageError () {

    },
    // 保存formId
    saveFormIds (e) {
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
    bindPageToast (e) {
        let dataset = e.currentTarget.dataset,
            message = dataset.message;
        c.alert(message)
    },
    /**
     *  toast方法
     * @param text 提示文字
     * @param icon 提示图标（minuiicon）
     * @param src 提示图片
     * @param icon_color 提示icon颜色
     * @param duration 提示时间
     */
    azmShowToast ({text = '', icon = null, src = null, icon_color = null, duration = 1500} = {}) {
        let that = this,
            str = null,
            options = arguments[0],
            callBack = arguments[1],
            $azmToast = this.data.$azmToast;
        wxc_toastHideToast = new Function();
        try {
            if (app.util.common.isString(options)) {
                $azmToast.text = options;
                if (callBack && app.util.common.isFunction(callBack)) {
                    wxc_toastHideToast = function () {
                        callBack.call(that);
                    };
                }
            } else {
                $azmToast = {
                    text: options.text,
                    icon: options.icon,
                    src: options.src,
                    icon_color: options.icon_color,
                    duration: options.duration
                };
                wxc_toastHideToast = function () {
                    options.success && options.success.call(that);
                };
            }
            this.setData({$azmToast});
            this.selectComponent("#azm_wxc_toast").show($azmToast.text);
        } catch (e) {
            console.log("调用azmShowToast失败", e);
        }
    },
    bindWxcToastSuccess () {
        console.log('toast结束');
        wxc_toastHideToast && wxc_toastHideToast();
    },
    getEleScrollOffset (el) {
        if (!el) return;
        let node = null;
        let p = new Promise((resolve, reject) => {
            wx.createSelectorQuery().select(el).boundingClientRect(function (res) {
                node = res;
                resolve(res);
            }).exec();
        });
        p.catch(res => {

        });
        return p;
    },

    bindSetClipboardData (e) {
        let dataset = e.currentTarget.dataset || e.target.dataset;
        wx.setClipboardData({
            data: dataset.value,
            success: function (res) {
                util.showToast('复制成功');
            },
            fail () {
                util.failToast('复制失败');
            }
        })
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
            imageUrl: config.imageUrl,
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