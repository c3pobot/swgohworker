'use strict'
const modStat = require('./modStat')
module.exports = (baseId)=>{
  try{
    if(modStat[baseId]){
      return modStat[baseId].mod
    }else{
      return (baseId)
    }
  }catch(e){
    throw(e)
  }
}
