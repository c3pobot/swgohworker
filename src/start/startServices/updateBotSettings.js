'use strict'
const UpdateBotSettings = async()=>{
  try{
    const obj = (await mongo.find('botSettings', {_id: "1"}))[0]
    if(obj) botSettings = obj
    setTimeout(UpdateBotSettings, 60000)
  }catch(e){
    setTimeout(UpdateBotSettings, 5000)
    console.error(e)
  }
}
module.exports = UpdateBotSettings
