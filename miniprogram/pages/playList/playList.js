// pages/playList/playList.js
const MAX_LIMIT = 15
Page({

  /**
   * 页面的初始数据
   */
  data: {

    swiperImgUrls: [{
      url: 'http://p1.music.126.net/bIo3-171VzJ868RZE-CNjw==/109951165080112892.jpg?imageView&quality=89',
      },
      {
        url: 'http://p1.music.126.net/NepbMT1xZlS2l59YdWalKQ==/109951165080645718.jpg?imageView&quality=89',
      },
      {
        url: 'http://p1.music.126.net/Q6_Axd1jPUDUQCSQRPcuKw==/109951165080168682.jpg?imageView&quality=89',
      },
      {
        url:"http://p1.music.126.net/sOLsVvO16r-zll1WyudoYg==/109951165080121843.jpg?imageView&quality=89"
      }
    ],
    playList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    this._getPlaylist()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
     this.setData({
       playList:[]
     })
     this._getPlaylist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this._getPlaylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  _getPlaylist(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name: "music",
      data: {
        start: this.data.playList.length,
        count: MAX_LIMIT,
        $url:"playlist"
      }
    }).then(res => {
      this.setData({
        playList: this.data.playList.concat(res.result.data)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  }
})