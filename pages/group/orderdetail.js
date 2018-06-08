const c = require("../../utils/common.js");
const qrcode = require("../../utils/qrcode.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode: {
      img: '',
      hidden: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id || 9;
    this.id = id;
    c.showLoading();
    let that = this;
    c.get('/api/group/detail',{id:id},function(ret){
      c.hideLoading();
      if(ret.status == 1){
        that.start_time = new Date().getTime();
        that.countTime(ret.info.left_seconds);
        that.item = ret.info;
        that.setData({
           item:ret.info
        });
      }
    });
  },
  countTime(seconds){
    seconds = seconds || this.data.item.left_seconds;
    let passedSeconds = parseInt((new Date().getTime() - this.start_time)/1000);    
    let left_time = seconds - passedSeconds;
    if (left_time <= 0) {
      this.data.item.left_seconds = -1;
      this.setData({
        left_time: 0,        
        item: this.data.item
      });    
      return;
    }
    left_time = c.leftseconds2timestr(left_time);
    this.setData({
      left_time:left_time
    });    
    setTimeout(this.countTime.bind(this),1000);
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
  tostartagain(){
    wx.navigateTo({
      url: '/pages/car/payOrder?item_id='+ this.id +'&num=1&group=1',
    });
  },
  toshare(){
    wx.navigateTo({
      url: '/pages/group/shared?id='+this.id,
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
     
  },

  closeQrcode: function () {
    this.data.qrcode.hidden = true;
    this.setData({
      qrcode: this.data.qrcode
    });
  },
  touse(e) {
    var item = this.item;
    if(!item){
      return;
    }
    this.data.qrcode.hidden = false;
    var num = item.pwd || 'error';
    this.data.qrcode.order_no = item.order_no;
    this.data.qrcode.img = qrcode.createQrCodeImg('https://app.mmtcapp.com/mmtc/?pwd=' + num, { 'size': 300 });
    this.data.qrcode.num = num.match(/.{4}/g).join(' ');
    this.setData({
      qrcode: this.data.qrcode
    });
  },
  noop(){
    
  }
})