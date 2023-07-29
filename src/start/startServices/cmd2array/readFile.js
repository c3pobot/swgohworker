'use strict'
const fs = require('fs')
module.exports = async(file)=>{
  try{
    const obj = await fs.readFileSync(file)
    if(obj) return JSON.parse(obj)
  }catch(e){
    console.error('Error reading file '+file)
  }
}
