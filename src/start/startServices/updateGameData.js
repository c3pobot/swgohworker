'use strict'
const UpdateGameData = async()=>{
  try{
    const obj = (await mongo.find('botSettings', {_id: 'gameData'}))[0]
    if(obj?.version !== gameVersion && obj?.data){
      console.log('Setting new gameData to '+obj.version)
      gameVersion = obj.version;
      gameData = obj.data
      HP.UpdateUnitsList()
      gameDataReady = 1
    }
    setTimeout(UpdateGameData, 5000)
  }catch(e){
    console.log(e)
    setTimeout(UpdateGameData, 5000)
  }
}
module.exports = UpdateGameData
