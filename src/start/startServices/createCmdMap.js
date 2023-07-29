'use strict'
const CreateCmdMap = async()=>{
  try{
    const obj = (await mongo.find('slashCmds', {_id: 'swgoh'}))[0]
    if(obj?.cmdMap) CmdMap = obj.cmdMap
    setTimeout(CreateCmdMap, 60000)
  }catch(e){
    console.error(e);
    setTimeout(CreateCmdMap, 5000)
  }
}
module.exports = CreateCmdMap
