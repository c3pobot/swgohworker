'use strict'
const { RedisWrapper, MongoWrapper } = require('dbwrapper')

global.numeral = require('numeral')
global.sorter = require('json-array-sorter')

global.CmdMap = 0
global.basicCmdAllowedServers = []
global.botSettings = {}
global.debugMsg = +process.env.DEBUG || 0
global.gameData = {}
global.gameDataReady = 0
global.gameVersion = ''
global.poServerList = []
global.syncGuilds = []

global.mongo = new MongoWrapper({
  url: 'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@'+process.env.MONGO_HOST+'/',
  authDb: process.env.MONGO_AUTH_DB,
  appDb: process.env.MONGO_DB,
  repSet: process.env.MONGO_REPSET
})

global.redis = new RedisWrapper({
  host: process.env.REDIS_SERVER,
  port: process.env.REDIS_PORT,
  passwd: process.env.REDIS_PASS
})
global.webBrowser = 0
global.HP = require('./helpers')
global.Client = require('./client')
global.FT = require('./format')
global.MSG = require('discordmsg')
global.statEnum = require('./statEnum')
