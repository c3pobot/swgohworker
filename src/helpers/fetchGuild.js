'use strict'
module.exports = async(obj)=>{
  return await Client.post('fetchGuild', obj, null)
}
