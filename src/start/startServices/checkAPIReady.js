'use strict'
const UpdateGameData = require('./updateGameData')
const CheckAPIReady = async()=>{
  const obj = await Client.post('metadata')
  if(obj?.latestGamedataVersion){
    console.log('API is ready ..')
    UpdateGameData()
  }else{
    console.log('API is not ready. Will try again in 5 seconds')
    setTimeout(()=>CheckAPIReady(), 5000)
  }
}
module.exports = CheckAPIReady
