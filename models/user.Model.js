"use strict";
const Sequelize = require("sequelize");
const users = {
    name: "users",
    define: {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: true
        },
        user_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        password: {
            type: Sequelize.STRING,
        },
        phone: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        status: {
            type: Sequelize.ENUM("active", "inactive", "suspended"),
            defaultValue: "active"
        },
        deleted_at: {
            type: Sequelize.DATE(6),
            allowNull: true,
            defaultValue: null
        }
    },
    options: {}
};
module.exports = users;