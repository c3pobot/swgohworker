'use strict'
module.exports = async(sId, dId)=>{
  try{
    let usrname
    const usr = await MSG.GetGuildMember(sId, dId)
    if(usr && usr.user){
      usrname = usr.user.username
      if(usr.nick) usrname = usr.nick
    }
    return usrname
  }catch(e){
    console.error(e)
  }
}
