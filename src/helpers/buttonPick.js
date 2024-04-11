'use strict'
const replyMsg = require('./replyMsg')
module.exports = async(obj = {}, msg, method = 'PATCH')=>{
  try{
    await redis.setTTL('button-'+obj.id, obj, 600)
    await replyMsg(obj, msg, method)
  }catch(e){
    throw(e)
  }
}
