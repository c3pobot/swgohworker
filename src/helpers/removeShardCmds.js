'use strict'
module.exports = async(sId)=>{
  try{
    let cmds = [], count = 0, res = {status: 'error'}
    const status = await MSG.RESTHandler('/applications/'+process.env.DISCORD_CLIENT_ID+'/guilds/'+sId+'/commands', 'PUT', JSON.stringify(cmds))
    if(status?.status == 200) res.status = 'ok'
    return res
  }catch(e){
    console.error(e);
  }
}
