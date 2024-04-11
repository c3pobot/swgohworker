'use strict'
const log = require('logger')
global.unitList = {}
global.factionList = {}
const { dataList } = require('helpers/unitData')
const ArrayToObject = require('helpers/arrayToObject')
module.exports = async()=>{
  try{
    let count = 0
    let units = (await mongo.find('autoComplete', {_id: 'unit'}, {data: {value: 0}}))[0]
    let factions = (await mongo.find('autoComplete', {_id: 'faction'}))[0]
    if(units?.data?.length > 0){
      let tempUnits = await ArrayToObject(units.data, 'baseId')
      if(Object.values(tempUnits)?.length > 0){
        count++
        unitList = tempUnits
        dataList.unitList = tempUnits
      }
    }
    if(factions?.data?.length > 0){
      let tempFaction = await ArrayToObject(factions.data, 'value')
      if(Object.values(tempFaction)?.length > 0){
        count++
        factionList = tempFaction
        dataList.factionList = tempFaction
      }
    }
    if(count === 2) return true
  }catch(e){
    throw(e)
  }
}
