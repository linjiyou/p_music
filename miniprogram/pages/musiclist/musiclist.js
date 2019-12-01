// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     musiclist:[],
     listInfo:{}
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     //获取数据
     wx.showLoading({
       title: '加载中',
     })
    console.log(options)
     wx.cloud.callFunction({
       name:"music",
       data:{
         $url:"musiclist",
         playlistId:options.playlistId
       }
     }).then(res=>{
        const pl=res.result.playlist
        this.setData({
          musiclist:pl.tracks,
          listInfo:{
            coverImgUrl:pl.coverImgUrl,
            name:pl.name
          }
        })
        wx.hideLoading()
        this._setMusiclist()
     })
  },
  _setMusiclist(){
    wx.setStorageSync("musiclist", this.data.musiclist)
  }

})