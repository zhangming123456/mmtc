// pages/home/index.js
const c = require("../../utils/common.js");
var page = 1;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        shop: {},
        discount: '',
        discountAreaWidth: 0,
        items: [],
        coupons: []
    },
    showLocation: function (e) {
        if (this.data.shop) {
            let data = {
                latitude: parseFloat(this.data.shop.lat_new),
                longitude: parseFloat(this.data.shop.lon_new),
                name: this.data.shop.shop_name,
                address: this.data.shop.address,
                scale: 28
            };
            console.log(data);
            wx.openLocation(data);
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options, callback) {
        if (options) {
            if (options.scene) {
                var scene = decodeURIComponent(options.scene)
                if (scene) {
                    let kv = scene.split(':');
                    if (kv[0] == 'shop_id') {
                        options.shop_id = kv[1];
                    }
                }
            }
            this.shop_id = options.shop_id;
        }
        c.showLoading();
        var that = this;
        page = 1;
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                var lat = res.latitude
                var lon = res.longitude
                c.get("/api/wx2/index", {shop_id: that.shop_id, lat: lat, lon: lon}, function (res) {
                    c.hideLoading();
                    if (res.status == 1) {
                        var info = res.info;
                        info.shop.id = that.shop_id;
                        that.data.shop = info.shop;
                        wx.setNavigationBarTitle({
                            title: info.shop.shop_name
                        });
                        var reduce_discount, str;
                        if (info.shop.discount_type == 1) {
                            str = [
                                {
                                    name: 'div',
                                    attrs: {
                                        class: 'ib'
                                    },
                                    children: [{
                                        name: 'span',
                                        attrs: {
                                            class: 'discount0'
                                        },
                                        children: [
                                            {
                                                type: 'text',
                                                text: info.shop.discount
                                            }
                                        ]
                                    }, {
                                        type: 'text',
                                        text: '折'
                                    }]
                                }
                            ];
                        } else {
                            var v = info.shop.discount.split(':');
                            reduce_discount = {
                                count_money: parseInt(v[0]) || 0,
                                reduce_money: parseInt(v[1]) || 0,
                                max_reduce: parseInt(v[2]) || 0,
                                repeated: parseInt(v[3]) || 0
                            };
                            str = '<span class="color-red">' + (reduce_discount.repeated ? '每' : '') + '满' + reduce_discount.count_money + '减' + reduce_discount.reduce_money + ' </span>';
                        }
                        that.data.discount = str;
                        that.data.items = info.items;
                        var noMore = false;
                        if (info.items.length < c.getPageSize()) {
                            noMore = true;
                            that.noMore = true;
                        }
                        that.data.coupons = info.coupons;
                        that.data.discountAreaWidth = 350 * (that.data.coupons.length
                            + 1) + 60;
                        callback && callback();
                        that.setData({
                            discount: str,
                            noMore: noMore,
                            shop: that.data.shop,
                            coupons: that.data.coupons,
                            discountAreaWidth: that.data.discountAreaWidth,
                            items: that.data.items
                        });
                    }
                });
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
        this.noMore = false;
        this.onLoad(null, function () {
            wx.stopPullDownRefresh();
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        // load more
        page++;
        var that = this;
        if (that.isLoading || that.noMore) {
            return;
        }
        that.isLoading = true;
        that.setData({
            loadingMore: true
        });
        c.get("/api/wx2/index", {p: page, shop_id: this.shop_id}, function (res) {
            that.isLoading = false;
            if (res.status == 1) {
                var setData = {};
                if (res.info.items.length < c.getPageSize()) {
                    setData.noMore = true;
                    that.noMore = true;
                }
                that.data.items = that.data.items.concat(res.info.items);
                setData.items = that.data.items;
                that.setData(setData);
            }
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    showCouponDetail: function (e) {
        var id = e.currentTarget.dataset.id;
        if (id) {
            wx.navigateTo({
                url: '/pages/conpons/index?id=' + id,
            });
        }
    },
    showShopDetail: function () {
        wx.navigateTo({
            url: 'detail?shop_id=' + this.shop_id
        });
    },
    gotoBuy: function () {
        wx.navigateTo({
            url: '/pages/onlineBuy/index?shop_id=' + this.shop_id,
        })
    }
});