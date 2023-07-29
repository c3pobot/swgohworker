'use strict'
module.exports = async(obj, patreon, opt)=>{
  try{
    let allyCode, chId, channelPerm = 1, msg2send = {content: 'You did not provide the correct information'}, count = 0
    if(patreon.users) count += +patreon.users.length
    if(patreon.guilds) count += +patreon.guilds.length * 50
    if(obj.confirm && obj.confirm.allyCode) allyCode = +obj.confirm.allyCode
    if(!allyCode && opt){
      if(opt.find(x=>x.name == 'user')){
        const dObj = (await mongo.find('discordId', {_id: opt.find(x=>x.name == 'user').value}))[0]
        if(dObj && dObj.allyCodes && dObj.allyCodes.length > 0){
          if(dObj.allyCodes.length == 1){
            if(dObj.allyCodes[0].allyCode) allyCode = dObj.allyCodes[0].allyCode
          }else{
            let usrname
            if(obj.data.resolved && obj.data.resolved.members && obj.data.resolved.members[opt.find(x=>x.name == 'user').value] && obj.data.resolved.members[opt.find(x=>x.name == 'user').value].nick){
              usrname = obj.data.resolved.members[opt.find(x=>x.name == 'user').value].nick
            }else{
              usrname = obj.data.resolved.users[opt.find(x=>x.name == 'user').value].username
            }
            const embedMsg = {
              content: 'There are multiple allyCodes for '+(usrname ? '**@'+usrname+'**':'that user')+'. Which one do you want to add?',
              components: [],
              flags: 64
            }
            let x = 0
            for(let i in dObj.allyCodes){
              if(!embedMsg.components[x]) embedMsg.components[x] = { type:1, components: []}
              embedMsg.components[x].components.push({
                type: 2,
                label: dObj.allyCodes[i].name+' ('+dObj.allyCodes[i].allyCode+')',
                style: 1,
                custom_id: JSON.stringify({id: obj.id, allyCode: dObj.allyCodes[i].allyCode})
              })
              if(embedMsg.components[x].components.length == 5) x++;
            }
            await HP.ButtonPick(obj, embedMsg)
          }
        }
      }else{
        if(opt.find(x=>x.name == 'allycode')) allyCode = opt.find(x=>x.name == 'allycode').value.trim().replace(/-/g, '')
      }
      if(opt.find(x=>x.name == 'channel')) chId = opt.find(x=>x.name == 'channel').value
    }
    if(chId){
      const checkPerm = await MSG.GetChannel(chId)
      if(!checkPerm || !checkPerm.id) channelPerm = 0
    }
    if(channelPerm){
      if(allyCode){
        msg2send.content = 'Error getting player info for **'+allyCode+'**'
        const pObj = await Client.post('queryPlayer', {allyCode: allyCode.toString()}, null)
        if(pObj && pObj.guildId){
          msg2send.content = 'Guild **'+pObj.guildName+'** was added to your list'
          if(chId) msg2send.content += ' and will use <#'+chId+'> as log channel'
          if(patreon.guilds && patreon.guilds.filter(x=>x.id == pObj.guildId).length > 0){
            const tempGuild = {id: pObj.guildId, name: pObj.guildName}
            if(chId){
              tempGuild.chId = chId
              tempGuild.sId = obj.guild_id
            }
            await mongo.pull('patreon', {_id: patreon._id}, {guilds: {id: pObj.guildId}})
            await mongo.push('patreon', {_id: patreon._id}, {guilds: tempGuild})
          }else{
            if(patreon.maxAllyCodes >= (count + 50)){
              const tempGuild = {id: pObj.guildId, name: pObj.guildName}
              if(chId){
                tempGuild.chId = chId
                tempGuild.sId = obj.guild_id
              }
              await mongo.push('patreon', {_id: patreon._id}, {guilds: tempGuild})
            }else{
              msg2send.content = 'You are only allowed to register **'+patreon.maxAllyCodes+'** and you already have **'+count+'**.\nNote a guild counts as 50'
            }
          }
        }
      }
    }else{
      msg2send.content = 'Sorry i do not have permissions to view <#'+chId+'>. You need to fix this before you can use that channel'
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
