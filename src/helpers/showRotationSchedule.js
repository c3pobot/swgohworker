module.exports = async(obj, rObj, shardObj, opt)=>{
  let msg2Send, timeTillPO
  let playerArray = []
  if(rObj.players.length > 0){
    if(rObj.order == 'normal'){
      playerArray = rObj.players
    }else{
      for(let i=rObj.players.length;i>0;i--){
        playerArray.push(rObj.players[i - 1])
      }
    }
  }
  const guildRole = await HP.GetRole(shardObj.sId, rObj.roleId)
  const guildChannel = await MSG.GetChannel(rObj.chId)
  if(rObj.poOffSet || rObj.poOffSet == 0) timeTillPO = await HP.TimeTillPayout(rObj.poOffSet, rObj.type)
  msg2Send = '>>> **'+rObj.id+'** Rotation Schedule ('+rObj.players.length+')\n'
  msg2Send += '```\n'
  msg2Send += 'Start Time   : '+rObj.startTime+'\n'
  if(rObj.chId && opt) msg2Send += 'Channel      : '+(guildChannel ? '#'+guildChannel.name:'#'+rObj.chId)+'\n'
  if(rObj.roleId && opt) msg2Send += 'Role         : '+(guildRole ? '@'+guildRole.name:'@'+rObj.roleId)+'\n'
  msg2Send += 'Order        : '+rObj.order+'\n'
  if(opt) msg2Send += 'Notify       : '+rObj.notify+'\n'
  if(rObj.poOffSet || rObj.poOffSet == 0) msg2Send += 'Time till PO : '+timeTillPO[0]+'\n'
  msg2Send += '```\n'
  if(playerArray.length > 0){
    msg2Send += 'Players Next Rotation Order\n'
    msg2Send += '```\n'
    let count = 1
    for(let i in playerArray){
      msg2Send += count.toString().padStart(2, ' ')+' @'+playerArray[i].name+'\n'
      count++
    }
    msg2Send += '```'
  }
  HP.ReplyMsg(obj, {content: msg2Send})
}
