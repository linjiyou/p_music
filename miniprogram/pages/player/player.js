let musiclist = []
let nowPlayIngIndex
//获取全局的唯一的背景音频管理器
const backgroundAuidoManage = wx.getBackgroundAudioManager()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: "",
    isPlaying: false,
    isLyricShow: false,
    lyric: "",
    isSame: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    musiclist = wx.getStorageSync("musiclist")
    nowPlayIngIndex = options.index
    this._loadMusicDetail(options.musicId)
  },

  _loadMusicDetail(musicId) {
    if (musicId == app.getMusicId()) {
      this.setData({
        isSame: true
      })
    } else {
      this.setData({
        isSame: false
      })
    }
    if (!this.data.isSame) {
      backgroundAuidoManage.stop()
    }
    let music = musiclist[nowPlayIngIndex]
    wx.setNavigationBarTitle({
      title: music.name
    })
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false
    })
    app.setMusicId(musicId)
    wx.showLoading({
      title: '歌曲加载中',
    })
    wx.cloud.callFunction({
      name: "music",
      data: {
        musicId,
        $url: "musicUrl"
      }
    }).then(res => {
      if (!this.data.isSame) {
        const url = res.result.data[0].url
        if (url === null) {
          wx.showToast({
            title: '歌曲无权限播放',
          })
          return
        }
        backgroundAuidoManage.src = url
        backgroundAuidoManage.title = music.name
        backgroundAuidoManage.coverImgUrl = music.al.picUrl
        backgroundAuidoManage.singer = music.ar[0].name
        backgroundAuidoManage.epname = music.al.name
        this.saveplayHistory()
      }
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
    })
    wx.cloud.callFunction({
      name: "music",
      data: {
        musicId,
        $url: "lyric"
      }
    }).then(res => {
      let lyric = "暂无歌词"
      let lrc = res.result.lrc
      if (lrc) {
        lyric = lrc.lyric
      }
      this.setData({
        lyric
      })
    })
  },

  togglePlay() {
    if (this.data.isPlaying) {
      backgroundAuidoManage.pause()
    } else {
      backgroundAuidoManage.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  onPrev() {
    const len = musiclist.length - 1
    nowPlayIngIndex--
    if (nowPlayIngIndex < 0) {
      nowPlayIngIndex = len
    }
    this._loadMusicDetail(musiclist[nowPlayIngIndex].id)
  },
  onNext() {
    const len = musiclist.length - 1
    nowPlayIngIndex++
    if (nowPlayIngIndex > len) {
      nowPlayIngIndex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayIngIndex].id)
  },
  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  updateTime(event) {
    this.selectComponent(".lyric").update(event.detail.currentTime)
  },
  onPlay() {
    this.setData({
      isPlaying: true
    })
  },
  onPause() {
    this.setData({
      isPlaying: false
    })
  },
  saveplayHistory() {
    const music = musiclist[nowPlayIngIndex]
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid)
    let bHave = false
    if (history.length !== 0) {
      for (let i = 0; i < history.length; i++) {
        if (history[i].id == music.id) {
          bHave = true
          break
        }
      }
    }
    if (!bHave) {
      history.unshift(music)
      wx.setStorage({
        key: openid,
        data: history,
      })
    }


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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})