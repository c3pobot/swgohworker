'use strict'
const Cmds = {}
Cmds.google = require('./google')
Cmds.guest = require('./guest')
Cmds.remove = require('./remove')
module.exports = async(obj, opts = [])=>{
  try{
    let tempCmd, opt = []
    for(let i in opts){
      if(Cmds[opts[i].name]){
        tempCmd = opts[i].name
        if(opts[i].options) opt = opts[i].options;
        break;
      }
    }
    if(tempCmd && Cmds[tempCmd]){
      await Cmds[tempCmd](obj, opt)
    }else{
      HP.ReplyMsg(obj, {content: 'command not recongnized'})
    }
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
