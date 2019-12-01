let MAX_WORDS_NUM=140
let MAX_IMAGE_NUM=9
let db=wx.cloud.database()
let content=""
let userInfo={}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum:0,
    footerBottomHeight:0,
    images:[],
    selectPhoto:true,
  },
  onInput(event){
  let wordsNum=event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM){
      wordsNum=`最大输入字数${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content=event.detail.value
  },
  onFocus(event){
    this.setData({
      footerBottomHeight:event.detail.height
    })
  },
  onBlur(event){
    this.setData({
      footerBottomHeight: 0
    })
  },
  onChoosePhoto(){
     let max=MAX_IMAGE_NUM-this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:(res) =>{
        this.setData({
          images:this.data.images.concat(res.tempFilePaths)
        })
        max = MAX_IMAGE_NUM - this.data.images.length
        this.setData({
          selectPhoto:max<=0?false:true
        })
      }
    })
  },
  onDelImage(event){
   this.data.images.splice(event.target.dataset.index,1)
    this.setData({
      images:this.data.images
    })
    if(this.data.images.length==MAX_IMAGE_NUM-1){
      this.setData({
        selectPhoto:true
      })
    }
  },
  onPreviewImage(event){
  wx.previewImage({
    urls: this.data.images,
    crrent:event.target.dataset.imgsrc
  })
  },
  send(){
    if(content.trim()===""){
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return 
    }
    wx.showLoading({
      title: '发布中',
      mark:true
    })
  let promiseArr=[]
  let fileIds=[]
  for(let i=0;i<this.data.images.length;i++){
    let p = new Promise((resolve,reject) => {
      let item = this.data.images[i]
      let suffix = /\.\w+$/.exec(item)[0]
      wx.cloud.uploadFile({
        cloudPath: `blog/${Date.now()}-${Math.random() * 1000000}${suffix}`,
        filePath: item, // 文件路径
        success: res => {
          fileIds=fileIds.concat(res.fileID)
          resolve()
        },
        fail: err => {
          reject()
        }
        
      })
    }) 
    promiseArr.push(p)
  }
   Promise.all(promiseArr).then(res=>{
      db.collection("blog").add({
        data:{
          content,
          img:fileIds,
          ...userInfo,
          createTime:db.serverDate()
        }
      })
   }).then(res=>{
     wx.hideLoading()
     wx.showModal({
       title: '发布成功',
       content: '',
     })
     wx.navigateBack({
       delta: 1
     })
   const pages=getCurrentPages()
   const updatePage=pages[pages.length-2]
   updatePage.onPullDownRefresh()
     
   }).catch(err=>{
     wx.hideLoading()
     wx.showModal({
       title: '发布失败',
       content: '',
     })
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     userInfo=options
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

  }
})