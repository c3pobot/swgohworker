'use strict'
module.exports = (opt = [], optName, defaultValue)=>{
  try{
    let res = defaultValue
    let obj = opt.find(x=>x.name === optName)
    if(obj) res = obj.value
    return res
  }catch(e){
    throw(e)
  }
}
