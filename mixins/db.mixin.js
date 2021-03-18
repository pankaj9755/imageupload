"use strict";
const path = require("path");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
require("dotenv").config();

module.exports = function () {
	return new SqlAdapter(

		process.env.DB_DATABASE_MASTER,
		process.env.DB_USERNAME_MASTER,
		process.env.DB_PASSWORD_MASTER,
		{
			host: process.env.DB_HOST_MASTER,
			dialect: "mysql",
			pool: {
				max: 5,
				min: 0,
				idle: 10000
			}
		});
};