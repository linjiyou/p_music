// components/musiclist/musiclist.js
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    musicId: -1
  },
  pageLifetimes:{
   show(){
    this.setData({
      musicId:parseInt(app.getMusicId())
      
    })
   }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    selectTo(event) {

      const data = event.currentTarget.dataset
      const musicid = data.musicid
      this.setData({
        musicId: musicid
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${musicid}&index=${data.index}`
      })
    }
  }
})