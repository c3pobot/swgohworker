'use strict'
const GetNumShards = require('./getNumShards')
const CreateCmdMap = require('./createCmdMap')
const CheckAPIReady = require('./checkAPIReady')
const UpdateBotSettings = require('./updateBotSettings')
const UpdateSyncGuilds = require('./updateSyncGuilds')
const SaveSlashCmds = require('./cmd2array')
const StartQue = require('./startQue')
const StartServices = async()=>{
  try{
    console.log(process.env.POD_NAME)
    if(process.env.POD_NAME?.toString().endsWith("0")) await SaveSlashCmds(baseDir+'/src/cmds', 'swgoh')
    await GetNumShards()
    await CreateCmdMap()
    await UpdateBotSettings()
    await CheckAPIReady()
    await UpdateSyncGuilds()
    StartQue()
  }catch(e){
    console.error(e);
    setTimeout(StartServices, 5000)
  }
}
module.exports = StartServices
