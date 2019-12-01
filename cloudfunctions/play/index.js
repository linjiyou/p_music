// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const rp = require("request-promise")
const URL = "http://musicapi.xiecheng.live/personalized"
const playCollection = db.collection("playlist")
const MAX_LIMIT=100
exports.main = async(event, context) => {
  //const list = await playCollection.get()
  const playlist = await rp(URL).then(res => {
    return JSON.parse(res).result
  })
  let count = await playCollection.count()
  let total=count.total
  let batchTimes=Math.ceil(total/MAX_LIMIT)
  let tasks=[]
  for (let i = 0; i <batchTimes;i++){
    let promise=playCollection.skip(i*MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list=[]
  if(tasks.length>0){
   list=(await Promise.all(tasks)).reduce((acc,cur)=>{
       return {
         data:acc.data.concat(cur.data)
       }
     })
  }

  let flag = true
  let newData = []
  for (let i = 0; i < playlist.length; i++) {
    for (let j = 0; j < list.data.length; j++) {
      if (playlist[i].id === list.data[j].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(playlist[i])

    }
  }
  for (let i = 0; i < newData.length; i++) {
    await playCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate(),
      }
    }).then(res => {
      console.log("插入成功")
    }).catch(err => {
      console,
      log(err)
    })

  }
  return newData.length
}