const app = getApp(),
    util = app.util, regeneratorRuntime = util.regeneratorRuntime,
    config = require('../../../../utils/config'),
    utilPage = require('../../../../utils/utilPage'),
    ApiService = require('../../../../utils/ApiService');
let touch = false;
let direction = 0;
let startTime = 0;
let endTime = 0;
const appPage = {
    data: {
        text: "Page shopAtlas",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        current: 'tab1',
        tabs: [
            {
                key: 'tab1',
                title: '店铺主图'
            },
            {
                key: 'tab2',
                title: '相册管理'
            }
        ],
        scrollLeft: 0,
        scrollWidth: 0,
        _scrollLeft: 0,
        img_srcs: [],
        picFigure: [],
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
            this.showGetPicFigure(true)
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
        this.setData({
            clearTimer: true
        });
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
            img_srcs = options.img_srcs,
            isShow = that.data.isShow;
        if (img_srcs) that.setData({img_srcs: img_srcs.split(',')});
        that.data.scrollWidth = that.data.systemInfo.screenWidth * 2;
        that.showGetPicFigure()
    },
    showGetPicFigure(bol){
        let that = this;
        if (this.data.isShopGetPicFigure)return;
        this.data.isShopGetPicFigure = true;
        util.showLoading();
        ApiService.showGetPicFigure().finally(res => {
            this.data.isShopGetPicFigure = false;
            util.hideLoading(true);
            if (res.status === 1) {
                that.setData({
                    picFigure: res.info
                })
            } else {
                util.failToast(res.message)
            }
        })
    },
    loadData () {

    },
    handleChange(e){
        let key = e.detail.key,
            tabs = this.data.tabs,
            fIndex = tabs.findIndex(v => {
                return v.key === key
            });
        if (key && fIndex > -1) {
            this.setData({
                current: key
            })
        }
    },
    scrollX(e){
        let that = this;
        let current = this.data.current;
        let scrollLeft = e.detail.scrollLeft;
        let scrollWidth = e.detail.scrollWidth;
        that.data.scrollWidth = scrollWidth;
        if (scrollLeft < 0) scrollLeft = 0;
        if (touch) {
            direction = scrollLeft - that.data.scrollLeft;
        } else {
            that.data.scrollLeft = scrollLeft;
            this.setData({
                current: current
            })
        }
    },
    touchcancel(){
        console.log('touchcancel');
        touch = false
    },
    touchstart(){
        startTime = +new Date()
        direction = 0;
        console.log('touchstart');
        touch = true
    },
    touchend(){
        endTime = +new Date();
        console.log('touchend');
        this.data.scrollLeft += direction;
        this.calculate();
        touch = false
    },
    calculate(){
        let tabs = this.data.tabs,
            scrollWidth = this.data.scrollWidth,
            scrollLeft = this.data.scrollLeft,
            len = tabs.length,
            current = this.data.current,
            fIndex = tabs.findIndex(v => {
                return v.key === current
            });
        if (touch && fIndex > -1) {
            let boxW = scrollWidth / len;
            let maxW = boxW / 4;
            let index = Math.floor(scrollLeft / boxW);
            // console.log(direction);
            // console.log(index);
            // console.log(Math.ceil(scrollLeft - index * boxW), maxW, 'sdfjalsdf');
            if (direction === 0)return;
            if (maxW < Math.abs(direction)) {
                if (direction > 0 && fIndex + 1 <= tabs.length - 1) {
                    this.setData({
                        current: tabs[fIndex + 1].key
                    })
                } else if (fIndex - 1 >= 0) {
                    this.setData({
                        current: tabs[fIndex - 1].key
                    })
                }
                // console.log((direction > 0 ? false : true));
            } else {
                this.setData({
                    current: tabs[fIndex].key
                })
                // console.log((direction < 0 ? true : false));
            }
        }
    },
    upImg(e){
        let index = e.currentTarget.dataset.index;
        if (index > -1) {
            this.ImageUpload(1, `img_srcs[${index}]`).finally(res => {
                console.log(res);
            })
        } else {
            this.ImageUpload(9, 'img_srcs').finally(res => {
                console.log(res);
            })
        }

    },
    toAlbum(e){
        let item = e.currentTarget.dataset.item;
        if (item && item.id) {
            this.$route.push({path: '/page/shop/pages/album/index', query: item})
        }
    },
    bindClearImg(e){
        let that = this, index = e.currentTarget.dataset.index,
            img_srcs = this.data.img_srcs;
        if (index > -1) {
            wx.showModal({
                title: '提示',
                content: `确定删除该图片吗？`,
                cancelText: '取消',
                cancelColor: '#000000',
                confirmText: '删除',
                confirmColor: '#3CC51F',
                success: function (res) {
                    if (res.confirm) {
                        img_srcs.splice(index, 1);
                        that.setData({img_srcs})
                    }
                }
            })
        }
    },
    bindSubmit(){
        let that = this,
            img_srcs = this.data.img_srcs;
        if (img_srcs && img_srcs.length === 0) {
            that.$Message({content: '至少一张图片~', type: "warning"});
            return
        }
        if (that.data.isSubmit)return;
        util.showLoading();
        that.data.isSubmit = true;
        ApiService.shopSaveImgSrcs({img_srcs: img_srcs.toString()}).finally(res => {
            that.data.isSubmit = false;
            util.hideLoading(true);
            if (res.status === 1) {
                that.$Message({content: '保存成功'});
            } else {
                that.$Message({content: res.message, type: "warning"});
            }
        })
    }
};
Page(new utilPage(appPage, methods));
