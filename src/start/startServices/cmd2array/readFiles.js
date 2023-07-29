'use strict'
const fs = require('fs')
const GetSubCommands = require('./getSubCommands')
const ReadFile = require('./readFile')
module.exports = (dir, dbKey)=>{
  return new Promise(resolve=>{
    try{
      fs.readdir(dir, async(err, filenames)=>{
        const data = {cmdMap: {}, cmds: []}
        if(err) {
          console.error(err)
        }else{
          for(let i in filenames){
            if(filenames[i].split('.').length == 1){
              const obj = await ReadFile(dir+'/'+filenames[i]+'/cmd.json')
              if(obj?.cmd?.name && data.cmds.filter(x=>x.cmd.name === obj.cmd.name).length === 0){
                if(obj?.cmd?.options?.length == 0){//has GetSubCommands
                  const subCommands = await GetSubCommands(dir+'/'+filenames[i])
                  if(subCommands?.length > 0) obj.cmd.options = subCommands
                }
                data.cmds.push(obj)
                data.cmdMap[obj.cmd.name] = {type: obj.type, worker: dbKey}
              }
            }
          }
        }
        resolve(data)
      })
    }catch(e){
      console.error(e)
      resolve()
    }
  })
}
