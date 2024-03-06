'use strict'
module.exports = async(obj, patreon, opt)=>{
  try{
    let guildId, gObj, msg2send = {content: 'You do not have any guilds configured'}
    if(patreon.guilds && patreon.guilds.length > 0){
      if(obj.confirm && obj.confirm.guildId) guildId = obj.confirm.guildId
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
            content: 'Which guild do you want to remove?',
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
        await mongo.pull('patreon', {_id: patreon._id}, {guilds: {id: gObj.id}})
        msg2send.content = 'Guild '+(gObj.name ? '**'+gObj.name+'** ':'')+' was removed from your list.'
      }
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
