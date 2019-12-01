let keyword=""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    blogList: []
  },
  onPublish() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success: (res) => {
              this.onLoginSuccess({
                detail: res.userInfo
              })
            }
          })
        } else {
          this.setData({
            showModal: true
          })
        }
      }
    })

  },
  onLoginSuccess(event) {
    const {
      nickName,
      avatarUrl
    } = event.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${nickName}&avatarUrl=${avatarUrl}`
    })
  },
  onLoginFail() {
    wx.showModal({
      title: '获取用户权限失败',
      content: '请用户同意授权',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadBlogList()
  },
  _loadBlogList(start=0) {
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name: "blog",
      data: {
        keyword,
        start,
        count: 10,
        $url: "list",
      
      }
    }).then(res => {
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  onComment(event){
   wx.navigateTo({
     url: `../blog-comment/blog-comment?blogid=${event.target.dataset.blogid}`,
   })
  },
  search(event){
   keyword=event.detail
   this.setData({
     blogList:[]
   })
   this._loadBlogList()
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
      blogList:[]
    })
    this._loadBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(event) {
      console.log(event)
      let {content,_id}=event.target.dataset.blog
      
      return {
        title:content,
        path: `/pages/blog-comment/blog-comment?blogid=${_id}`
      }
  }
})