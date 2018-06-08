const c = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    left_time: {}
  },
  closeMasker() {
    this.setData({
      hideMasker: true
    });
  },
  inviteFriend() {
    if (this.item.status == 1) {
      if (this.leftTime <= 0) { // 一键发起
        wx.navigateTo({
          url: '/pages/car/payOrder?item_id=' + this.item.id + '&num=1&group=1'
        });
      }
    }
  },
  calcLeftTime() {
    let end_time = new Date().getTime();
    let leftTime = this.leftTime - Math.floor((end_time - this.start_time) / 1000);
    if (leftTime <= 0) {
      this.setData({
        btnText: '一键发起开团'
      });
      return;
    }
    let hour = Math.floor(leftTime / 60 / 60); // left hour
    let minute = Math.floor(leftTime / 60 % 60); // minutes
    let second = leftTime % 60;
    this.setData({
      left_time: {
        hour: hour,
        minute: minute,
        second: second
      }
    });
    setTimeout(this.calcLeftTime.bind(this), 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id || 10; // group_open_id
    this.id = id;
    let that = this;
    c.get('/api/group/getGroupInfo', {
      id: id
    }, function (ret) {
      if (ret.status == 1) {
        let info = ret.info;
        that.group = info;
        let left_num = info.num - info.num_used;
        let num = parseInt(info.num);
        that.leftTime = info.left_time;
        that.item = info.item;
        that.start_time = (new Date()).getTime();
        if (left_num > 0) {
          that.calcLeftTime();
        }
        if (left_num>0) {          
          for (let i = 0; i < left_num; i++) {
            info.members.push({
              id: 0,
              nickname: ''
            });
          }
        }
        that.setData({
          item: info.item,
          info: info,
          num_used: info.num_used,
          left_num: left_num,
          member_id: info.member_id,
          members: info.members
        });
      }
    });
    c.getLocation(function (res) {
      let lat = res.latitude;
      let lon = res.longitude;
      that.$vm = c.listGrid(that, {
        url: '/api/group/goods'
      }).setParams({
        lon: lon,
        lat: lat,
        exclude_id: id
      }).loadData();
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
    this.$vm && this.$vm.loadMore();
  },
  touse() {
    // wx.navigateTo({
    //   url: '/pages/',
    // });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    if (this.group) {
      return {
        title: '【仅剩' + (this.group.num - this.group.num_used) + '人】快来' + this.group.price + '元拼 ' + this.group.item.title,
        path: '/pages/group/shared?id=' + this.id
      };
    }
  }
})