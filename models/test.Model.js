"use strict";
const Sequelize = require("sequelize");
const testuser = {
    name: "test",
    define: {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.INTEGER,

        },
        location: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        task: {
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
module.exports = testuser;