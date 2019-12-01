let userInfo={}
const db=wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId:String,
    blog:Object
  },
  options: {
    styleIsolation: "apply-shared",
  },
  /**
   * 组件的初始数据
   */
  data: {
    loginShow:false,
    showModal:false,
    content:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComent(){
     wx.getSetting({
       success:(res)=>{
        if(res.authSetting["scope.userInfo"]){
          wx.getUserInfo({
            success:(res)=>{
              userInfo=res.userInfo
            }
          })
          this.setData({
            showModal:true
          })
        }else{
          this.setData({
            loginShow:true
          })
        }
       }
       
     })
    },
    onLoginSuccess(event){
      userInfo=event.detail
       this.setData({
         loginShow:false,
       },()=>{
         this.setData({
           showModal:true
         })
       })
    },
    onLoginFail(){
      wx.showModal({
        title: '用户没有授权登陆',
        content: '',
      })
    },
    onSend(event){
      const content=event.detail.value.content
      const formId=event.detail.formId
      if(content.trim()===""){
        wx.showModal({
          title: '评论不能为空',
          content: '',
        })
        return
      }
      wx.showLoading({
        title: '评论中',
        mask:true
      })
      
      db.collection("blog-comment").add({
        data:{
          content,
          nickName:userInfo.nickName,
          avatarUrl:userInfo.avatarUrl,
          createTime:db.serverDate(),
          blogId: this.properties.blogId

        }
      }).then(res=>{
        console.log(content, formId, this.properties.blogId)
        wx.cloud.callFunction({
          name:"sendMessage",
          data:{
            content,
            formId,
            blogId:this.properties.blogId
          }
        }).then(res=>{
          console.log(res)
        })
        wx.hideLoading()
        wx.showModal({
          title: '评论成功',
          content: '',
        })
        this.setData({
          showModal:false,
          content:""
        })
        //评论成涮新页面
        this.triggerEvent("refreshCommentList")
      })
    },
  }
})
