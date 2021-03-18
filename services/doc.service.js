"use strict";
const DbConnect = require("../mixins/db.mixin");
const DbService = require("moleculer-db");
const { MoleculerClientError } = require("moleculer").Errors;
const Sequelize = require("sequelize");
const usermodel = require("../models/test.Model");
require("dotenv").config();


module.exports = {
    name: "nextuser",
    mixins: [DbService],
    adapter: DbConnect(),
    model: usermodel,


    settings: {
        /** Secret for JWT */

        fields: [
            "id",
            "user_id",
            "location",
            "task",
            "createdAt",
            "updatedAt",
        ],
    },

    actions: {

        //Second Service
        UserCreate: {
            auth: "require",
            params: {
                location: "string",
                task: "string"
            },
            async handler(ctx) {
                let tempdata = ctx.params
                let entity = ctx.meta.user.id;
                const data = {
                    user_id: entity,
                    location: tempdata.location,
                    task: tempdata.task
                }
                const insertdata = await this.adapter.insert(data);
                if (!insertdata) {
                    return Promise.reject(
                        new MoleculerClientError(
                            "Something Went Wrong...!!",
                            422, "Service Relation..!!",
                            [{ field: "Service", message: "Something Went Wrong...!!" }]
                        ));
                } else {
                    const user = await this.transformDocuments(ctx, {}, insertdata);
                    // return this.entityChanged("created", user, ctx).then(() => user);
                    return {
                        message: "Created Second Service..", user
                    }
                }
            },
        },


        finddetails: {
            params: {},
            async handler(ctx) {
                let entity = ctx.meta.user.id;
                const getdata = await this.adapter.find({
                    query: { user_id: entity, deleted_at: null }
                })
                if (getdata) {
                    const user = await this.transformDocuments(ctx, {}, getdata);
                    return { message: "Data found...!", user }
                } else {
                    return this.Promise.reject(
                        new MoleculerClientError(
                            "User Data Not found..!",
                            422,
                            "Id not found",
                            [{ field: "id=> " + entity.id, message: "is not found", },]
                        ));
                }
            }
        },

        delete_service_data: {
            cache: false,
            params: {
                id: { type: "string" }
            },

            async handler(ctx) {
                let entity = ctx.params;
                const data = await this.adapter.findOne({
                    where: {
                        id: entity.id, deleted_at: null
                    }
                });
                if (!data) {
                    return this.Promise.reject(
                        new MoleculerClientError(
                            "Data not found..!",
                            422,
                            "Login ID",
                            [{ field: "id=> " + entity.id, message: "is not found", },]
                        ));
                }
                else {
                    const update = await this.adapter.updateById(entity.id, {
                        $set: {
                            status: "0",
                            deleted_at: new Date(),
                        }
                    });
                    return {
                        message: "Data Deleted successfully...!", entity
                    }
                }
            }
        },

        //HASH METHOD
        load: {
            params: {},
            async handler(ctx) {
                // let entity = ctx.meta.user.id;
                const data = await this.adapter.find({
                    query: {
                        deleted_at: null
                        // user_id: entity,
                    },
                });

                return data
            },
        },
        load1: {
            params: {},
            async handler(ctx) {
                let entity = ctx.meta.user.id;
                const data = await this.adapter.find({
                    query: {
                        deleted_at: null,
                        user_id: entity,
                    },
                });

                return data
            },
        },


    },

}
