"use strict";
const Sequelize = require("sequelize");
const nexttable = {
    name: "thirdtable",
    define: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tech_id: {
            type: Sequelize.INTEGER,
            defaultValue: null
        },
        name: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        age: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        locality: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        description: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: "1",
        },
        deleted_at: {
            type: Sequelize.DATE,
            defaultValue: null,
        }
    },
    options: {}
};
module.exports = nexttable;