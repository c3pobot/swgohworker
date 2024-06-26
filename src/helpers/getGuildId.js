'use strict'
const getDiscordAC = require('./getDiscordAC')
const swgohClient = require('src/swgohClient')
module.exports = async(msg, obj = {}, opt = [])=>{
  try{
    let allyCode, dObj, gObj, pObj
    if(obj.allyCode) allyCode = obj.allyCode
    if(!allyCode && msg.dId) dObj = await getDiscordAC(msg.dId, opt)
    if(dObj && dObj.allyCode) allyCode = dObj.allyCode
    if(allyCode) pObj = await redis.get('gId-'+allyCode)
    if(pObj && allyCode) pObj.allyCode = +allyCode
    if(!pObj && allyCode) pObj = await swgohClient.post('queryPlayer', {allyCode: allyCode.toString()}, null)
    if(pObj && pObj.guildId) return pObj
  }catch(e){
    throw(e)
  }
}
