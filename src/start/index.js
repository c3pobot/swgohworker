'use strict'
if(!process.env.CMD_QUE_NAME) process.env.CMD_QUE_NAME = 'swgoh'
require('src/globals')
require('src/expressServer')
const StartServices = require('./startServices')

const InitRedis = async()=>{
  try{
    await redis.init()
    const redisStatus = await redis.ping()
    if(redisStatus == 'PONG'){
      console.log('redis connection successful...')
      CheckMongo()
    }else{
      console.log('redis connection error. Will try again in 5 seconds...')
      setTimeout(InitRedis, 5000)
    }
  }catch(e){
    console.error('redis connection error. Will try again in 5 seconds...')
    setTimeout(InitRedis, 5000)
  }
}
const CheckMongo = async()=>{
  const status = await mongo.init();
  if(status === 1){
    console.log('Mongo connection successful...')
    if(+process.env.ALLOW_ALL_CUSTOM_REACTIONS > 0){
      gameDataReady = 1
    }else{
      StartServices()
    }
  }else{
    console.log('Mongo error. Will try again in 10 seconds')
    setTimeout(()=>CheckMongo(), 5000)
  }
}
InitRedis()
