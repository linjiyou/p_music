// components/playlist/playlist.js
Component({

  properties: {
    playList:{
      type:Object
    }
  },
  observers:{
    ["playList.playCount"](count){
     this.setData({
       _count: this._tarnNumber(count, 2)
     })
    }
  },
  data: {
    _count:0
  },

  methods: {
     _tarnNumber(num,point){
       let numStr=num.toString().split('.')[0]
       if (numStr.length<6){
          return numStr
       } else if ((numStr.length >= 6 && numStr.length<=8)){
         let decimal = numStr.substring(numStr.length-4,numStr.length-4+point)
         return parseFloat(parseInt(num / 10000) + "." + decimal)+"万"
       }else if(numStr.length>8){
         let decimal=numStr.substring(numStr.length-8,numStr.length-8+point)
         return parseFloat(parseInt(num / 100000000) + "." + decimal) + "亿"
         
       }
     },
    goToMsuic(){
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?playlistId=${this.properties.playList.id}`,
      })
    }
  }
})
