"use strict";
const DbConnect = require("../mixins/db.mixin");
const DbService = require("moleculer-db");
const { MoleculerClientError } = require("moleculer").Errors;

require('dotenv').config()
const image = require('../models/images');

module.exports = {
    name: "Image",
    mixins: [DbService],
    adapter: DbConnect(),
    model: image,

    actions: {
        fileUpload: {
            async handler(ctx) {
                let entity = ctx.meta.user.id;
                const file = ctx.options.parentCtx.params.req.file;
                const filename = file.filename
                const url = `${process.env.IMAGE_BASE}${filename}`
                const data1 = {
                    user_id: entity,
                    image: url,
                }
                const data = {
                    status: true,
                    statusCode: 200,
                    filename: filename,
                    image: url,
                    message: 'Image upload successfully.....'
                }
                const get = await this.adapter.insert(data1)
                return { data, data1 }
            },
        },

        ImageDelete: {
            params: {
                id: { type: "string" }
            },
            async handler(ctx) {
                let entity = ctx.params;

                return this.Promise.resolve().then(() => this.adapter.findOne({
                    where: {
                        id: entity.id, deleted_at: null
                    }
                }),
                    this.adapter.updateById(entity.id, {
                        $set: {
                            status: "inactive",
                            deleted_at: new Date(),
                        }
                    })).then((getdata) => {
                        if (!getdata)
                            return this.Promise.reject(new MoleculerClientError(
                                "user_id not found", 422, "Id Not found...",
                                [{ fields: "Id==> " + entity.id, message: "Is not found" },]
                            )
                            );
                        return {
                            message: "Data deleted succesfully...!"
                        }
                    })
            }
        },

        conn: {
            params: {},
            async handler(ctx) {
                // let entity = ctx.meta.user;
                const UserData = await this.adapter.find({
                    query: {
                        deleted_at: null,
                        // user_id: entity.id
                    }
                });
                return UserData
            }
        },

    },
};
