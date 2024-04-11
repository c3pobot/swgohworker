'use strict'
module.exports = (obj, id)=>{
  try{
    return obj.reduce((acc, a)=>{
      return acc+ a.purchasedAbilityId.filter(x=>x === id).length
    },0)
  }catch(e){
    throw(e)
  }
}
