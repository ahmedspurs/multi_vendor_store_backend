
##  Node.js 

This is a e Node.js project that created and builded using  application builder.
## installation 
  npm install
## Configs 
open db/conn.js
            const Sequelize = require("sequelize")
            const initModels = require('../models/init-models.js')
            const sequelize = new Sequelize("your_db", "root", "yor password",
            { host: "localhost", dialect: "mysql" });
            const conn = initModels(sequelize);
            module.exports ={conn,sequelize};

open package.json
"sequelize": "sequelize-auto -h localhost -d your_db -u root -x -p 3306 -o models"

## create sequelize models
npm run sequelize

## finally
npm run start

## test your api
npm run test

