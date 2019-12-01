module.exports=(data)=>{
  let format="yyyy-MM-dd hh:mm:ss"
  let o={
    "M+":data.getMonth()+1,
    "d+":data.getDate(),
    "h+":data.getHours(),
    "m+":data.getMinutes(),
    "s+":data.getSeconds()
  }
  if(/(y+)/.test(format)){
  format=format.replace(RegExp.$1,data.getFullYear())
  }
  for(let i in o){
    if(new RegExp('('+i+')').test(format)){
      format = format.replace(RegExp.$1, o[i].toString().length===1?"0"+o[i]:o[i])
     
    }
  }
  return format
}