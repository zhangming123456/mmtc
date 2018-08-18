const app = getApp(),
    util = app.util, regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');
const appPage = {
    data: {
        text: "Page mime",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        info: {},
        cover: "",
        qrcode: "",
        img_src: "",
        isQRCodeShow: false,
        servicePhoneVisible: false,
        servicePhoneActions: [
            {
                name: '座机',
                icon: 'homepage_fill'
            },
            {
                name: '手机',
                icon: 'mobilephone_fill'
            }
        ]
    },
    onLoad: function (options) {
        let that = this;
        that.loadCb();
    },
    /**
     * 进入页面
     */
    onShow: function (options) {
        let that = this;
        if (that.data.isShow) {
            that.getShopManagerInfo(true);
        }
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
    onReachBottom () {
        let that = this;
    },
    /**
     * 页面滚动
     * @param scrollTop //页面在垂直方向已滚动的距离（单位px）
     */
    onPageScroll (options) {

    }
};
/**
 * 方法类
 */
const methods = {
    async  loadCb () {
        let that = this,
            options = that.data.options,
            isShow = that.data.isShow;
        that.getShopManagerInfo();
    },
    loadData () {

    },
    getShopManagerInfo(bol){
        let that = this;
        if (that.data.isGetShopManagerInfo)return;
        that.data.isGetShopManagerInfo = true;
        util.showLoading();
        ApiService.getShopManagerInfo({}).finally(res => {
            that.data.isGetShopManagerInfo = false;
            util.hideLoading(true);
            if (res.status === 1) {
                that.setData({info: res.info});
                if (bol) {
                    that.$Message({content: '刷新成功', type: 'success'});
                }
            } else {
                that.$Message({content: res.message, type: 'error'})
            }
        })
    },
    bindUpCover(){
        let that = this;
        if (that.data.isGetShopManagerInfo)return;
        that.data.isGetShopManagerInfo = true;
        this.ImageUpload(1, 'cover').finally(res => {
            let cover = that.data.cover;
            if (res.status === 1 && cover) {
                util.showLoading();
                ApiService.showSetCover({cover}).finally(res => {
                    that.data.isGetShopManagerInfo = false;
                    util.hideLoading(true);
                    if (res.status === 1) {
                        that.setData({
                            [`info.cover`]: cover
                        })
                    } else {
                        that.$Message({content: res.message, type: 'error'});
                    }
                })
            } else {
                that.data.isGetShopManagerInfo = false;
            }
        })
    },
    togglePopup(e){
        let that = this;
        if (!that.data.isQRCodeShow && !that.data.qrcode && !that.data.isTogglePopup) {
            that.data.isTogglePopup = true;
            util.showLoading();
            ApiService.showShopQRCode({}).finally(res => {
                that.data.isTogglePopup = false;
                util.hideLoading(true);
                if (res.status === 1) {
                    that.setData({qrcode: res.info.path})
                }
            })
        }
        that.setData({isQRCodeShow: !this.data.isQRCodeShow})
    },
    downQrcode(){
        let that = this,
            qrcode = this.data.qrcode
        if (qrcode && !that.data.isDownQrcode) {
            util.showLoading();
            that.data.isDownQrcode = true;
            util.saveImageToPhotosAlbum({filePath: qrcode}).finally(res => {
                util.hideLoading(true);
                that.data.isDownQrcode = false;
                if (res.status === 1) {

                }
                that.$Toast({content: res.message})
            });
        }
    },
    chooseLocation(){
        let that = this;
        if (that.data.isChooseLocation)return;
        util.chooseLocation({}).finally(res => {
            if (res.status === 1 && res.info) {
                that.data.isChooseLocation = true;
                util.showLoading();
                ApiService.saveShopAddress(res.info).finally(res => {
                    that.data.isChooseLocation = false;
                    util.hideLoading(true);
                    if (res.status === 1) {
                        that.getShopManagerInfo(true)
                    } else {
                        that.$Message({content: res.message, type: 'success'});
                    }
                })
            }
        })
    },
    bindServicePhone(){
        this.setData({
            servicePhoneVisible: !this.data.servicePhoneVisible
        })
    },
    handleClickServicePhone(e){
        let that = this, index = e.detail.index;
        if (index === 0) {
            that.$route.push('/page/shop/pages/landline/index').finally(res => {
                that.bindServicePhone();
            })
        } else if (index === 1) {
            that.$route.push('/page/shop/pages/mobilePhone/index').finally(res => {
                that.bindServicePhone();
            })
        }
    }
};
Page(new utilPage(appPage, methods));