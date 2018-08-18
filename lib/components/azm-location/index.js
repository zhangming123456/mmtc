const app = getApp(),
    util = app.util,regeneratorRuntime = util.regeneratorRuntime,
    authorize = require("../../../utils/authorize");
import { Amap, Qmap } from '../../../utils/map/index'
Component({
    externalClasses: ['azm-location'],

    data: {
        name: 'addressLocation',
        location: {
            lat: 0,
            lon: 0
        },
        options: {},
        styleStr: '',
        isCreated: false,
        currentPage: null
    },
    properties: {
        options: {
            type: Object,
            value: {},
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        position: {
            type: String,
            value: '',
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        styleData: {
            type: Object,
            value: {},
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        class: {
            type: String,
            value: '',
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        storageKey: {
            type: String,
            value: 'lat_and_lon',
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        storageName: {
            type: String,
            value: 'addr',
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        address: {
            type: String,
            value: '加载中...',
            observer (newVal, oldVal) {//属性值被更改时的响应函数
                if (newVal !== '加载中...') {
                    wx.hideNavigationBarLoading()
                }
            }
        },
        isShow: {
            type: Boolean,
            value: false,
            observer (newVal, oldVal) {//属性值被更改时的响应函数
                if (this.data.isCreated && newVal && newVal !== oldVal) {
                    this.setData({
                        address: '加载中...'
                    });
                    this._bindAzmGetLocation();
                }
            }
        },
        isTap: {
            type: Boolean,
            value: true,
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        }
    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
     */
    created(){
        console.log('组件生命周期函数created', util.getCurrentPages());
        wx.showNavigationBarLoading();
    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行
     */
    attached(){
        let that = this;
        let currentPage = util.getCurrentPages();
        this.data.currentPage = currentPage[currentPage.length - 1];
        this.data.currentPage.azmLocation_onShow = function () {
            that.setData({
                address: '加载中...'
            });
            that._bindAzmGetLocation();
        };
        console.log('组件生命周期函数attached', util.getCurrentPages());
    },
    /**
     * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
     */
    ready(){
        let that = this;
        this._bindAzmGetLocation();
        this.data.isCreated = true;
        console.log('组件生命周期函数ready');
    },
    /**
     * 组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
     */
    moved(){
        console.log('组件生命周期函数moved');
    },
    /**
     * 组件生命周期函数，在组件实例被从页面节点树移除时执行
     */
    detached(){
        console.log('组件生命周期函数detached');
    },
    methods: {
        onTap(e){
            if (!this.data.isTap)return;
            let myEventDetail = {
                    dataset: Object.assign(e.detail, this.data)
                }, // detail对象，提供给事件监听函数
                myEventOption = {
                    bubbles: true,
                    composed: true
                }; // 触发事件的选项
            if (this.data.address === '加载中...') {
                this._bindAzmGetLocation(true)
            } else {
                wx.navigateTo({
                    url: '/pages/loc/index',
                });
            }
            this.triggerEvent('azmtap', myEventDetail, myEventOption)
        },
        _bindAzmGetLocation(flag) {
            let that = this,
                storageKey = that.data.storageKey,
                storageName = that.data.storageName,
                location = wx.getStorageSync(storageKey),
                addr = wx.getStorageSync(storageName),
                isLocation = app.globalData.isLocation;// detail对象，提供给事件监听函数
            wx.getLocation({
                type: 'wgs84',
                success(res) {
                    if (!isLocation || !location.lat || !location.lon || !addr) {
                        app.globalData.isLocation = false;
                        location = {
                            lat: res.latitude,
                            lon: res.longitude
                        };
                    }
                    wx.setStorageSync(storageKey, location);
                    that._getLocation(res, location);
                },
                fail(res) {
                    authorize.userLocation(true)
                        .then(
                            () => {
                                that._bindAzmGetLocation()
                            },
                            () => {
                                that._getLocation(res, location);
                            }
                        );
                }
            })
        },
        _getLocation(res, location, myEventOption = {bubbles: true, composed: true}){
            let that = this,
                oldLocation = that.data.location,
                storageKey = that.data.storageKey,
                storageName = that.data.storageName,
                addr = wx.getStorageSync(storageName),
                myEventDetail = {
                    dataset: location,
                    res,
                    isUpdate: true
                },
                isLocation = app.globalData.isLocation;
            this.data.currentPage.data.azmLocationData = location;
            if (oldLocation.lat === location.lat && oldLocation.lon === location.lon) {
                myEventDetail.isUpdate = false
            }
            that.data.location = location;
            if (!isLocation || !location.lat || !location.lon || !addr) {
                app.globalData.isLocation = false;
                Qmap.reverseGeocoder({
                    location: {
                        latitude: location.lat,
                        longitude: location.lon
                    },
                    success: function (res) {
                        let address_component = res.result.address_component
                        addr = address_component.street_number || address_component.street || address_component.district || address_component.city;
                        wx.setStorageSync(storageName, addr);
                        myEventDetail.dataset.address = addr;
                        app.globalData.isLocation = true;
                        that.triggerEvent('callback', myEventDetail, myEventOption);
                        that.setData({
                            address: addr
                        });
                    }
                });
            } else {
                myEventDetail.dataset.address = addr;
                that.triggerEvent('callback', myEventDetail, myEventOption);
                wx.setStorageSync(storageName, addr);
                that.setData({
                    address: addr
                });
            }
        }
    }
})
