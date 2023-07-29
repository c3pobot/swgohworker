'use strict'
module.exports = async(obj)=>{
  try{
    let guildOwner, username
    const guildInfo = await MSG.GetDiscordGuild(obj.guild_id)
    if(guildInfo && guildInfo.owner_id) guildOwner = await MSG.GetGuildMember(obj.guild_id, guildInfo.owner_id)
    if(guildOwner && guildOwner.user) username = (guildOwner.nick ? guildOwner.nick:guildOwner.user.username)
    let msg2Send = '>>> **Server Admin Error**\nYou are not authorized to run Admin commands.\n'
    msg2Send += 'You must be the Discord Server Owner or have a role that was added with the `<BOTPREFIX>admin add` command\n'
    msg2Send += 'The Discord Server owner is : `@'+(username ? username:'UNKNOWN')+'`\n'
    msg2Send += 'You can use the `/admin list` command to see which @roles have been added'
    HP.ResponseMsg(obj, {content: msg2send})
  }catch(e){
    console.error(e)
  }
}
