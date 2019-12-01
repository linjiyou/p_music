// 云函数入口文件
const cloud = require('wx-server-sdk')
const tcbRouter=require("tcb-router")
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app=new tcbRouter({
    event
    })
    //表示该中间使用所有路由
   app.use(async (ctx,next)=>{
      ctx.data={}
      await next()
   })
  app.router("music", async (ctx,next)=>{
     ctx.data.name="ll"
     ctx.data.l="ll"
     ctx.body={
       data:ctx.data
     }
     
     
   })
   return app.serve()
}