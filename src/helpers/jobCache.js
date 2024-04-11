'use strict'
const log = require('logger')
const Cache = require('node-cache')
const JobCache = new Cache({stdTTL: 1800, checkperiod: 60})
const Cmds = {}
Cmds.addJob = async(obj)=>{
  try{
    if(obj?.id) await JobCache.set(obj.id, obj)
  }catch(e){
    log.error(e)
  }
}
Cmds.getJob = async(obj)=>{
  try{
    if(obj?.id){
      let job = await JobCache.take(obj.id)
      return job
    }
  }catch(e){
    log.error(e);
  }
}
Cmds.checkJob = async(obj)=>{
  try{
    if(obj?.id) return await JobCache.get(obj.id)
  }catch(e){
    log.error(e);
  }
}
Cmds.removeJob = async(jobId)=>{
  try{
    if(jobId) await JobCache.take(jobId)
  }catch(e){
    log.error(e);
  }
}
module.exports = Cmds
