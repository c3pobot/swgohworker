'use strict'
module.exports = async(id)=>{
  try{
    let gObj = await redis.get('gId-'+id)
    if(!gObj){
      const guild = await Client.post('queryGuild',{guildId: id}, null)
      if(guild){
        gObj = {
          guildId: id,
          guildName: guild.guild.profile.name
        }
        redis.set('gId-'+id, gObj)
      }
    }
    return gObj
  }catch(e){
    console.error(e)
  }
}
