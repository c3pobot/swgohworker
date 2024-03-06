'use strict'
const CheckAuth = async(dId)=>{
  try{
    let guild, auth = 0, obj, allyCode
    const dObj = await HP.GetDiscordAC(dId)
    if(dObj && dObj.allyCode) obj = (await mongo.find('patreon', {'users.allyCode': +dObj.allyCode, status: 1}))[0]
    if(obj) auth++
    if(auth == 0){
      const pObj = await HP.GetGuildId({dId: dId}, {})
      if(pObj && pObj.guildId) guild = (await mongo.find('guilds', {_id: pObj.guildId, syncArena: 1}))[0]
      if(guild) auth++
      if(pObj && pObj.guildId && auth == 0) guild = (await mongo.find('patreon', {'guilds.id': pObj.guildId, status: 1}))[0]
      if(guild) auth++
    }
    return auth
  }catch(e){
    console.log(e)
  }
}
const Cmds = {}
Cmds.guild = require('./guild')
Cmds.notify = require('./notify')
Cmds.settings = require('./settings')
Cmds.show = require('./show')
Cmds.user = require('./user')
module.exports = async(obj)=>{
  try{
    let tempCmd, opt
    if(obj.data && obj.data.options){
      for(let i in obj.data.options){
        if(Cmds[obj.data.options[i].name]){
          tempCmd = obj.data.options[i].name
          opt = obj.data.options[i].options
          break;
        }
      }
    }
    const patreon = (await mongo.find('patreon', {_id: obj.member.user.id, status: 1}))[0]
    if(tempCmd == 'notify'){
      const auth = await CheckAuth(obj.member.user.id)
      if(auth){
        await Cmds.notify(obj, opt)
      }else{
        HP.ReplyMsg(obj, 'This is only available to patreons or those sponsored by a patreon')
      }
    }else{
      if(tempCmd && Cmds[tempCmd]){
        if(patreon){
          await Cmds[tempCmd](obj, patreon, opt)
        }else{
          HP.ReplyMsg(obj, 'This is only avaliable to patreons')
        }
      }else{
        HP.ReplyMsg(obj, {content: (tempCmd ? '**'+tempCmd+'** command not recongnized':'command not provided')})
      }
    }
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
