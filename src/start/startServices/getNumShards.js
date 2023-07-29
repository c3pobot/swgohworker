'use strict'
const fetch = require('node-fetch')
const parseResoponse = async(res)=>{
  try{
    if(!res) return
    if (res?.status?.toString().startsWith('5')) {
      throw('Bad status code '+res.status)
    }
    let body
    if (res?.headers?.get('Content-Type')?.includes('application/json')) {
      body = await res?.json()
    } else {
      body = await res?.text()
    }
    if(!body) body = res?.status
    return body
  }catch(e){
    console.error(e);
  }
}
module.exports = async()=>{
  try{
    let payload = { headers: { 'Content-Type': 'application/json'}, timeout: 30000, compress: true, method: 'POST' }
    payload.body = JSON.stringify({ cmd: 'getNumShards'})
    let res = await fetch(process.env.BOT_BRIDGE_URI+'/cmd', payload)
    let obj = await parseResoponse(res)
    console.log(obj)
    if(obj?.totalShards){
      process.env.NUM_SHARDS = obj.totalShards
      console.log('Setting num shards to '+process.env.NUM_SHARDS)
    }
  }catch(e){
    console.error(e);
  }
}
