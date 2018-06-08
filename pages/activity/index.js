const c = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  qrcodeLoaded() {
    c.hideLoading()
  },
  downPage() {
    c.showLoading()
    wx.canvasToTempFilePath({
      canvasId: 'mypager',
      success: function (res) {        
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          complete(){
            c.hideLoading()
          },
          fail(){
            c.alert('保存海报失败')
          },
          success(rt) {
            c.toast('海报已保存在相册')
          }
        })

      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {            
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    c.showLoading();  
    let that = this  
    wx.getSystemInfo({
      success: (res) => {
        let width = res.windowWidth
        let wheight = res.windowHeight
        let rate = width / 750
        let height = rate * 1206
        this.setData({
          h: height,
          mtop: wheight - height,
          mtop2: height - rate * 64,
          w:width
        });
        let count = 0
        wx.downloadFile({
          url: c.absUrl('/little/redbag.png'),
          success: function (res) {          
            count++;
            that.redbag = res.tempFilePath
            if(count == 2){              
              that.drowImage(width,height,rate)
            }
          }
        });
        wx.downloadFile({
          url: c.absUrl('/api/wx_shop/showInviteQrcode?page=' + encodeURIComponent('pages/activity/wallet')),
          header: {
            cookie: c.getSessionId()
          },
          success: function (res) {          
            count++;
            that.qrcode = res.tempFilePath
            if (count == 2) {
              that.drowImage(width, height, rate)
            }            
          }
        });
        
      }
    });
  },

  drowImage(width, height, rate){
    c.hideLoading();
      let path = this.qrcode
      var context = wx.createCanvasContext('mypager');
      context.drawImage(this.redbag, 0, 0, width, height)
      context.save()
      context.beginPath()
      let x = width / 2 + 8 * rate
      let y = height - 325 * rate
      let r = 110 * rate
      context.arc(x, y, r, 0, 2 * Math.PI)
      context.setFillStyle('red')
      context.fill()

      context.clip()
      context.drawImage(path, x - r, y - r, 2 * r, 2 * r);
      context.restore()
      context.draw()
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
    return {
      title: '美美天成新年红包',
      path: '/pages/activity/wallet'
    };
  }
})