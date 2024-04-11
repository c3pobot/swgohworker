'use strict'
module.exports = (nme, values, padLn, sep)=>{
  try{
    let obj = {
      name: nme,
      value: '```autohotkey\n'
    }
    for(let i in values) obj.value += i.toString().padEnd(padLn, ' ')+sep+' '+values[i]+'\n';
    obj.value += '```'
    return obj;
  }catch(e){
    throw(e)
  }
}
