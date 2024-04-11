'use strict'
const replyMsg = require('./replyMsg')
module.exports = async(obj = {}, content, method = 'PATCH')=>{
  try{
    await redis.setTTL('component-'+obj.id, obj, 600)
    await replyMsg(obj, content, method)
  }catch(e){
    throw(e)
  }
}
