const c = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  changeValicode: function (e) {
    this.code = e.detail.value.trim();
  },
  changeTelephone(e) {    
    this.telephone = e.detail.value.trim();
  },
  doLogin: function (e) {
    if (!this.telephone) {
      c.alert('请输入手机号码');
      return;
    }
    if (!c.isPhone(this.telephone)) {
      c.alert('请输入正确的手机号码');
      return;
    }
    if (!this.code) {
      c.alert('请输入验证码');
      return;
    }
    c.showLoading();
    c.post('/api/member/login', {
      telephone: this.telephone,
      type: 1,
      invite_id: this.invite_id||0,
      code: this.code
    }, function (ret) {
      c.hideLoading();
      if (ret.status == 1) {
        c.setUserInfo(ret.info);        
        wx.switchTab({
          url: '/pages/mine/index',
        })
      } else {
        c.alert(ret.info);
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.start_time = 0;
    this.invite_id = options.invite_id || 0;
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
  getCode: function (e) {
    if (this.start_time > 0) {
      return;
    }
    if (!this.telephone) {
      c.alert('请输入手机号码');
      return;
    }
    if (!c.isPhone(this.telephone)) {
      c.alert('请输入正确的手机号码');
      return;
    }
    let url = '/api/index/getCheckCode';
    c.showLoading();
    var that = this;
    c.post(url, { telephone: this.telephone }, function (ret) {
      c.hideLoading();
      if (ret.status == 1) {
        c.toast('发送验证码成功');
        that.startCount();
      } else {
        c.alert(ret.info);
      }
    });
  },
  startCount: function () {
    this.start_time = new Date().getTime();
    setTimeout(this.innerCount.bind(this), 1000);
  },
  innerCount: function () {
    var now_time = new Date().getTime();
    var seconds = 60 - parseInt((now_time - this.start_time) / 1000);
    if (seconds <= 0) { // 已结束
      this.setData({
        codeMsg: ''
      });
      this.start_time = 0;
    } else {
      this.setData({
        codeMsg: '(' + c.w(seconds) + ')重新获取'
      });
      setTimeout(this.innerCount.bind(this), 1000);
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})