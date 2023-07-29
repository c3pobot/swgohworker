'use strict'
global.baseDir = __dirname;
process.on('unhandledRejection', error => {
  //console.log(error.name+': '+error.message)
  console.log(error)
});
require('./src/start')
