'use strict'
const ReadFiles = require('./readFiles')
const GetCmdArray = async(dir, dbKey)=>{
  try{
    const cmdArray = await ReadFiles(dir, dbKey)
    if(cmdArray){
      await mongo.rep('slashCmds', {_id: dbKey}, cmdArray)
      console.log('saved '+dbKey+' cmds to mongo')
    }else{
      console.log('Did not find any commands. Will try again in 5 seconds')
      setTimeout(()=>GetCmdArray(dir, dbKey), 5000)
    }
  }catch(e){
    console.error(e)
    setTimeout(()=>GetCmdArray(dir, dbKey), 5000)
  }
}
module.exports = GetCmdArray
