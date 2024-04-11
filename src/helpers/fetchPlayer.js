'use strict'
const swgohClient = require('src/client')
module.exports = async(obj)=>{
  return await swgohClient.post('fetchPlayer', obj, null)
}
