'use stict'
const fetch = require('node-fetch')
const path = require('path')
const BOT_BRIDGE_URI = process.env.BOT_BRIDGE_URI
const parseResponse = async(res)=>{
  try{
    if(!res) return
    if (res?.status?.toString().startsWith('5')) {
      throw('Bad status code '+res.status)
    }
    let body

    if (res?.status === 204) {
      body = null
    } else if (res?.headers?.get('Content-Type')?.includes('application/json')) {
      body = await res?.json()
    } else {
      body = await res?.text()
    }
    if(!body) body = res?.status
    return {
      status: res?.status,
      body: body
    }
  }catch(e){
    throw(e);
  }
}
const fetchRequest = async(uri, opts = {})=>{
  try{
    let res = await fetch(uri, opts)
    return await parseResponse(res)
  }catch(e){
    console.log(e?.error)
    if(e?.error) return {error: e.error, message: e.message, type: e.type}
    if(e?.status) return await parseResponse(e)
    throw(e)
  }
}
const requestWithRetry = async(uri, opts = {}, count = 0)=>{
  try{
    let res = await fetchRequest(uri, opts)
    if(res?.error === 'FetchError'){
      if(count < 10){
        count++
        return await requestWithRetry(uri, opts, count)
      }else{
        console.log('Tried 10 times with error ...')
        console.log(res)
      }
    }
    return res
  }catch(e){
    throw(e)
  }
}
module.exports = async(cmd, opts = {})=>{
  try{
    let payload = {method: 'POST', timeout: 60000, compress: true, headers: {"Content-Type": "application/json"}}
    payload.body = JSON.stringify({ ...opts, ...{ cmd: cmd } })
    let res = await requestWithRetry(path.join(BOT_BRIDGE_URI, 'cmd'), payload)
    if(res?.body) return res.body
    throw(res)
  }catch(e){
    throw(e);
  }
}
