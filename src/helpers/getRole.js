'use strict'
module.exports = async(sId, roleId)=>{
  try{
    const roles = await MSG.GetRoles(sId)
    if(roles && roles.length > 0 && roles.find(x=>x.id == roleId)) return roles.find(x=>x.id == roleId)
  }catch(e){
    console.error(e)
  }
}
