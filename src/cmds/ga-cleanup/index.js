'use strict'
const Cmds = {}
Cmds['3v3'] = '3v3'
Cmds['5v5'] = '5v5'
const cleanup = require('./cleanup')
module.exports = async(obj = {})=>{
  try{
    let mode, opt = []
    if(obj.data.options){
      for(let i in obj.data.options){
        if(Cmds[obj.data.options[i].name]){
          mode = obj.data.options[i].name
          if(obj.data.options[i].options) opt = obj.data.options[i].options
          break;
        }
      }
    }
    if(mode){
      await cleanup(obj, opt, mode)
    }else{
      HP.ReplyMsg(obj, {content: 'command not recongnized'})
    }
  }catch(e){
    console.error(e);
    HP.ReplyError(obj)
  }
}
