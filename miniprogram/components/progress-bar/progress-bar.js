let movableAreaWidth = 0
let movableViewWidth = 0
let backgroundAudioManager = wx.getBackgroundAudioManager()
let currentSec = -1
let duration=0
let isMoving=false
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: "00:00",
      totalTime: "00:00"
    },
    movableDis: 0,
    progress: 0,
  },
  lifetimes: {
    ready() {
      if(this.properties.isSame&&this.data.showTime.totalTime==="00:00"){
        this._setTime()
      }
      this._getMovableDis()
      this._bindBGMEvent()
    }
  },
  methods: {
     onChange(event){
     if(event.detail.source=="touch"){
       this.data.progress=event.detail.x/(movableAreaWidth-movableViewWidth)*100
       this.data.movableDis=event.detail.x
       isMoving = true
     }
    
     },
     touchEnd(event){
      const currentTimeFormat = this._dateFormat(Math.floor(backgroundAudioManager.currentTime)) 
       this.setData({
         progress:this.data.progress,
         movableDis:this.data.movableDis,
         ["showTime.currentTime"]:`${currentTimeFormat.minute}:${currentTimeFormat.sec}`
       })
       backgroundAudioManager.seek(duration * this.data.progress / 100)
       isMoving = false
     },
    _getMovableDis() {
      const query = this.createSelectorQuery()
      query.select(".movable-area").boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec(rect => {
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width

      })
    },
    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        isMoving=false
        this.triggerEvent("musicPlay")
      })
      backgroundAudioManager.onStop(() => {
        
      })
      backgroundAudioManager.onPause(() => {
        this.triggerEvent("musicPause")
      })
      backgroundAudioManager.onWaiting(() => {
        console.log("onWaiting")
      })
      backgroundAudioManager.onCanplay(() => {
        console.log("onCanplay")
        if (typeof backgroundAudioManager.duration != "undefined") {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })
      backgroundAudioManager.onTimeUpdate(() => {
        if(!isMoving){
          const duration = backgroundAudioManager.duration
          const currentTime = backgroundAudioManager.currentTime
          const currentTimeFormat = this._dateFormat(currentTime)
          const sec = currentTime.toString().split(".")[0]
          if (sec != currentSec) {
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100,
              ["showTime.currentTime"]: `${currentTimeFormat.minute}:${currentTimeFormat.sec}`
            })
            currentSec = sec
          }
          this.triggerEvent("updateTime", {
            currentTime
          })
        }
       

      })
      backgroundAudioManager.onEnded(() => {
        console.log("onEnded")
        this.triggerEvent("musicEnd")
      })
      backgroundAudioManager.onError((res) => {

        wx.showToast({
          title: '错误：' + res.errCode,
        })
      })

    },

    _setTime() {
       duration = backgroundAudioManager.duration
      const durationFormat = this._dateFormat(duration)
      this.setData({
        ["showTime.totalTime"]: `${durationFormat.minute}:${durationFormat.sec}`
      })

    },
    _dateFormat(sec) {
      const minute = Math.floor(sec / 60)
      sec = Math.floor(sec % 60)
      return {
        minute: this._pares0(minute),
        sec: this._pares0(sec)
      }
    },
    _pares0(sec) {
      return sec >= 10 ? sec : "0" + sec
    }
  }
})