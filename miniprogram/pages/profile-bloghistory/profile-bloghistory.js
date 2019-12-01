let MAX_COUNT=10
let db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   blogList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //  this._getBlogListMini()
    this._getBlogListByOpenId()
  },
  _getBlogListByOpenId(){
    wx.showLoading({
      title: '拼命加载中',
    })
   wx.cloud.callFunction({
     name:"blog",
     data:{
       $url:"getBlogListByOpenId",
       start:this.data.blogList.length,
       count:MAX_COUNT
     }
   }).then(res=>{
     console.log(res.result)
     this.setData({
       blogList:this.data.blogList.concat(res.result)
     })
     wx.hideLoading()
   })
  },
  _getBlogListMini(){
    db.collection("blog").skip(this.data.blogList.length).limit(MAX_COUNT).orderBy("createTime","desc").get()
    .then(res=>{
      console.log(res)
    })
  },
  goComment(event){
    console.log(event)
    wx.navigateTo({
      url: `../blog-comment/blog-comment?blogid=${event.target.dataset.blogid}`,
    })
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
    this._getBlogListByOpenId()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
     const blog=event.target.dataset.blog
     return {
       title:blog.content,
       path:`/pages/blog-comment/blog-comment?blogid=${blog._id}`
     }
  }
})