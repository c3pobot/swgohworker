'use strict'
const log = require('logger')
const replyMsg = require('./replyMsg')
module.exports = async(obj = {})=>{
  try{
    await replyMsg(obj.token, {content: 'Error occured'}, 'PATCH')
  }catch(e){
    throw(e)
  }
}
