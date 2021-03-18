"use strict";
const DbConnect = require("../mixins/db.mixin");
const DbService = require("moleculer-db");
const { MoleculerClientError } = require("moleculer").Errors;
const Sequelize = require("sequelize");
const thirdmodel = require("../models/third.Model");
require("dotenv").config();


module.exports = {
    name: "thirdparty",
    mixins: [DbService],
    adapter: DbConnect(),
    model: thirdmodel,


    settings: {
        /** Secret for JWT */

        fields: [
            "id",
            "tech_id",
            "name",
            "age",
            "locality",
            "description",
            "status",
            "createdAt",
            "updatedAt",
        ],
    },
    actions: {

        creating: {
            params: {},

            async handler(ctx) {
                let entity = ctx.meta.user;
                let tempdata = ctx.params;
                const data = {
                    tech_id: entity.id,
                    name: tempdata.name,
                    age: tempdata.age,
                    locality: tempdata.locality,
                    description: tempdata.description
                }
                const insert = await this.adapter.insert(data);
                if (insert) {
                    const user = await this.transformDocuments(ctx, {}, insert);

                    return { message: "Insert Successfully..", user }
                } else {
                    return Promise.reject(new MoleculerClientError(
                        "Something Went Wrong..!", 422, "Create", [{ fields: "register", message: "Api not working at the time" }]
                    ))
                }
            }
        },
        connects: {
            params: {},
            async handler(ctx) {
                // let entity = ctx.meta.user;
                const UserData = await this.adapter.find({
                    query: {
                        deleted_at: null
                    }
                });
                return UserData
            }
        },
        con: {
            params: {},
            async handler(ctx) {
                let entity = ctx.meta.user;
                const UserData = await this.adapter.find({
                    query: {
                        deleted_at: null,
                        tech_id: entity.id
                    }
                });
                return UserData
            }
        },


    }
}