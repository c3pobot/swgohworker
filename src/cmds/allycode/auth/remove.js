'use strict'
module.exports = async(obj, opt = [])=>{
  try{
    let msg2send = {content: 'Your allyCode is not linked to your discord id'}
    const dObj = await HP.GetDiscordAC(obj.member.user.id, opt)
    const confirm = HP.GetOptValue(opt, 'confirm')
    if(dObj && dObj.allyCode) msg2send.content = 'Command Canceled'
    if(dObj && dObj.allyCode && confirm){
      if(dObj.uId && dObj.type){
        msg2send.content = 'Authorization for bot to login to account for allyCode **'+dObj.allyCode+'** has been removed'
        await mongo.unset('discordId', {_id: obj.member.user.id, 'allyCodes.allyCode': dObj.allyCode}, {'allyCodes.$.uId': dObj.uId, 'allyCodes.$.type': dObj.type})
        await mongo.del('tokens', {_id: dObj.uId})
        await mongo.del('facebook', {_id: dObj.uId})
        await mongo.del('identity', {_id: dObj.uId})
      }else{
        msg2send.content = 'allyCode **'+dObj.allyCode+'** does not have bot login auth set up.'
      }
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.error(e)
    HP.ReplyError(obj)
  }
}
