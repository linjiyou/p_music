// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const result = await cloud.openapi.templateMessage.send({
    touser: cloud.getWXContext().OPENID, // 通过 getWXContext 获取 OPENID
    page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
    data: {
      keyword1: {
        value: '评论成功'
      },
      keyword2: {
        value: event.content
      },
     
    },
    templateId: 'qzO636ghhyPtBcbbttdSPrpcCaVhsgNh5kxGIPlXVJ8',
    formId: event.formId,
    
  })
  
  return result
}