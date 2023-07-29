'use strict'
const fs = require('fs')
const ReadFile = require('./readFile')
module.exports = async(dir)=>{
  try{
    return new Promise(resolve=>{
      fs.readdir(dir, async(err, filenames)=>{
        let res
        if(err) {
          console.error(err)
        }else{
          res = []
          for(let i in filenames){
            if(filenames[i].split('.').length == 1){
              const obj = await ReadFile(dir+'/'+filenames[i]+'/cmd.json')
              if(obj?.name) res.push(obj)
            }
          }
        }
        resolve(res)
      })
    })
  }catch(e){
    console.error(e)
  }
}
