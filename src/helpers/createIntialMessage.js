'use strict'
module.exports = async(obj)=>{
  try{
    return await MSG.SendMsg(obj, {embeds: [{description: "Placeholder", color: 15844367}]})
  }catch(e){
    console.error(e)
  }
}
