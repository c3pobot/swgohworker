'use strict'
module.exports = async(obj, allyCode)=>{
  try{
    console.error('Google Token Error for allyCode: '+allyCode)
    await HP.ReplyMsg(obj, {content: 'Your google auth has been revoked or expired. Please re auth the bot using the `/allycode auth google` command'})
  }catch(e){
    console.error(e)
  }
}
