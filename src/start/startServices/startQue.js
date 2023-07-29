'use strict'
const QueWrapper = require('quewrapper')
const cmdQueOpts = {
  queName: process.env.CMD_QUE_NAME || 'swgoh',
  numJobs: +process.env.NUM_JOBS || 1,
  queOptions: {
    redis: {
      host: process.env.REDIS_SERVER,
  		port: +process.env.REDIS_PORT,
  		password: process.env.REDIS_PASS
    }
  },
  localQue: redis,
  localQueKey: process.env.LOCAL_QUE_KEY
}
if(process.env.PRIVATE_WORKER) cmdQueOpts.queName += 'Private'
const CmdQue = new QueWrapper(cmdQueOpts)
const StartQue = ()=>{
  try{
    if(gameDataReady && CmdMap){
      CmdQue.start()
    }else{
      setTimeout(StartQue, 5000)
    }
  }catch(e){
    console.error(e);
    setTimeout(StartQue, 5000)
  }
}
module.exports = StartQue
