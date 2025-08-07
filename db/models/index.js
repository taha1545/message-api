"use strict";

const Sequelize = require("sequelize");
const config = require(__dirname + "/../../config/config.js").development;

const sequelize = new Sequelize(config);
const db = {};

// 
db.User = require("./user.js")(sequelize, Sequelize.DataTypes);
db.Contact = require("./contact.js")(sequelize, Sequelize.DataTypes);

// 

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
