// pages/home/detail.js
const c = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    c.showLoading();
    let shop_id = options.shop_id;
    this.shop_id = shop_id;
    var that = this;
    c.get('/api/wx2/shopDetail', { id: shop_id }, function (res) {
      c.hideLoading();
      if (res.status == 1) {
        res.info.avatar = c.absUrl(res.info.avatar, 200);
        that.setData({
          item: res.info
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
  showQrcode() {
    let setData = {
      showMasker: true
    };
    if(!this.data.qrcode){
      c.showLoading();
      setData.qrcode = c.absUrl('/api/wx_shop/showQrcode?shop_id='+this.shop_id+
      '&page='+encodeURIComponent('pages/home/index'));
    }
    this.setData(setData);
  },
  onLoadQrcode(){
    c.hideLoading();
  },
  closeMasker(){
    this.setData({
      showMasker: false
    });
  },
  noop(){

  },
  downQrcode(){
    if(this.data.qrcode){
      c.showLoading();
      wx.downloadFile({
        url: this.data.qrcode, 
        success: function (res) {          
          c.hideLoading();
          if (res.statusCode === 200) {
            let tempFilePath = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath:tempFilePath,
              success(res) {
                c.toast('成功保存在相册');
              },
              fail(res){
                c.alert(res.errMsg);
              }
            })
          }
        }
      })
    }
  }
})