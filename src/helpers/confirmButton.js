'use strict'
const replyMsg = require('./replyMsg')
module.exports = async(obj, msg)=>{
  try{
    await redis.setTTL('button-'+obj.id, obj, 600)
    await replyMsg(obj?.token, {
      content: msg,
      components: [{
        type: 1,
        flags: 64,
        components: [
          {
            type: 2,
            label: 'Yes',
            style: 3,
            custom_id: JSON.stringify({id: obj.id, response: 'yes'})
          },
          {
            type: 2,
            label: 'No',
            style: 4,
            custom_id: JSON.stringify({id: obj.id, response: 'no'})
          }
        ]
      }]
    }, 'PATCH')
  }catch(e){
    throw(e)
  }
}
