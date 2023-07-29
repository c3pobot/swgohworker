'use strict'
module.exports = async(obj, patreon, opt)=>{
  try{
    let guildId, gObj, chId, channelPerm = 1, msg2send = {content: 'You do not have any guilds configured'}
    if(patreon.guilds && patreon.guilds.length > 0){
      if(opt && opt.find(x=>x.name == 'channel')) chId = opt.find(x=>x.name == 'channel').value
      if(obj.confirm && obj.confirm.guildId) guildId = obj.confirm.guildId
      if(chId){
        const checkPerm = await MSG.GetChannel(chId)
        if(!checkPerm || !checkPerm.id) channelPerm = 0
      }
      if(channelPerm){
        MSG.WebHookMsg(obj.token, {content: 'Getting guild names..'}, 'PATCH')
        msg2send.content = 'Error getting guild Information'
        const guilds = []
        for(let i in patreon.guilds){
          if(!patreon.guilds[i].name){
            const guild = await HP.GetGuildName(patreon.guilds[i].id)
            if(guild && guild.guildName) patreon.guilds[i].name = guild.guildName
          }
          if(patreon.guilds[i].name) guilds.push(patreon.guilds[i])
        }
        if(!guildId && guilds.length > 0){
          const embedMsg = {
            content: 'Which guild do you want to change?',
            components: [],
            flags: 64
          }
          let x = 0
          for(let i in guilds){
            if(!embedMsg.components[x]) embedMsg.components[x] = { type:1, components: []}
            embedMsg.components[x].components.push({
              type: 2,
              label: guilds[i].name,
              style: 1,
              custom_id: JSON.stringify({id: obj.id, guildId: guilds[i].id})
            })
            if(embedMsg.components[x].components.length == 5) x++;
          }
          await HP.ButtonPick(obj, embedMsg)
        }
        if(guildId && guilds.find(x=>x.id == guildId)) gObj = guilds.find(x=>x.id == guildId)
        if(gObj){
          if(chId){
            gObj.chId = chId
            gObj.sId = obj.guild_id
          }else{
            delete gObj.chId
            delete gObj.sId
          }
          await mongo.pull('patreon', {_id: patreon._id}, {guilds: {id: gObj.id}})
          await mongo.push('patreon', {_id: patreon._id}, {guilds: gObj})
          msg2send.content = 'Guild '+(gObj.name ? '**'+gObj.name+'** ':'')+' was updated.'
        }
      }else{
        msg2send.content = 'Sorry i do not have permissions to view <#'+chId+'>. You need to fix this before you can use that channel'
      }
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
