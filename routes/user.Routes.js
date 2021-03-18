"use strict";
const upload = require('../middleware/upload');
const routes = {
    //User Routes
    "POST /users/": "users.create",
    "POST /user/loginUser": "users.loginUser",

    "GET /users/": "users.userlist",
    "GET /users/finduser": "users.findUser",

    "PUT /users/updatuser": "users.details",
    "DELETE /users/delete": "users.deleteUser",

    "POST /users/change": "users.chnngepassword",
    "DELETE /users/all": "users.deleteAllData",

    //Other Routes
    "POST /users/UserCreate": "nextuser.UserCreate",
    "GET /users/findData": "nextuser.finddetails",

    "DELETE /users/deletedata": "nextuser.delete_service_data",

    // Third_party Routes
    "POST /users/creatfeilds": "thirdparty.creating",

    //IMAGE UPLOAD
    "POST /users/fileUpload": [upload, "Image.fileUpload"],
    "DELETE /users/deleteimage": "Image.ImageDelete"


};
module.exports = routes;