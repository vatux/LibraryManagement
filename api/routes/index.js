var express = require('express');
var router = express.Router();

// Dinamik route yapar, directory'i okuyrarak js uzantılı dosya dışındakileri include etmez, dosya ismini alır, uzantıyı kaldırır ve api'ye route eder

const fs = require("fs");

let routes = fs.readdirSync(__dirname);

for(let route of routes){
  if(route.includes(".js") && route != "index.js"){
    router.use("/"+route.replace(".js", ""), require('./'+route))
  }
}

module.exports = router;
