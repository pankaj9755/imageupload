"use strict";
const DbConnect = require("../mixins/db.mixin");
const DbService = require("moleculer-db");
const { MoleculerClientError } = require("moleculer").Errors;
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../models/user.Model");
const { mailerFun } = require("../middleware/email");

require("dotenv").config();

/**
* @typedef {import('moleculer').Context} Context Moleculer's Context
*/

module.exports = {
    name: "users",
    mixins: [DbService],
    adapter: DbConnect(),
    model: users,

    settings: {
        /** Secret for JWT */
        JWT_SECRET: process.env.JWT_SECRET || "jwtsecret",

        fields: [
            "id",
            "user_name",
            "email",
            "password",
            "phone",
            "createdAt",
            "updatedAt",
        ],
        entityValidator: {
            _id: { type: "string", optional: true },
            user_name: { type: "string", optional: true },
            email: { type: "email", optional: true },
            password: { type: "string", min: 6 },
            phone: { type: "string", optional: true },

        },
    },
    actions: {
        /**
         * ADD NEW USER
         *
         * @actions
         * @param {Object} user - User entity
         *
         * @returns {Object} Created entity & token
         */
        create: {
            params: {
                user_name: { type: "string" },
                email: { type: "email" },
                password: { type: "string", min: 1 },
                phone: { type: "string" }

            },
            async handler(ctx) {

                let entity = ctx.params;

                if (entity.email) {
                    const foundData = await this.adapter.findOne({

                        where: { email: entity.email, deleted_at: null }
                    });
                    if (foundData)
                        return Promise.reject(
                            new MoleculerClientError("email Already Exist...!!",
                                422, "email Already Exist...!!",
                                [{
                                    field: "Password",
                                    message: "email Already Exist...!"
                                }]
                            )
                        )
                };
                entity.password = bcrypt.hashSync(entity.password, 10);
                const doc = await this.adapter.insert(entity);
                mailerFun(entity)
                const user = await this.transformDocuments(ctx, {}, doc);
                return this.entityChanged("created", user, ctx).then(() => user);
            },
        },


        //Login Api  

        loginUser: {
            cache: false,
            params: {
                email: { type: "email" },
                password: { type: "string", min: 1 },
            },
            handler(ctx) {
                const { email, password } = ctx.params;
                return this.Promise.resolve().then(() => this.adapter.findOne({
                    where: { email: email, deleted_at: null },
                })
                )
                    .then((Userdata) => {
                        if (!Userdata)
                            return this.Promise.reject(
                                new MoleculerClientError(
                                    "Email or password is invalid!",
                                    422,
                                    "Email",
                                    [{ field: "email", message: "is not found" },]
                                ));
                        return bcrypt
                            .compare(password, Userdata.password)
                            .then((res) => {
                                if (!res)
                                    return Promise.reject(
                                        new MoleculerClientError(
                                            "Wrong password!",
                                            422,
                                            "Password",
                                            [{ field: "Password", message: "is not metch", },]
                                        )
                                    );
                                return this.transformDocuments(ctx, {}, Userdata);
                            });
                    })
                    .then((Userdata) => this.transformEntity(Userdata, true, ctx.meta.token));
            },
        },

        //""""FINDALL USER DETAILS""""
        userlist: {
            auth: "required",
            cache: false,
            params: {},
            async handler(ctx, user) {
                let entity = ctx.params;
                const result = await ctx.call("nextuser.load", {
                    // user_id: entity.user_id,
                });
                const temp = await ctx.call("thirdparty.connects", {
                    // tech_id: entity.tech_id,
                });
                const ww = await ctx.call("Image.conn", {
                    // tech_id: entity.tech_id,
                });
                const finddata = await this.adapter.find({ query: { deleted_at: null } }, {
                    entity: ["id", "email", "user_name", "password", "phone", "createdAt", "updatedAt"]
                });
                let data = {
                    finddata: finddata,
                    result: result,
                    Third_Table_Data: temp,
                    Image_Info: ww
                }
                return { message: "data found..", data }
            }
        },

        // """"DELETE USER""""  
        deleteUser: {
            params: {
                id: { type: "string" }
            },
            async handler(ctx) {
                let entity = ctx.params;
                // const getdata = await this.getById(ctx.params.id);
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

        //""""FindOne User """"
        findUser: {
            auth: "require",
            params: {},
            async handler(ctx) {

                let entity = ctx.meta.user.id;
                const Data = [];
                var aw = [];
                const Elem = [];
                const result = await ctx.call("nextuser.load1", {
                    user_id: entity.user_id, deleted_at: null,
                });

                if (result) {
                    for (let userLIst of result) {
                        const getdata = await this.adapter.find({
                            query: { id: userLIst.user_id, deleted_at: null },
                        });
                        getdata.forEach(ele => {
                            const ww = {
                                id: ele.id,
                                user_name: ele.user_name,
                                email: ele.email,
                                phone: ele.phone,
                                password: ele.password,
                                createdAt: ele.createdAt,
                                updatedAt: ele.updatedAt
                            }
                            const data = {
                                User_info: ww,
                                count_second_service_data: result.length,
                                user_id: userLIst.user_id,
                                location: userLIst.location,
                                task: userLIst.task,
                                status: userLIst.status,
                            }
                            Data.push(data);
                            Elem.push(data)
                        })

                        const damn = await ctx.call("thirdparty.con", {
                            tech_id: entity.tech_id
                        })

                        for (let LIST of damn) {
                            const data1 = {

                                count_third_service_data: damn.length,
                                // User_info: damn,
                                tech_id: LIST.tech_id,
                                name: LIST.name,
                                age: LIST.age,
                                locality: LIST.locality,
                                description: LIST.description,

                            }
                            aw.push(data1)
                        }
                        const aa = await ctx.call("Image.conn", {
                            user_id: entity.user_id
                        })
                        return { Data, aw }
                    }
                }
                else {
                    return this.Promise.reject(
                        new MoleculerClientError(
                            "User Not Exist..!",
                            422,
                            "Id not found",
                            [{ field: "id=> " + entity.id, message: "is not found", },]
                        ));
                    // const user = await this.transformDocuments(ctx, {}, getdata);
                }
            }
        },

        //""""UPDATE USER DETAILS""""
        details: {
            params: {
                user_name: { type: "string", optional: true },
                phone: { type: "string", optional: true }
            },

            async handler(ctx) {
                const { user_name, phone } = ctx.params;
                let entity = ctx.params
                const updatedata = await this.adapter.findOne({
                    where: { id: entity.id, deleted_at: null },
                })
                if (!updatedata) {
                    return this.Promise.reject(
                        new MoleculerClientError(
                            "This user is  Not Exist..!",
                            422,
                            "",
                            [{
                                field: "user_id", message: "is not found",
                            }]
                        ));
                } else {
                    const doc = await this.adapter.updateById(entity.id, {
                        $set: {
                            user_name: entity.user_name,
                            phone: entity.phone
                        }
                    })
                    return { message: "User detail`s update successfully..", entity }
                }
            }
        },

        //CHANGE PASSWORD
        chnngepassword: {
            params: {
                email: {
                    type: "string"
                }
            },
            async handler(ctx) {

                const { oldpassword, password, confirmpassword } = ctx.params;
                let entity = ctx.params;
                const getdata = await this.adapter.findOne({
                    where: { email: entity.email }
                });
                if (!getdata) {
                    return this.Promise.reject(
                        new MoleculerClientError(
                            " user does not Exist..!",
                            422,
                            "Email not exist",
                            [{
                                field: entity.email, message: "is not found",
                            }]
                        ));
                }
                else {
                    const { id, email } = getdata;
                    const isMatch = await bcrypt.compare(oldpassword, getdata.password);
                    if (isMatch == true) {
                        if (password == confirmpassword) {
                            const hash = await bcrypt.hashSync(password, 10);
                            console.log(hash);
                            var datapass = this.adapter.updateById(entity.id, {
                                $set: {
                                    password: hash
                                }
                            });
                        }
                        if (!datapass) {
                            return this.Promise.reject(
                                new MoleculerClientError(
                                    "Please Check Password, Password is not Match ..!",
                                    422,
                                    "password not match",
                                    [{
                                        field: "Password", message: "is not Match..",
                                    }]
                                ));
                        }
                        else {
                            return { message: "password change Succesfully..." + " Your Change Password is  " + entity.password }
                        }
                    } else {
                        return this.Promise.reject(
                            new MoleculerClientError(
                                " Password  not Match ..!",
                                422,
                                "password not match",
                                [{
                                    field: "Password", message: "is not Match...",
                                }]
                            ));
                    }
                }
            }
        },

        //DELETE ALL DATA IN DATABASE
        deleteAllData: {
            params: {},
            async handler(ctx) {
                let entity = ctx.params;
                const deleteAll = await this.adapter.destroy({
                    where: {}
                });
                if (!deleteAll)
                    return this.Promise.reject(
                        new MoleculerClientError(
                            " Something Went Wrong..!",
                            422,
                            "DeleteAll",
                            [{
                                field: "data", message: "is not found..",
                            }]
                        ));
                return {
                    message: "All Data deleted successfully...", deleteAll
                }

            }
        },

        /**
        * Get user by JWT token (for API GW authentication)
        *
        * @actions
        * @param {String} token - JWT token
        *
        * @returns {Object} Resolved user
        */
        resolveToken: {
            cache: {
                keys: ["token"],
                ttl: 60 * 60, // 1 hour
            },
            params: {
                token: "string",
            },
            handler(ctx) {
                return new this.Promise((resolve, reject) => {
                    jwt.verify(
                        ctx.params.token,
                        process.env.JWT_SECRET,
                        (err, decoded) => {
                            if (err) return reject(err);
                            resolve(decoded);
                        }
                    );
                }).then((decoded) => {
                    // console.log("user err", decoded.id);
                    // console.log("****************", decoded.id);
                    if (decoded.id) return this.getById(decoded.id);
                });
            },
        },
    },
    /**
    * Methods
    */
    methods: {
        /**
        * Generate a JWT token from employee entity
        *
        * @param {Object} user
        */
        generateJWT(user) {
            const today = new Date();
            const exp = new Date(today);
            exp.setDate(today.getDate() + 60);

            return jwt.sign(
                {
                    id: user.id,
                    user_name: user.user_name,
                    email: user.email,
                    password: user.password,
                    exp: Math.floor(exp.getTime() / 1000),
                },
                process.env.JWT_SECRET,
            );
        },

        /**
        * Transform returned employee entity. Generate JWT token if neccessary.
        *
        * @param {Object} user
        * @param {Boolean} withToken
        */
        transformEntity(user, withToken, token) {
            if (user) {
                if (withToken) user.token = token || this.generateJWT(user);
            }
            return { user };
        },

        /**
        * Transform returned employee entity as profile.
        *
        * @param {Context} ctx
        * @param {Object} user
        * @param {Object?} loggedInUser
        */
        transformProfile(ctx, user, loggedInUser) {
            if (loggedInUser) {
                return ctx
                    .call("follows.has", {
                        user: loggedInUser.id.toString(),
                        follow: user.id.toString(),
                    })
                    .then((res) => {
                        user.following = res;
                        return { profile: user };
                    });
            }
            return { profile: user };
        },
    },



    /**
    * Fired after database connection establishing.
    */
    async afterConnected() { },
};





























