'use strict'
module.exports = async(obj, opt)=>{
  try{
    let msg2send = {content: 'There are no patreons'}
    const patreons = await mongo.find('patreon', {})
    if(patreons && patreons.length > 0){
      msg2send.embeds = []
      for(let i=0, j = patreons.length; i < j; i +=25){
        const tempArray = patreons.slice(i, i + 25)
        if(tempArray.length > 0){
          const embedMsg = {
            color: 15844367,
            description: 'Status : Name\n```\n'
          }
          if(i == 0) embedMsg.title = 'C3PO Arena sync patreons'
          for(let p in tempArray){
            const user = await HP.BotRequest('getMember', {podName: 'bot-0', dId: tempArray[p]._id})
            embedMsg.description += tempArray[p].status+'   : @'+(user ? user.tag:tempArray[p]._id)+'\n'
          }
          embedMsg.description += '```'
          msg2send.embeds.push(embedMsg)
        }
      }
      msg2send.content = null
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
