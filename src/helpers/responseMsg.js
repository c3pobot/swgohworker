'use strict'
const replyMsg = require('./replyMsg')
module.exports = async(obj = {}, content)=>{
  try{
    await replyMsg(obj, content, 'POST')
  }catch(e){
    throw(e)
  }
}
