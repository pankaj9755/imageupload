
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'IMAGES/');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + '_' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {


    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Allowed only .png, .jpg, and .jpeg'));
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter }).single('image');


module.exports = upload;
















// var multer = require("multer");
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "public/upload/");
//     },
//     filename: function (req, file, cb) {
//         const key = file.originalname.split(".")[1];
//         cb(null + "." + key);
//     },
// });

// const upload = multer({
//     storage: storage,
// });




// module.exports = upload;