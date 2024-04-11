'use strict'
const discordhelper = require('discordhelper')
const swgohhelper = require('swgohhelper')
const Cmds = {...discordhelper,...swgohhelper}

Cmds.AdminNotAuth = require('./adminNotAuth')
Cmds.AddShardCmds = require('./addShardCmds')
Cmds.arrayToObject = require('./arrayToObject')

Cmds.BotRequest = require('botrequest')
Cmds.buttonPick = require('./buttonPick')

Cmds.calcFinalStats = require('./calcFinalStats')
Cmds.calcGuildStats = require('./calcGuildStats')
Cmds.calcRosterStats = require('./calcRosterStats')
Cmds.calcUnitStats = require('./calcUnitStats')
Cmds.checkBotOwner = require('./checkBotOwner')
Cmds.checkGuide = require('./checkGuide')
Cmds.checkGuildAdmin = require('./checkGuildAdmin')
Cmds.checkRaid = require('./checkRaid')

Cmds.CheckServerAdmin = require('./checkServerAdmin')
Cmds.CheckShardAdmin = require('./checkShardAdmin')
Cmds.CheckSuperAdmin = require('./checkSuperAdmin')
Cmds.checkUnitMats = require('./checkUnitMats')
Cmds.confirmButton = require('./confirmButton')
Cmds.CreateIntialMessage = require('./createIntialMessage')

Cmds.debugMsg = require('./debugMsg')

Cmds.EditUnit = require('./editUnit')
Cmds.enum = require('./enum')
Cmds.enumPerms = require('./enumPerms')

Cmds.FetchGuild = require('./fetchGuild')
Cmds.FetchPlayer = require('./fetchPlayer')

Cmds.GetFakeUnit = require('./getFakeUnit')
Cmds.GetGuildName = require('./getGuildName')
Cmds.GetGuildMemberName = require('./getGuildMemberName')
Cmds.getGuildShardId = require('./getGuildShardId')
Cmds.GetImg = require('./getScreenShot')
Cmds.GetOffenseStat = require('./getOffenseStat')
Cmds.getOptValue = require('./getOptValue')
Cmds.GetPlayerAC = require('./getPlayerAC')
Cmds.GetPlayerId = require('./getPlayerId')
Cmds.GetRole = require('./getRole')
Cmds.GetScreenShot = require('./getScreenShot')
Cmds.GetShard = require('./getShard')
Cmds.GetTopUnits = require('./getTopUnits')
Cmds.GetWebUnitStats = require('./getWebUnitStats')
Cmds.getRole = require('./getRole')
Cmds.getUnitName = require('./getUnitName')

Cmds.JoinImages = require('./joinImages')

Cmds.ModifyUnit = require('./modifyUnit')
Cmds.notifyBotOwner = require('./notifyBotOwner')



Cmds.RemoveShardCmds = require('./removeShardCmds')
Cmds.replyButton = require('./replyButton')
Cmds.replyComponent = require('./replyComponent')
Cmds.replyError = require('./replyError')
Cmds.replyMsg = require('./replyMsg')
Cmds.ReplyTokenError = require('./replyTokenError')
Cmds.responseMsg = require('./responseMsg')

Cmds.sendMsg = require('./sendMsg')
Cmds.ShowRotationSchedule = require('./showRotationSchedule')

Cmds.truncateString = require('./truncateString')
module.exports = Cmds
