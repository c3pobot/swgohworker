'use strict'
const enum_stars = require('./enumStars')
const modifyUnit = (unit, gLevel = 0, rLevel = 0, rarity = 0)=>{
  const tempUnit = JSON.parse(JSON.stringify(unit))
  if(tempUnit){
    delete tempUnit.stats
    delete tempUnit.gp
    tempUnit.definitionId = tempUnit.definitionId.split(':')[0] + ':'+(enum_stars[rarity] ? enum_stars[rarity]:'SEVEN_STAR')
    if(rarity) tempUnit.currentRarity = rarity
    if(tempUnit.relic && (gLevel || rLevel)){
      tempUnit.equipment = []
      if(gLevel){
        tempUnit.currentTier = gLevel
        tempUnit.relic.currentTier = (gLevel === 13 ? 1:0)
      }
      if(rLevel > 2){
        tempUnit.currentTier = 13
        tempUnit.relic.currentTier = rLevel
      }
    }
    return tempUnit
  }
}
module.exports = async(roster = [], uInfo = {}, gLevel = 0, rLevel = 0, rarity = 0)=>{
  try{
    let units = [], unit, tempUnit = roster.find(x=>x.definitionId.startsWith(uInfo.baseId + ':'))
    if(tempUnit){
      tempUnit = await modifyUnit(tempUnit, gLevel, rLevel, rarity)
      if(tempUnit) units.push(tempUnit)
    }
    if(tempUnit && uInfo.combatType === 2 && uInfo.crew?.length > 0){
      for(let i in uInfo.crew){
        let tempCrew = roster.find(x=>x.definitionId.startsWith(uInfo.crew[i]+':'))
        if(tempCrew) tempCrew = await modifyUnit(tempCrew, gLevel, rLevel, rarity)
        if(tempCrew) unit.push(tempCrew)
      }
    }
    if(units?.length > 0){
      units = await Client.stats(units)
      if(units?.length > 0) unit = units.find(x=>x.definitionId.startsWith(uInfo.baseId + ':'))
    }
    return unit
  }catch(e){
    console.error(e)
  }
}
