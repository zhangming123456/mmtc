// pages/onlineBuy/index.js
const app = getApp(),
    c = require("../../utils/common.js");
let discount_type, reduce_discount, toPayMoney = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        position_name: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        c.showLoading();
        var that = this;
        this.shop_id = options.shop_id;
        c.get('/api/shop/getShopBuyInfo', {shop_id: this.shop_id}, function (res) {
            c.hideLoading();
            if (res.status == 1) {
                var info = res.info;
                if (info) {
                    discount_type = info.discount_type;
                    if (info.discount_type == 1) {
                        reduce_discount = ((10 * 100 - Math.ceil(info.discount * 100)) / 100 / 10).toFixed(2);
                        str = info.discount + ' 折';
                    } else {
                        var v = info.discount.split(':');
                        reduce_discount = {
                            count_money: Math.ceil(v[0]) || 0,
                            reduce_money: Math.ceil(v[1]) || 0,
                            max_reduce: Math.ceil(v[2]) || 0,
                            repeated: Math.ceil(v[3]) || 0
                        };
                        var str = (reduce_discount.repeated ? '每' : '') + '满' + reduce_discount.count_money + '减' + reduce_discount.reduce_money + (reduce_discount.max_reduce > 0 ? ',最多减' + reduce_discount.max_reduce : '');
                    }
                    that.setData({
                        position_name: that.data.position_name = info.position_name,
                        discount: str
                    });
                }
            }
        });
    },
    checkDiscount: function (e) {
        this.setData({
            hasDiscount: this.data.hasDiscount = !this.data.hasDiscount
        });
        this.calMoney();
    },
    totalMoneyInput: function (e) {
        this.data.totalMoney = app.util.moneyFloor(e.detail.value) || 0
        this.calMoney();
        return this.data.totalMoney
    },
    calMoney: function () {
        let discountFlag = this.data.hasDiscount,
            totalMoney = parseFloat(this.data.totalMoney) || 0,
            noDiscountMoney = parseFloat(this.data.noDiscountMoney) || 0;
        if (!discountFlag) {
            noDiscountMoney = 0;
        }
        if (noDiscountMoney > totalMoney) {
            noDiscountMoney = totalMoney;
        }
        var discountSum = 0;
        if (discount_type == 1) {
            discountSum = ((totalMoney * 100 - noDiscountMoney * 100) / 100 * reduce_discount).toFixed(2);
        } else {
            var calMoney = totalMoney - noDiscountMoney;
            if (calMoney >= reduce_discount.count_money && reduce_discount.count_money > 0) {
                var reduce = reduce_discount.reduce_money;
                if (reduce_discount.repeated) {
                    reduce = Math.floor(calMoney / reduce_discount.count_money) * reduce;
                }
                if (reduce_discount.max_reduce > 0 && reduce > reduce_discount.max_reduce) {
                    reduce = reduce_discount.max_reduce;
                }
                discountSum = reduce.toFixed(2);
            }
        }
        let money = totalMoney - discountSum;
        if (money <= 0.01 && totalMoney > 0) {
            money = 0.01
        }
        if (discountSum != 0 && money != 0) {
            this.discountSum = '-￥' + discountSum;
        } else {
            this.discountSum = 0;
        }
        money = money.toFixed(2);
        if (money > 0) {
            this.actMoney = money;
            this.actMoneyUnit = ' 元';
        } else {
            this.actMoney = '';
            this.actMoneyUnit = '';
        }
        if (money > 0) {
            this.submitBtnEnabled = true;
        } else {
            this.submitBtnEnabled = false;
        }
        toPayMoney = money;
        this.setData({
            toPayMoney: this.toPayMoney,
            actMoney: this.actMoney,
            discountSum: this.discountSum,
            submitBtnEnabled: this.submitBtnEnabled,
            actMoneyUnit: this.actMoneyUnit
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

    },
    noDiscountMoneyInput: function (e) {
        var v = app.util.moneyFloor(e.detail.value);
        if (v) {
            v = parseFloat(v);
            this.data.noDiscountMoney = v;
        } else {
            this.data.noDiscountMoney = 0;
        }
        this.calMoney();
        return v
    },
    submitOrder: function (e) {
        if (this.submitBtnEnabled) { // can
            let noDiscountMoney = this.data.noDiscountMoney;
            if (!this.data.hasDiscount) {
                noDiscountMoney = 0;
            }
            c.showLoading();
            c.post('/api/order/makeOrder2', {
                shop_id: this.shop_id,
                totalMoney: this.data.actMoney,
                noDiscountMoney: noDiscountMoney
            }, function (res) {
                c.hideLoading();
                if (res.status == 1) {
                    let money = toPayMoney,
                        order_no = res.info;
                    wx.navigateTo({
                        url: 'step2?money=' + res.info.money + '&order_no=' + res.info.order_no,
                    })
                } else {
                    c.alert(res.info);
                }
            });
        }
    }
})