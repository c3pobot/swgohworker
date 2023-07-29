'use strict'
const { GetUnitCheck, VerifyUnit } = require('./helper')
module.exports = async(obj, opt = [])=>{
  try{
    let allyCode, msg2send = {content: 'You did not provide an allyCode'}
    allyCode = HP.GetOptValue(opt, 'allycode')
    if(allyCode){
      allyCode = +(allyCode.trim().replace(/-/g, ''))
      msg2send.content = '**'+allyCode+'** is not a valid allyCode'
      const pObj = await Client.post('queryPlayer', {allyCode: allyCode.toString()}, null)
      if(pObj && pObj.playerId){
        const exists = (await mongo.find('discordId', {'allyCodes.allyCode': allyCode}))[0]
        if(exists){
          if(exists._id == obj.member.user.id){
            msg2send.content = '**'+allyCode+'** for player **'+pObj.name+'** is already linked to your account'
          }else{
            const auth = await VerifyUnit(pObj.playerId, pObj.rosterUnit.filter(x=>x.relic && x.currentLevel > 50))
            if(auth == 2){
              await mongo.pull('discordId', {'allyCodes.allyCode': allyCode}, {allyCodes:{allyCode: allyCode}})
              await mongo.del('acVerify', {_id: pObj.playerId})
              await mongo.push('discordId', {_id: obj.member.user.id}, {allyCodes: {allyCode: allyCode, playerId: pObj.playerId, name: pObj.name}})
              msg2send.content = 'allyCode **'+allyCode+'** for player **'+pObj.name+'** has been linked to your discordId'
            }else{
              msg2send.content = 'allyCode **'+allyCode+'** for player **'+pObj.name+'** is already linked to another discordId'
              const unit = await GetUnitCheck(pObj.rosterUnit.filter(x=>x.relic && x.currentLevel > 50))
              if(unit){
                const baseId = unit.definitionId.split(':')[0]
                const unitNameKey = await HP.GetUnitName(baseId)
                const tempObj = {
                  defId: unit.definitionId,
                  mods: unit.equippedStatMod,
                  verify: 'add'
                }
                if(tempObj.mods.length > 0) tempObj.verify = 'remove'
                await mongo.set('acVerify', {_id: pObj.playerId}, tempObj)
                msg2send.content += '\nYou can verify you have access to this account by **'+tempObj.verify+'ing** a square and a diamond mod '+(tempObj.verify == 'add' ? 'to':'from')+' **'+(unitNameKey ? unitNameKey:baseId)+'**'
                msg2send.content += ' and then running  this command again.\n'
                msg2send.content +='**Note: This verification expires in ~5 minutes**'
              }
            }
          }
        }else{
          await mongo.push('discordId', {_id: obj.member.user.id}, {allyCodes: {allyCode: allyCode, playerId: pObj.playerId, name: pObj.name}})
          msg2send.content = 'allyCode **'+allyCode+'** for player **'+pObj.name+'** has been linked to your discordId'
        }
      }
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
