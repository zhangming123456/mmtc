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
        text: "Page businessHours",
        isFixed: false,
        loadingMore: true,
        noMore: false,
        img_srcs: []
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
            isShow = that.data.isShow;
        if (!options.id) {
            that.$route.back();
            return;
        }
        wx.setNavigationBarTitle({
            title: options.title
        });
        that.setData({type_id: options.id});
        that.shopGetPicsOfType(options.id);
    },

    loadData () {

    },
    shopGetPicsOfType(type_id){
        let that = this;
        if (this.data.isShopGetPicsOfType)return;
        this.data.isShopGetPicsOfType = true;
        util.showLoading();
        ApiService.shopGetPicsOfType({type_id}).finally(res => {
            this.data.isShopGetPicsOfType = false;
            util.hideLoading(true);
            if (res.status === 1) {
                that.setData({
                    img_srcs: res.info
                })
            } else {
                that.$Message({content: res.message});
            }
        })
    },
    upImg(e){
        if (this.data.isSubmit)return;
        let that = this,
            index = e.currentTarget.dataset.index;
        if (index > -1) {
            this.ImageUpload(1, `img_srcs[${index}]`).finally(res => {
                console.log(res);
                if (res.status === 1) {
                    that.bindSubmit(index, 'replace')
                }
            })
        } else {
            this.ImageUpload(9, 'img_srcs').finally(res => {
                if (res.status === 1) {
                    that.bindSubmit()
                }
            })
        }
    },
    bindClearImg(e){
        if (this.data.isSubmit)return;
        let index = e.currentTarget.dataset.index,
            img_srcs = this.data.img_srcs;
        if (index > -1) {
            this.bindSubmit(index, 'delete')
        }
    },
    bindSubmit(index, type = 'update'){
        let that = this,
            img_srcs = this.data.img_srcs,
            type_id = that.data.type_id,
            arr = img_srcs.slice(0);
        if (that.data.isSubmit)return;
        if (index > -1 && type === 'delete') {
            img_srcs.splice(index, 1);
        }
        if (img_srcs && img_srcs.length === 0 && type !== 'delete') {
            that.$Message({content: '至少一张图片~', type: "warning"});
            return
        }
        util.showLoading('上传中');
        that.data.isSubmit = true;
        ApiService.shopPicsOfType({img_srcs, type_id}).finally(res => {
            that.data.isSubmit = false;
            util.hideLoading(true);
            if (res.status === 1) {
                if (index > -1 && type === 'delete') {
                    this.setData({img_srcs});
                    that.$Message({content: '删除成功'});
                } else if (type === 'replace') {
                    that.$Message({content: '替换成功'});
                } else {
                    that.$Message({content: '保存成功'});
                }
            } else {
                this.setData({img_srcs: arr});
                that.$Message({content: res.message, type: "warning"});
            }
        })
    }
};
Page(new utilPage(appPage, methods));