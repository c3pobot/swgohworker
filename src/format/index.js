'use strict'
const modStat = {
  14:{
    base: 14,
    mod:21
  },
  15: {
    base:15,
    mod: 22
  },
  37: {
    base: 37,
    mod: 52
  },
  39:{
    base: 39,
    mod: 35,
  }
}
const CalcAllZeta = (obj, skills)=>{
	const returnObj = {
		all: 0,
		some: 0
	}
	const unitZetaTotal = Object.values(skills).filter(x=>x.zetaTier).length
	for(let i in obj){
		let zetaCount = 0
		for(let s in skills){
			if(skills[s].zetaTier){
				zetaCount += obj[i].skill.filter(x=>x.id == s && +(x.tier + 2) >= +skills[s].zetaTier).length
			}
		}
		if(zetaCount == unitZetaTotal){
			returnObj.all++
		}else{
			returnObj.some++
		}
	}
	return returnObj
}
const CalcGP = (obj, value, combatType)=>{
  let unitGp = 0
  const rosterSorted = sorter([{column: 'gp', order: 'descending'}], obj)
  const tempObj = rosterSorted.filter(x=>x.combatType == combatType).slice(0, (value - 1))
  return tempObj.reduce((acc, a)=>{
    return acc + a.gp;
  }, 0)
}
const CalcMods = (obj, min, max)=>{
  return obj.reduce((acu, u) => {
    return acu + u.equippedStatMod.reduce((acm, m) => {
      return acm + m.secondaryStat.filter(ss => ss.stat.unitStatId == 5 && ss.stat.statValueDecimal > min*10000 && ss.stat.statValueDecimal < max*10000).length
    }, 0)
  }, 0)
}
const CalcUnitRarity = (obj, rarity)=>{
  let i = rarity
  const rtnObj = {}
  for(i;i<8;i++){
    rtnObj[i] = obj.filter(x=>x.currentRarity == i).length
  }
  return rtnObj
}
const CalcUnitRelic = (obj)=>{
  const tempObj = {
    total: 0
  }
  for(let i in obj){
    if(obj[i].relic.currentTier > 2){
      tempObj.total++;
      const tempRelic = +obj[i].relic.currentTier - 2
      if(tempRelic > 4){
        if(tempObj[tempRelic]){
          tempObj[tempRelic]++;
        }else{
          tempObj[tempRelic] = 1
        }
      }
    }
  }
  return tempObj;
}
const CalcUnitUlt = (obj, id)=>{
  return obj.reduce((acc, a)=>{
    return acc+ a.purchasedAbilityId.filter(x=>x == id).length
  },0)
}
const FormatStats = (statId, base, mod)=>{
  let returnStat = ''
  if(statEnum.pct[statId]){
    returnStat = numeral(base*100).format('0.00')
    if(mod){
      returnStat += '('+numeral(mod*100).format('0.00')+')'
    }
  }else{
    returnStat = numeral(base).format('0,0')
    if(mod){
      returnStat += '('+numeral(mod).format('0,0')+')'
    }
  }
  return returnStat
}
const GetGAStats = (obj, stat)=>{
  let finalStat = 0
  let pctOveride = 0
  if(obj.base) finalStat = (obj.base[stat] || 0);
  if(obj.mods) finalStat += (obj.gear[stat] || 0) + (obj.mods[stat] || 0)
  if(obj.crew) finalStat += (obj.crew[stat] || 0)
  if(stat == 14 || stat == 15){
    pctOveride++
    if(obj.mods){
      if(stat == 14) finalStat += (obj.mods[21] || 0);
      if(stat == 15) finalStat += (obj.mods[22] || 0)
    }
  }
  if(statEnum.pct[stat] || pctOveride > 0){
    return numeral(finalStat * 100).format('0.0')
  }else{
    return numeral(finalStat).format('0,0')
  }
}
const GetGAZeta = (obj, uInfo) =>{

  let numZeta = +Object.values(uInfo.skills).filter(x=>x.zetaTier).length, count = 0
  for(let i in uInfo.skills){
    if(uInfo.skills[i].zetaTier){
      if(obj.skill && obj.skill.find(x=>x.id == i && +(x.tier + 2) >= +uInfo.skills[i].zetaTier)) count++;
    }
  }
  if(count == numZeta){
    return 'All'
  }else{
    if(count == 0){
      return 'None'
    }else{
      return 'Some'
    }
  }
}
const GetHigherStat = (stats, statInfo)=>{
  let pri = 0
  let sec = 0
  pri += (stats.base[statInfo.pri.id] || 0) + (stats.gear[statInfo.pri.id] || 0) + (stats.mods[GetModIndex(statInfo.pri.id)] || 0)
  sec += (stats.base[statInfo.sec.id] || 0) + (stats.gear[statInfo.sec.id] || 0) + (stats.mods[GetModIndex(statInfo.sec.id)] || 0)
  if(pri >= sec){
    return(statInfo.pri)
  }else{
    return(statInfo.sec)
  }
}
const GetModIndex = (baseId)=>{
  if(modStat[baseId]){
    return modStat[baseId].mod
  }else{
    return (baseId)
  }
}
const Cmds = require('swgohformatter')
Cmds.EmbedField = (nme, values, padLn, sep)=>{
  const obj = {
    name: nme,
    value: '```autohotkey\n'
  }
  for(let i in values) obj.value += i.toString().padEnd(padLn, ' ')+sep+' '+values[i]+'\n';
  obj.value += '```'
  return obj;
}
Cmds.FormatGAMods = (pObj, eObj)=>{
  const tempObj = {
    name: 'Mods',
    value: '```autohotkey\n'
  }
  tempObj.value += "R6 mods    :: " +numeral(pObj.sixModCount).format('0,0').padStart(10, ' ') + " vs " + numeral(eObj.sixModCount).format('0,0') + "\n";
  tempObj.value += "Mods +10   :: " +numeral(CalcMods(pObj.rosterUnit, 9, 15)).format('0,0').padStart(10, ' ') + " vs " + numeral(CalcMods(eObj.rosterUnit, 9, 15)).format('0,0') + "\n";
  tempObj.value += "Mods +15   :: " +numeral(CalcMods(pObj.rosterUnit, 14, 20)).format('0,0').padStart(10, ' ') + " vs " + numeral(CalcMods(eObj.rosterUnit, 14, 20)).format('0,0') + "\n";
  tempObj.value += "Mods +20   :: " +numeral(CalcMods(pObj.rosterUnit, 19, 25)).format('0,0').padStart(10, ' ') + " vs " + numeral(CalcMods(eObj.rosterUnit, 19, 25)).format('0,0') + "\n";
  tempObj.value += "Mods +25   :: " +numeral(CalcMods(pObj.rosterUnit, 24, 999)).format('0,0').padStart(10, ' ') + " vs " + numeral(CalcMods(eObj.rosterUnit, 24, 999)).format('0,0') + "\n";
  tempObj.value += "```";
  return tempObj
}
Cmds.FormatGAOverview = (pObj, eObj)=>{
  const tempObj = {
    name: 'Overview',
    value: '```autohotkey\n'
  }
  if(pObj && eObj && pObj.playerRating && eObj.playerRating && pObj.playerRating.playerSkillRating && eObj.playerRating.playerSkillRating){
    tempObj.value += "Skill      :: " + numeral(pObj.playerRating.playerSkillRating.skillRating).format('0,0').padStart(10, ' ') + ' vs ' + numeral(eObj.playerRating.playerSkillRating.skillRating).format('0,0')+'\n'
  }
  tempObj.value += "Total GP   :: " + numeral(pObj.gp).format('0,0').padStart(10, ' ') + " vs " + numeral(eObj.gp).format('0,0') + "\n";
  tempObj.value += "Char GP    :: " + numeral(pObj.gpChar).format('0,0').padStart(10, ' ') + " vs " + numeral(eObj.gpChar).format('0,0') + "\n";
  tempObj.value += "Ship GP    :: " + numeral(pObj.gpShip).format('0,0').padStart(10, ' ') + " vs " + numeral(eObj.gpShip).format('0,0') + "\n";
  tempObj.value += "G13        :: " + pObj.rosterUnit.filter(g => g.currentTier == 13).length.toString().padStart(10, ' ') + " vs " + eObj.rosterUnit.filter(g => g.currentTier == 13).length + "\n";
  tempObj.value += "G12        :: " + pObj.rosterUnit.filter(g => g.currentTier == 12).length.toString().padStart(10, ' ') + " vs " + eObj.rosterUnit.filter(g => g.currentTier == 12).length + "\n";
  tempObj.value += "G11        :: " + pObj.rosterUnit.filter(g => g.currentTier == 11).length.toString().padStart(10, ' ') + " vs " + eObj.rosterUnit.filter(g => g.currentTier == 11).length + "\n";
  tempObj.value += "Zeta's     :: " + pObj.zetaCount.toString().padStart(10, ' ') + " vs " + eObj.zetaCount + "\n"
  tempObj.value += "Char 65 GP :: " + numeral(CalcGP(pObj.rosterUnit, 65, 1)).format("0,0").padStart(10, ' ') + " vs " + numeral(CalcGP(eObj.rosterUnit, 65, 1)).format("0,0") + "\n"
  tempObj.value += "Char 80 GP :: " + numeral(CalcGP(pObj.rosterUnit, 80, 1)).format("0,0").padStart(10, ' ') + " vs " + numeral(CalcGP(eObj.rosterUnit, 80, 1)).format("0,0") + "\n"
  tempObj.value += "Ship 32 GP :: " + numeral(CalcGP(pObj.rosterUnit, 32, 2)).format("0,0").padStart(10, ' ') + " vs " + numeral(CalcGP(eObj.rosterUnit, 32, 2)).format("0,0") + "\n"
  tempObj.value += "```";
  return tempObj
}
Cmds.FormatGAQuality = (pObj, eObj) => {
  const tempObj = {
    name: 'Quality',
    value: '```autohotkey\n'
  }
  tempObj.value += 'Mods       :: ' +numeral(pObj.quality.mods).format('0.00').padStart(10, ' ') + ' vs ' + numeral(eObj.quality.mods).format('0.00') + '\n'
  tempObj.value += 'Gear       :: ' +numeral(pObj.quality.gear).format('0.00').padStart(10, ' ') + ' vs ' + numeral(eObj.quality.gear).format('0.00') + '\n'
  tempObj.value += 'Total      :: ' +numeral(pObj.quality.mods + pObj.quality.gear).format('0.00').padStart(10, ' ') + ' vs ' + numeral(eObj.quality.mods + eObj.quality.gear).format('0.00') + '\n'
  tempObj.value += 'Top 80 mod :: ' +numeral(pObj.quality.top).format('0.00').padStart(10, ' ') + ' vs ' + numeral(eObj.quality.top).format('0.00') + '\n'
  tempObj.value += '```'
  return tempObj;
}
Cmds.FormatGARelics = (pObj, eObj)=>{
  const tempObj = {
    name: 'Relics',
    value: '```autohotkey\n'
  }
  tempObj.value += "Total      :: " +numeral(pObj.rosterUnit.filter(r=>r.relic && r.relic.currentTier > 2 && r.combatType == 1).length).format('0,0').padStart(10, ' ') + " vs " + numeral(eObj.rosterUnit.filter(r=>r.relic && r.relic.currentTier > 2 && r.combatType == 1).length).format('0,0') + "\n";
  for (let i = 13; i > 6; i--) {
    const pRelic = pObj.rosterUnit.filter(r => r.relic && r.relic.currentTier == +i && r.combatType == 1).length
    const eRelic = eObj.rosterUnit.filter(r => r.relic && r.relic.currentTier == +i && r.combatType == 1).length
    if (+pRelic > 0 || +eRelic >0) tempObj.value += "R"+(+i - 2)+"         :: " +numeral(pRelic).format('0,0').padStart(10, ' ') + " vs " + numeral(eRelic).format('0,0') + "\n";
  }
  tempObj.value += "```";
  return tempObj
}
Cmds.FormatGAUnitBasic = (meUnit, enUnit, uInfo)=>{
  const tempObj = {
    name: uInfo.nameKey,
    value: '```autohotkey\n'
  }
  if(meUnit || enUnit){
    if (!meUnit) meUnit = {
      gp: 0,
      currentRarity: 0,
      currentTier: 0,
      relic: {
        currentTier: 0
      },
      stats: {}
    };
    if (!enUnit) enUnit = {
      gp: 0,
      currentRarity: 0,
      currentTier: 0,
      relic: {
        currentTier: 0
      },
      stats: {}
    };
    tempObj.value += "GP         :: " +numeral(meUnit.gp).format('0,0').padStart(10, ' ') + " vs " + numeral(enUnit.gp).format('0,0') + "\n"
    tempObj.value += "Rarity     :: " +numeral(meUnit.currentRarity).format("0").padStart(10, ' ') + " vs " + numeral(enUnit.currentRarity).format("0") + "\n";
    if(uInfo.combatType == 1) tempObj.value += "Gear/Relic :: " + (meUnit.currentTier < 13 ? 'G'+meUnit.currentTier : 'R0'+(meUnit.relic.currentTier - 2)).toString().padStart(10, ' ') + " vs " + (enUnit.currentTier < 13 ? 'G'+enUnit.currentTier : 'R0'+(enUnit.relic.currentTier - 2)) + "\n";
    tempObj.value += "Speed      :: " +GetGAStats(meUnit.stats, 5).padStart(10, ' ') + " vs " + GetGAStats(enUnit.stats, 5) + "\n";
    if(uInfo.combatType == 1 && Object.values(uInfo.skills).find(x=>x.isZeta == true)) tempObj.value += "Zetas      :: " + GetGAZeta(meUnit, uInfo).padStart(10, ' ') + " vs " + GetGAZeta(enUnit, uInfo) + "\n";
  }else{
    tempObj.value += 'Neither has this unit\n'
  }
  tempObj.value += '```'
  return tempObj
}
Cmds.FormatPlayerStat = async(unit = {}, statInfo = {}, sort = mod)=>{
  let obj = {
    sort: 0
  }
  let statId = 0, baseStat = 0, modStat = 0, statName, stats = unit?.stats, nameKey = unitList[unit.definitionId?.split(':')[0]]?.name || unit.definitionId?.split(':')[0]
  if(statInfo.statId > 0){
    if(statInfo.statId == 6){
      const uInfo = (await mongo.find('units', {_id: unit.definitionId?.split(':')[0]}, {offenseStatId: 1}))[0]
      if(unitList[unit.definitionId?.split(':')[0]]?.offenseStatId === 7){
        statId = 7
        statName = 'S'
      }else{
        statId = 6
        statName = 'P'
      }
    }else{
      statId = statInfo.statId
    }
  }else{
    const higherStat = GetHigherStat(stats, statInfo)
    statId = higherStat.id
    statName = higherStat.name
  }

  modStat = (stats.mods[GetModIndex(statId)] || 0)
  baseStat = (stats.base[statId] || 0) + (stats.gear[statId] || 0) + (modStat || 0)
  obj.value = FormatStats(statId, baseStat, modStat).padStart(statInfo.ln, ' ')+' : '+(statName ? statName+' ' : '')+''+nameKey
  if(sort == 'mod'){
    obj.sort = modStat
  }else{
    obj.sort = baseStat
  }
  return obj
}
Cmds.FormatPlayerStats = async(roster = [], statInfo = {}, sort = 'mod')=>{
  try{
    let res = []
    for(let i in roster){
      if(roster[i]?.stats){
        const tempObj = await FT.FormatPlayerStat(roster[i], statInfo, sort)
        if(tempObj) res.push(tempObj)
      }
    }
    if(res?.length > 0) res = await sorter([{ column: 'sort', order: 'descending' }], res)
    return res
  }catch(e){
    console.error(e)
  }
}
Cmds.FormatTWRecord = async(gObj, eObj)=>{
  try{
    let gWin = 0, gLoss = 0, eWin = 0, eLoss = 0, gLast = {status: 'W', time: 0}, eLast = {status: 'W', time: 0}
    if(gObj){
      for(let i in gObj){
        if(+gObj[i].score > +gObj[i].opponentScore){
          gWin++
          if(+gObj[i].endTimeSeconds > gLast.time){
            gLast.time = +gObj[i].endTimeSeconds
            gLast.status = 'W'
          }
        }else{
          gLoss++
          if(+gObj[i].endTimeSeconds > gLast.time){
            gLast.time = +gObj[i].endTimeSeconds
            gLast.status = 'L'
          }
        }
      }
    }
    if(eObj){
      for(let i in eObj){
        if(+eObj[i].score > +eObj[i].opponentScore){
          eWin++
          if(+eObj[i].endTimeSeconds > eLast.time){
            eLast.time = +eObj[i].endTimeSeconds
            eLast.status = 'W'
          }
        }else{
          eLoss++
          if(+eObj[i].endTimeSeconds > eLast.time){
            eLast.time = +eObj[i].endTimeSeconds
            eLast.status = 'L'
          }
        }
      }
    }
    const obj = {
      name: 'TW Record',
      value: '```autohotkey\n'
    }
    obj.value += 'Record : '
    obj.value += gWin+'-'+gLoss
    if(eObj) obj.value += ' vs '+eWin+'-'+eLoss
    obj.value += '\nLast   : '+gLast.status.padStart(3, ' ')
    if(eObj) obj.value += ' vs '+eLast.status
    obj.value += '\n```'
    return obj
  }catch(e){
    console.error(e)
  }
}
Cmds.GetIncModsets = async(obj)=>{
  const tempObj = {
    name: 'Incomplete mod sets',
    value: '```autohotkey\n'
  }
  const unsortedArray = []
  if(gameData && gameData.modDefData && gameData.modSetData){
    for(let i in obj){
      if(obj[i].equippedStatMod.length > 1){
        let tempCount = {}
        for(let m in obj[i].equippedStatMod){
          if(gameData.modDefData[obj[i].equippedStatMod[m].definitionId] && +gameData.modDefData[obj[i].equippedStatMod[m].definitionId].setId){
            if(!tempCount[gameData.modDefData[obj[i].equippedStatMod[m].definitionId].setId]){
              tempCount[gameData.modDefData[obj[i].equippedStatMod[m].definitionId].setId] = {
                count: 0,
                setCount: +gameData.modSetData[gameData.modDefData[obj[i].equippedStatMod[m].definitionId].setId].count
              }
            }
            if(tempCount[gameData.modDefData[obj[i].equippedStatMod[m].definitionId].setId]) tempCount[gameData.modDefData[obj[i].equippedStatMod[m].definitionId].setId].count++
          }
        }
        let countTemp = 0
        for(let c in tempCount){
          if(+tempCount[c].setCount != +tempCount[c].count){
            if(+tempCount[c].setCount == 4) countTemp++;
            if(+tempCount[c].setCount == 2){
              if(+tempCount[c].count == 1 || +tempCount[c].count == 3 || +tempCount[c].count == 5) countTemp++;
            }
          }
        }
        if(countTemp > 0){
          const unitName = await HP.GetUnitName(obj[i].definitionId.split(':')[0])
          unsortedArray.push({
            count: countTemp,
            unit: (unitName || obj[i].definitionId.split(':')[0])
          })
        }
      }
    }
  }
  tempObj.name += ' ('+unsortedArray.length+')'
  if(unsortedArray.length > 0){
    const sortedArray = await sorter([{ column: 'count', order: 'descending' }], unsortedArray)
    let modsArray = sortedArray
    if (sortedArray.length > 15) {
      modsArray = sortedArray.slice(0, 15)
    }
    for (let i in modsArray) tempObj.value += modsArray[i].unit + '\n'
  }else{
    tempObj.value += 'No units with incomplete modset\n'
  }
  tempObj.value += '```'
  return tempObj
}
Cmds.GetLowModPips = async(obj)=>{
  const tempObj = {
    name: 'Mods < 5*',
    value: '```autohotkey\n'
  }
  const unsortedArray = []
  if(gameData && gameData.modDefData){
    for(let i in obj){
      if(obj[i].equippedStatMod.length > 0){
        let tempCount = 0
        for(let m in obj[i].equippedStatMod) if(gameData.modDefData[obj[i].equippedStatMod[m].definitionId] && +gameData.modDefData[obj[i].equippedStatMod[m].definitionId].rarity < 5) tempCount++;
        if(tempCount > 0){
          const unitName = await HP.GetUnitName(obj[i].definitionId.split(':')[0])
          unsortedArray.push({
            count: tempCount,
            unit: (unitName || obj[i].definitionId.split(':')[0])
          })
        }
      }
    }
  }
  tempObj.name += ' ('+unsortedArray.length+')'
  if(unsortedArray.length > 0){
    const sortedArray = await sorter([{ column: 'count', order: 'descending' }], unsortedArray)
    let modsArray = sortedArray
    if (sortedArray.length > 15) {
      modsArray = sortedArray.slice(0, 15)
    }
    for (let i in modsArray) tempObj.value += modsArray[i].count+' : '+modsArray[i].unit+'\n'
  }else{
    tempObj.value += 'No units with mod less than 5*\n'
  }
  tempObj.value += '```'
  return tempObj
}
Cmds.GetMissingModLevel = async(obj)=>{
  const tempObj = {
    name: 'Mods < L15',
    value: '```autohotkey\n'
  }
  const unsortedArray = []
  for(let i in obj){
    if(obj[i].equippedStatMod.length > 0 && obj[i].equippedStatMod.filter(x=>x.level == 15).length != obj[i].equippedStatMod.length){
      const unitName = await HP.GetUnitName(obj[i].definitionId.split(':')[0])
      unsortedArray.push({
        count: +obj[i].equippedStatMod.filter(x=>x.level < 15).length,
        unit: (unitName || obj[i].definitionId.split(':')[0])
      })
    }
  }
  tempObj.name += ' ('+unsortedArray.length+')'
  if(unsortedArray.length > 0){
    const sortedArray = await sorter([{ column: 'count', order: 'descending' }], unsortedArray)
    let modsArray = sortedArray
    if (sortedArray.length > 15) {
      modsArray = sortedArray.slice(0, 15)
    }
    for (let i in modsArray) tempObj.value += modsArray[i].count+' : '+modsArray[i].unit+'\n'
  }else{
    tempObj.value += 'No units with mod levels less than 15\n'
  }
  tempObj.value += '```'
  return tempObj
}
Cmds.GetMissingMods = async(obj)=>{
  const tempObj = {
    name: 'Modded Units Missing mods',
    value: '```autohotkey\n'
  }
  const unsortedArray = []
  for(let i in obj){
    if(obj[i].equippedStatMod.length > 0 && obj[i].equippedStatMod.length < 6){
      const unitName = await HP.GetUnitName(obj[i].definitionId.split(':')[0])
      unsortedArray.push({
        count: 6 - +obj[i].equippedStatMod.length,
        unit: (unitName || obj[i].definitionId.split(':')[0])
      })
    }
  }
  tempObj.name += ' ('+unsortedArray.length+')'
  if(unsortedArray.length > 0){
    const sortedArray = await sorter([{ column: 'count', order: 'descending' }], unsortedArray)
    let modsArray = sortedArray
    if (sortedArray.length > 15) {
      modsArray = sortedArray.slice(0, 15)
    }
    for (let i in modsArray) tempObj.value += modsArray[i].count+' : '+modsArray[i].unit+'\n'
  }else{
    tempObj.value += 'No modded units with missing mods\n'
  }
  tempObj.value += '```'
  return tempObj
}
Cmds.GetNoMods = async(obj)=>{
  const tempObj = {
    name: 'Units with 0 mods',
    value: '```autohotkey\n'
  }
  let noModCount = 0;
  const unsortedArray = []
  for(let i in obj){
    if(obj[i].equippedStatMod.length == 0 && obj[i].combatType == 1){
      noModCount++;
      if(obj[i].currentTier >= 12){
        const unitName = await HP.GetUnitName(obj[i].definitionId.split(':')[0])
        unsortedArray.push({name: (unitName || obj[i].definitionId.split(':')[0])})
      }
    }
  }
  tempObj.name += ' ('+noModCount+')'
  if(unsortedArray.length > 0){
    tempObj.name +='\nUnits >G12 with no mods ('+unsortedArray.length+')'
    const sortedArray = await sorter([{column: 'name', order: 'ascending'}], unsortedArray)
    let noModsArray = []
    if(sortedArray.length > 10){
      noModsArray = sortedArray.slice(0, 10)
    }else{
      noModsArray = sortedArray
    }
    for(let i in noModsArray) tempObj.value += noModsArray[i].name+'\n'
  }else{
    tempObj.value += 'No units with 0 mods\n'
  }
  tempObj.value += '```'
  return tempObj;
}
module.exports = Cmds
