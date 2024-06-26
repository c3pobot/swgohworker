'use strict'
const { formatWebUnit } = require('src/format')
const AddRequirement = async(obj = {}, type, value)=>{
  try{
    if(type && value){
      if(!obj.requirement){
        obj.requirement = type+''+value
      }else{
        obj.requirement += '<br>'+type+''+value
      }
    }
  }catch(e){
    throw(e);
  }
}
module.exports = (units = [], roster = [], combatType = 3, foundUnits = [], foundFactionUnits = [])=>{
  try{
    let res = []
    for(let i in units){
      let uInfo = unitList[units[i].baseId]
      if(foundUnits.filter(x=>x.baseId === units[i].baseId).length == 0 && foundFactionUnits.filter(x=>x.baseId === units[i].baseId).length === 0){
        if(uInfo.name && (combatType === 3 || uInfo?.combatType === combatType)){
          const pUnit = roster.find(x=>x.definitionId.startsWith(uInfo.baseId+':'))
          const tempObj = formatWebUnit(pUnit, uInfo)
          if(tempObj){
            tempObj.notMet = 0
            tempObj.equipment = pUnit?.equipment
            if(units[i].rarity > 1) tempObj.reqRarity = +units[i].rarity
            if(units[i].gp) tempObj.reqGP = +units[i].gp
            if(uInfo.combatType === 1 && units[i]?.gear?.value > 1){
              if(units[i].gear.name == 'gear') tempObj.reqGear = +units[i].gear.value
              if(units[i].gear.name == 'relic') tempObj.reqRelic = +units[i].gear.value
            }
            if(tempObj.reqRarity && tempObj.rarity < tempObj.reqRarity) tempObj.notMet++
            if(tempObj.reqGear && tempObj.gear < tempObj.reqGear) tempObj.notMet++
            if(tempObj.reqRelic && tempObj.relic < tempObj.reqRelic) tempObj.notMet++
            if(tempObj.reqRarity && tempObj.reqRarity > 1) AddRequirement(tempObj, tempObj.reqRarity.toString(), '*')
            if(tempObj.reqRelic){
              AddRequirement(tempObj, 'R', (+tempObj.reqRelic - 2).toString())
            }else{
              if(tempObj.reqGear) AddRequirement(tempObj, 'G', tempObj.reqGear.toString())
            }
            res.push(tempObj)
          }
        }
      }
    }
    return res
  }catch(e){
    throw(e);
  }
}
