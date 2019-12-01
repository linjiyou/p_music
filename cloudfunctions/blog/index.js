// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init() 
const TcbRouter = require("tcb-router")
const db=cloud.database()
const blogCollection=db.collection("blog")
const blogCommentCollection=db.collection("blog-comment")
const MAX_COUNT=100
// 云函数入口函数
exports.main = async (event, context) => {
  let app= new TcbRouter({
    event
   })
  app.router("list", async (ctx, next) => {
    let keyword = event.keyword
    let w = {}
    if (keyword.trim() != "") {
      w = {
        content: db.RegExp({
          regexp: keyword,
          options: "i"
        })
      }
    }
 let blogList=blogCollection.skip(event.start).where(w).limit(event.count).orderBy("createTime","desc").get().then((res)=>{
      return res.data
    })
    ctx.body=blogList
  })
  app.router("blogDetail", async (ctx,next)=>{
    let blogId=event.blogId
    let detail=await blogCollection.where({
      _id:blogId
    }).get().then(res=>{
      return res.data
    })
    let countRelut= await blogCommentCollection.count()
    let total=countRelut.total
    let commentList={
      data:[]
    }
   if(total>0){
     const batchTimes=Math.ceil(total/MAX_COUNT)
     const tasks=[]
     for(let i=0;i<batchTimes;i++){
       let promise=blogCommentCollection.skip(i*MAX_COUNT).limit(MAX_COUNT).where({
         blogId
       }).orderBy("createTime","desc").get()
       tasks.push(promise)
     }
     if(tasks.length>0){
       commentList=(await Promise.all(tasks)).reduce((acc,cur)=>{
         return {
           data:acc.data.concat(cur.data)
         }
       })
     }
   } 
    ctx.body={
      detail,
      commentList,
     
    }
  })
  app.router("getBlogListByOpenId",async (ctx,next)=>{
    const wxContext = cloud.getWXContext()
   ctx.body=await blogCollection.skip(event.start).limit(event.count).where({
      _openid:wxContext.OPENID
    }).orderBy("createTime","desc").get().then(res=>{
      return res.data
    })
  })
 return app.serve()
}