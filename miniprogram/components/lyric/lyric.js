// components/lyric/lyric.js
let lyricHeight=0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow:{
      type:Boolean,
      value:false
    },
    lyric:String
  },
  observers:{
    lyric(lyric){
      if(lyric=="暂无歌词"){
        this.setData({
          lyricList:[{
            lrc: lyric,
             time:0
           }],
          nowLyricIndex:-1
        })
       
      }else{
        this._parseLyric(lyric)
      }
     
   }
  },
  lifetimes:{
     ready(){
       wx.getSystemInfo({
         success(res) {
           lyricHeight= res.screenWidth/750*64
         },
       })
     }
  },
  /**
   * 组件的初始数据
   */
  data: {
   lyricList:[],
   nowLyricIndex:-1,
   scrollTop:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    update(currentTime){
      let lyricList=this.data.lyricList
      if(lyricList.length===0){
        return}
      if(currentTime>lyricList[lyricList.length-1].time){
        if (this.data.nowLyricIndex!=-1){
          this.setData({
            nowLyricIndex: -1,
            scrollTop: (lyricList.length) * lyricHeight
          })
        }    
      }
      for(let i=0;i<lyricList.length;i++){    
        if(currentTime<=lyricList[i].time){
         this.setData({
           nowLyricIndex:i-1,
           scrollTop: (i - 1) * lyricHeight
         })
         break
        }
      }
    },
    _parseLyric(lyric){
     let lyricArr=lyric.split("\n")
     let _lyricList=[]
      lyricArr.forEach((item,index)=>{
        let reg = /\[(\d{2,}):(\d{2})(:|\.(\d{2,3})?)]/g
        let regT = /\[(\d{2,}):(\d{2})(:|\.(\d{2,3})?)]/
        let time = item.match(reg)
        if(time!==null){
          let lrc = item.split(time)[1]
          let timeReg = time[0].match(regT)
          let toSecond=parseInt(timeReg[1])*60+parseInt(timeReg[2])+parseInt(timeReg[3]/1000)
          _lyricList.push({
            lrc,
            time:toSecond
          })
         
        }  
      })
     
      this.setData({
        lyricList:_lyricList
      })
     }
  }
})
