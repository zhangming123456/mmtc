// pages/item/detail.js
const app = getApp(),
    utilPage = require('../../utils/utilPage'),
    ApiService = require('../../utils/azm/ApiService'),
    config = require('../../utils/config'),
    c = require("../../utils/common.js");
var WxParse = require('../../wxParse/wxParse.js');
let shop_id = 0;
var not_collected = '../../imgs/collect@2x.png';
var collected = '../../imgs/collected.png';
let loadFlag = [],
    item_id = 0,
    typePageMap,
    currentType = 0,
    isToBuyNow = false;
const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'Page itemDetail',
        isShow: false,
        options: {},
        imageUrl: config.imageUrl,
        isShowLocation: true,
        item: {},
        showGotoTop: false,
        type: 0,
        loadingMore: [],
        loaded: false,
        noMore: [],
        goodsHidden: true,
        goods: {},
        collectImage: '../../imgs/collect@2x.png',
        cases: [],
        recommends: [],
        id: null,
        countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        productCount: 1,
        currentTabsIndex: 0,
        currentTab: 0,
        technicianData: [],
        currentTabnoData: false,
        bannerData: {},
        couponData: {},
        colorData:[
            {
                type:0,
                color:'purple'
            },
            {
                type:1,
                color:'yellow'
            }
        ]

    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let that = this;
        that.loadCb();
        // var id = options.id;
        // this.data.id =id;
        // this._loadData();
    },
    // _loadData:function(){
    //     product.getDetailInfo(this.data.id,(data)=>{
    //         this.setData({
    //             product:data
    //         });
    //     });
    // },
    // // 选择器的数据绑定
    // bindPickerChange:function(event){
    //     // 所获取的用户选择的数组下标
    //     var index = event.datail.value;
    //     var selectedCount = this.data.countsArray[index];
    //     this.setData({
    //         productCount:selectedCount
    //     });
    // },
    // // 点击选项卡事件
    // onTabsItemTap:function(event){
    //     var index = product.getDataSet(event,'index');
    //     this.setData({
    //         currentTabsIndex:index
    //     });
    // },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow(options) {
        if (this.timeFlag) {
            return;
        }
        this.loadMsg();
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        if (this.timeFlag) {
            clearTimeout(this.timeFlag);
            this.timeFlag = null;
        }
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        if (this.timeFlag) {
            clearTimeout(this.timeFlag);
            this.timeFlag = null;
        }
    },
    /**
     * 页面渲染完成
     */
    onReady() {

    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom(options) {

    },
    onPageScroll(options) {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(options) {

    }
};


/**
 * 方法类
 */
const methods = {
    loadCb() {
        let that = this,
            options = that.data.options,
            id = options['id'] || 1;
        c.get('/api/mmg/putFootPlace', {
            id: id
        });
        loadFlag[1] = 0;
        item_id = id;
        loadFlag[0] = 1;
        currentType = 0;
        loadFlag[2] = 0;
        typePageMap = [];
        if (c.getStorage('love' + item_id)) {
            this.data.collectImage = collected;
            this.setData({
                collectImage: this.data.collectImage
            });
        }
        wx.getLocation({
            type: 'gcj02',
            success(res) {
                let lat = res.latitude;
                let lon = res.longitude;
                c.showLoading();
                that.getGroupGetTtemV3({
                    id: id,
                    lat: lat,
                    lon: lon
                });
            }
        });
        this.loadCases();


        // 日记banner
        ApiService.getBannerInfo({
            id
        }).then(
            res => {
                if (res.status) {
                    that.setData({
                        bannerData: res.info
                    })
                }
            }
        )
    },
    // 优惠券
    doPicker: function (e) {
        console.log(e);
        var that = this;
        try {
            let item = e.target.dataset.item
            c.showLoading();
            c.get('/api/coupon/doPicker', {
                id: item.id
            }, function (res) {
                c.hideLoading();
                if (res.status == 1) {
                    var info = res.info;
                    app.util.failToast({
                        title: '您已领取',
                        duration: 1000,
                        mask: true
                    })
                } else {
                    c.alert(res.info);
                }
            });
        } catch (e) {

        }
    },

    popupContent(){
        wx.showModal({  
            title: '提示',  
            content: 'item.service_char',  
            success: function(res) {  
                if (res.confirm) {  
                console.log('用户点击确定')  
                } else if (res.cancel) {  
                console.log('用户点击取消')  
                }  
            }  
        })  
    },
    // 技师
    getMmgShopIndex(id) {
        let that = this;
        ApiService.getMmgShopIndex({
            shop_id: id
        }).then(
            res => {
                if (res.status === 1 && res.info.length > 0) {
                    that.setData({
                        technicianData: res.info
                    })
                }
            },
            rsp => {

            }
        )
    },
    // 点击日记banner跳转H5页面
    showBannerLink(e) {
        let link = e.currentTarget.dataset.link;
        if (link) {
            try {
                if (link.indexOf('://') !== -1) { // if for http url
                    link = encodeURIComponent(link);
                    wx.navigateTo({
                        url: '/pages/page/index?token=' + link,
                    })
                } else {
                    wx.navigateTo({
                        url: link,
                    })
                }
            } catch (e) {

            }
        }
    },
    //滑动切换
    swiperTab: function (e) {
        var that = this;
        // that.setData({
        //     currentTab: e.detail.current
        // });
    },
    //点击切换
    clickTab: function (e) {

        var that = this,
            current = e.target.dataset.current;
        console.log(e);

        if (this.data.currentTab == current) {
            return;
        } else {
            that.setData({
                currentTab: current
            })
        }
    },
    // 跳转到更多点评
    gotoRemark() {
        wx.navigateTo({
            url: '/pages/item/moreremark'
        })
    },

    // 跳转到更多点评
    gotoTechnician() {
        wx.navigateTo({
            url: '/pages/technician/index?shop_id=' + this.data.item.shop_id
        })
    },

    getGroupGetTtemV3({
        id = 0,
        lat = 0,
        lon = 0
    } = {}) {
        let that = this;
        c.get('/api/group/getItemV3', {
            id: id,
            lat: lat,
            lon: lon
        }, function (ret) {
            if (ret.status == 1) {
                that.data.item = ret.info;
                if (that.data.item.group_num > 0) {
                    that.loadGroupRows();
                }
                that.data.goods = ret.info;
                that.data.goods.num = 1;
                that.data.shop = ret.info.shop;
                shop_id = ret.info.shop_id;
                that.loadRecommends(function () {
                    c.hideLoading();
                });
                WxParse.wxParse('intro', 'html', ret.info.intro, that);
                that.setData({
                    item: that.data.item,
                    loaded: true,
                    shop: that.data.shop,
                    goods: that.data.goods
                });
                ApiService.getCouponInfo({
                    shop_id: ret.info.shop_id
                }).then(
                    res => {
                        if (res.status) {
                            that.setData({
                                couponData: res.info
                            })
                        }
                    }
                )
                that.getMmgShopIndex(ret.info.shop_id);
            } else {
                c.hideLoading();
            }

        });
    },
    loadGroupRows() {
        let that = this;
        c.get('/api/group/getOtherGroups', {
            item_id: item_id
        }, function (ret) {
            if (ret.status == 1) {
                if (ret.info && ret.info.rows.length && ret.info.count) {
                    that.start_time = new Date().getTime();
                    that.countTime(ret.info);
                }
            }
        });
    },
    countTime(data) {
        data = data || this.data.groupData;
        let that = this;
        let passedSeconds = parseInt((new Date().getTime() - this.start_time) / 1000);
        data.rows.forEach(function (el) {
            let left_seconds = el.left_seconds - passedSeconds;
            if (left_seconds > 0) {
                el.left_time = c.leftseconds2timestr(left_seconds);
            } else {
                el.left_time = '';
            }
        });
        this.setData({
            groupData: data
        });
        setTimeout(this.countTime.bind(this), 1000);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    hideMsg() {
        if (this.data.msgitem) {
            this.setData({
                msgitem: null
            });
            this.timeFlag = setTimeout(this.loadMsg.bind(this), 3000);
        }
    },
    loadMsg() {
        let that = this;
        return;
        c.get('/api/msg/getGroupMsgg', {
            item_id: item_id
        }, function (ret) {
            if (ret.status == 1 && ret.info.time != that.prevTime) {
                that.prevTime = ret.info.time;
                that.setData({
                    msgitem: ret.info
                });
                that.timeFlag = setTimeout(that.hideMsg.bind(that), 10000);
            } else {
                that.timeFlag = setTimeout(that.loadMsg.bind(that), 3000);
            }
        });
    },
    loadCases() {
        let url = '/api/note/getNotesOfItem';
        let requestData = {
            item_id: item_id
        };
        let that = this;
        c.get(url, requestData, function (ret) {
            if (ret.status == 1) {
                that.setData({
                    cases: c.wrapZan(ret.info)
                });
            } else {
                c.alert(ret.info);
            }
        });
    },
    loadRecommends(callback) {
        let url = '/api/wx2/getItemsOfShop';
        let requestData = {
            shop_id: shop_id,
            p: this.p || 1,
            item_id: item_id
        };
        let that = this;
        c.get(url, requestData, function (ret) {
            let setData = {};
            callback && callback();
            if (ret.status == 1) {
                if (ret.info.lengh < c.getPageSize()) {
                    setData.noMore = true;
                }
                setData.recommends = ret.info;
                that.setData(setData);
            } else {
                c.alert(ret.info);
            }
        });
    },
    makeCall(evt) {
        if (this.data.shop) {
            var service_phone = this.data.shop.service_phone;
            if (service_phone) {
                wx.makePhoneCall({
                    phoneNumber: service_phone //仅为示例，并非真实的电话号码
                });
            }
        }
    },
    makeCollect(evt) {
        var that = this;
        c.hasLogin(function () {
            var key = 'love' + item_id;
            if (c.getStorage(key)) {
                that.data.collectImage = not_collected;
                c.removeStorage(key);
                c.toast('取消收藏成功');
                that.sendData(1);

            } else {
                that.data.collectImage = collected;
                c.setStorage(key, 1);
                c.toast('添加收藏成功');
                that.sendData(0);
            }
            that.setData({
                collectImage: that.data.collectImage
            });
        });
    },
    gotoShop() {
        //  wx.navigateBack({
        //    delta:9
        //  });
        wx.navigateTo({
            url: '/pages/car/index'
        });
    },
    gotoShopIndex() {
        if (shop_id) {
            wx.navigateTo({
                url: '/pages/home/index?shop_id=' + shop_id,
            })
        }
    },
    sendData(cancel) {
        c.get('/api/mmg/makeCollection', {
            item_id: item_id,
            cancel: cancel
        });
    },
    reduceNum(evt) {
        if (this.data.goods.num > 1) {
            this.data.goods.num--;
            this.setData({
                goods: this.data.goods
            });
        }
    },
    addNum(evt) {
        if (!this.data.goods.num) {
            this.data.goods.num = 0;
        }
        this.data.goods.num++;
        this.setData({
            goods: this.data.goods
        });
    },
    changeNum(evt) {
        var num = evt.detail.value;
        this.data.goods.num = parseInt(num);
    },
    addToCart() {
        isToBuyNow = false;
        var that = this;
        that.setData({
            goodsHidden: false
        });
    },
    doAddToCart(e) {
        var that = this;
        that.setData({
            goodsHidden: true
        });
        c.hasLogin(function () {
            if (!isToBuyNow) {
                c.post('/api/cart/addToCart', {
                    item_id: item_id,
                    num: that.data.goods.num
                }, function (res) {
                    if (res.status == 1) {
                        c.toast('加入购物车成功');
                        c.flushCarts();
                    }
                });
            } else {
                wx.navigateTo({
                    url: '/pages/car/payOrder?item_id=' + item_id + '&num=' + that.data.goods.num
                });
            }
        });
    },
    buyNow() {
        isToBuyNow = true;
        wx.navigateTo({
            url: '/pages/car/payOrder?item_id=' + item_id + '&num=1'
        });
        // var that = this;
        // that.data.goodsHidden = false;
        // that.setData({
        //   goodsHidden: false
        // });
    },
    buyNow2() {
        c.hasLogin(function () {
            wx.navigateTo({
                url: '/pages/car/payOrder?item_id=' + item_id + '&num=1'
            });
        });
    },
    goodsInnerTap(e) {

    },
    showMasker() {
        this.setData({
            IsshowMasker: true
        });
    },
    closeMasker() {
        this.setData({
            IsshowMasker: false
        });
    },
    showeDiscount() {
        this.setData({
            IsshowDiscount: true
        });
    },
    closeDiscount() {
        this.setData({
            IsshowDiscount: false
        });
    },
    closeGoodsMasker() {
        this.setData({
            goodsHidden: true
        });
    },
    zan(e) {
        var id = e.currentTarget.dataset.id;
        var that = this;
        c.zan(id, function () {
            that.data.cases.every(function (el) {
                if (el.id == id) {
                    el.zaned = true;
                    el.zan_count++;
                    that.setData({
                        cases: that.data.cases
                    });
                    return false;
                }
                return true;
            });
        });
    },
    showLocation(e) {
        if (this.data.shop) {
            var longitude = parseFloat(this.data.shop.lon);
            var latitude = parseFloat(this.data.shop.lat);
            wx.openLocation({
                latitude: latitude,
                longitude: longitude,
                name: this.data.shop.shop_name,
                address: this.data.shop.address,
                scale: 28
            });
        }
    },
    showGroupDetail() {
        wx.navigateTo({
            url: '/pages/item/groupdetail',
        })
    },
    groupBuy() {
        wx.navigateTo({
            url: '/pages/car/payOrder?item_id=' + item_id + '&num=1&group=1'
        });
    },
    joinThisGroup(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/car/payOrder?item_id=' + item_id + '&num=1&group=1&group_id=' + id
        });
    },
    onShareAppMessage() {
        if (this.data.item) {
            return {
                imageUrl: c.absUrl(this.data.item.cover, 750),
                title: this.data.item.price + '元 ' + this.data.item.title
            };
        }
    },
    closeBuyListMasker() {
        this.setData({
            isShowingByList: false
        });
    },
    showBuyListArea() {
        if (this.data.groupData.count > 3) {
            this.setData({
                isShowingByList: true
            });
        }
    },
    noop() {

    },
    gotoHomePage() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    onscroll(e) {
        if (e.detail.scrollTop > 300) {
            if (!this.data.showGotoTop) {
                this.setData({
                    showGotoTop: true
                });
            }

        } else {
            if (this.data.showGotoTop) {
                this.setData({
                    showGotoTop: false
                });
            }
        }
    },
    gotoTop() {
        this.setData({
            scrollTop: 0
        });
    },
    reportSubmit(e) {
        let formId = e.detail.formId;
        c.get('/api/store/saveFormIds', {
            form_id: formId
        });
    }
};

Page(new utilPage(appPage, methods));