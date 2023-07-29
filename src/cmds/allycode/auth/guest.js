'use strict'
const SendLink = (dId, allyCode)=>{
  try{
    let msgToSend = "EA TOS link: <https://tos.ea.com/legalapp/WEBTERMS/US/en/PC/>\n"
    msgToSend += "To link your discordId to your swgoh game account that has been linked to an andorid guest account click on the provided link below\n"
    msgToSend += "By using the link below you will be allowing a discord bot to login to your"
    msgToSend += " Star Wars Galaxy of Heroes Account on your behalf. This may be in violation of the ea tos\n"
    msgToSend += "if you continue you do so at your own risk\n"
    msgToSend += 'Account Link : '+process.env.GOOG_REDIRECT_URI+'/guestAuth'
    MSG.SendDM(dId, {content: msgToSend})
  }catch(e){
    console.log(e)
  }
}
module.exports = async(obj, opt = [])=>{
  try{
    let msg2send = {content: 'Your allyCode is not linked to your discord id'}
    const dObj = await HP.GetDiscordAC(obj.member.user.id, opt)
    if(dObj && dObj.allyCode){
      msg2send.content = 'I have sent you a DM with info'
      SendLink(obj.member.user.id, dObj.allyCode)
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.error(e)
    HP.ReplyError(obj)
  }
}
