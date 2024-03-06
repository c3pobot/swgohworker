'use strict'
const { GetGAHist, GetGAInfo } = require('src/cmds/ga/helpers')
const ShowSettings = require('./show')
module.exports = async(obj, opt = [])=>{
  try{
    let msg2send = {content: 'You did not specify a unit'}, unit, uInfo, sendResponse = 1, guildId, gaInfo
    if(opt.find(x=>x.name == 'unit')) unit = opt.find(x=>x.name == 'unit').value.toString().toLowerCase().trim()
    const dObj = await HP.GetDiscordAC(obj.member.user.id, opt)
    if(dObj && dObj.allyCode){
      const pObj = await HP.GetGuildId({dId: obj.member.user.id}, dObj, opt)
      if(pObj && pObj.guildId) guildId = pObj.guildId
      gaInfo = await GetGAInfo(dObj.allyCode)
      if(!gaInfo) gaInfo = {units: [], enemies: []}
      msg2send.content = 'you did not specify a unit'
      unit = HP.GetOptValue(opt, 'unit')
      if(unit) unit = unit.toString().trim()
    }
    if(unit){
      msg2send.content = 'error finding unit **'+unit+'**'
      uInfo = await HP.FindUnit(obj, unit, guildId)
    }
    if(uInfo){
      await HP.ReplyButton(obj, 'Removing **'+uInfo.nameKey+'**...')
      gaInfo.units = gaInfo.units.filter(x=>x.baseId != uInfo.baseId)
      await mongo.pull('ga', {_id: dObj.allyCode.toString()}, {units: {baseId: uInfo.baseId}})
      sendResponse = 0
      ShowSettings(obj, opt, dObj, gaInfo)
    }
    if(sendResponse) HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
