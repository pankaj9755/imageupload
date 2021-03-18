"use strict";
const Sequelize = require("sequelize");
const images = {
    name: "Image",
    define: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            defaultValue: null
        },
        image: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        status: {
            type: Sequelize.ENUM("active", "inactive", "suspended"),
            defaultValue: "active"
        },
        deleted_at: {
            type: Sequelize.DATE,
            defaultValue: null,
        }
    },
    options: {}
};
module.exports = images;