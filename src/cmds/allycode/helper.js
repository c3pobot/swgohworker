'use strict'
const Cmds = {}
Cmds.GetUnitCheck = async(roster)=>{
  try{
    let returnUnit, tempRoster
    if(roster.filter(x=>x.equippedStatMod.length == 0).length > 0) tempRoster = roster.filter(x=>x.equippedStatMod.length == 0)
    if(!tempRoster && roster.filter(x=>x.currentTier < 10 && x.equippedStatMod.length == 6).length > 0) tempRoster = roster.filter(x=>x.currentTier < 10 && x.equippedStatMod.length == 6)
    if(!tempRoster) tempRoster = roster.filter(x=>x.equippedStatMod.length == 6)
    if(tempRoster && tempRoster.length > 0){
      const randomIndex = Math.floor(Math.random() * ((+tempRoster.length - 1) - 0 + 1)) + 0
      if(tempRoster[randomIndex]) returnUnit = tempRoster[randomIndex]
    }
    return returnUnit
  }catch(e){
    console.log(e)
  }
}
Cmds.VerifyUnit = async(playerId, roster)=>{
  try{
    let auth = 0
    const vObj = (await mongo.find('acVerify', {_id: playerId}))[0]
    if(vObj){
      const uObj = roster.find(x=>x.definitionId == vObj.defId)
      if(uObj){
        if(vObj.verify == 'add'){
          if(uObj.equippedStatMod.length == 2){
            for(let i in uObj.equippedStatMod){
              if(uObj.equippedStatMod[i].primaryStat.stat.unitStatId == 48 || uObj.equippedStatMod[i].primaryStat.stat.unitStatId == 49) auth++
            }
          }
        }else{
          if(+vObj.mods.length - +uObj.equippedStatMod.length == 2) auth = 2
        }
      }
    }
    return auth
  }catch(e){
    console.log(e)
  }
}
module.exports = Cmds
