'use strict'
const log = require('logger')
const { WebHookMsg } = require('./discordmsg')
module.exports = async(obj = {}, msg)=>{
  try{
    await WebHookMsg(obj.token, {content: msg ? msg:'Here we go again....', components:[]}, 'PATCH')
  }catch(e){
    log.error(e)
  }
}
