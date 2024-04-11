'use strict'

const log = require('logger')
if(!process.env.CMD_QUE_NAME) process.env.CMD_QUE_NAME = 'swgoh'
require('src/globals')
//require('src/expressServer')
const SaveSlashCmds = require('cmd2array')
const UpdateBotSettings = require('./services/updateBotSettings')
const { cmdMapReady } = require('./helpers/cmdMap')
const updateGameData = require('./updateGameData')
const UpdateSyncGuilds = require('./services/updateSyncGuilds')
const CmdQue = require('./cmdQue')

const CheckRedis = ()=>{
  let status = redis.status()
  if(status){
    CheckMongo()
    return
  }
  setTimeout(CheckRedis, 5000)
}
const CheckMongo = ()=>{
  let status = mongo.status()
  if(status){
    CheckApi()
    return
  }
  setTimeout(CheckMongo, 5000)
}
const CheckApi = async()=>{
  try{
    let obj = await Client.post('metadata')
    if(obj?.latestGamedataVersion){
      log.info('API is ready...')
      CheckGameData()
      return
    }
    setTimeout(CheckApi, 5000)
  }catch(e){
    log.error(e)
    setTimeout(CheckApi, 5000)
  }
}
const CheckGameData = async()=>{
  try{
    let status = updateGameData.status()
    if(status){
      CheckCmdMap()
      return
    }
    setTimeout(CheckGameData, 5000)
  }catch(e){
    log.error(e)
    setTimeout(CheckGameData, 5000)
  }
}
const CheckCmdMap = async()=>{
  try{
    if(process.env.POD_NAME?.toString().endsWith("0")) await SaveSlashCmds(baseDir+'/src/cmds', 'swgoh')
    let status = cmdMapReady()
    if(status){
      await UpdateBotSettings()
      await UpdateSyncGuilds()
      CmdQue.start()
      return
    }
    setTimeout(CheckCmdMap, 5000)
  }catch(e){
    log.error(e)
    setTimeout(CheckCmdMap, 5000)
  }
}

CheckRedis()
