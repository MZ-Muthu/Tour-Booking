let multer = require('multer');
let sharp = require('sharp');

let catchAsync = require('./../util/catchAsync');
let userModel = require('./../model/userModel');
let AppError = require('./../util/appError');
let factory = require('./handleFactory');

// let multerStrorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         let ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//     }
// });

let multerStorage = multer.memoryStorage();

function multerFilter(req, file, cb) {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(
            new AppError('Not a image type please upload the image', 400),
            false
        );
    }
}

let upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async(req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);
    next();
});

let filerDataFromRequest = (obj, ...allowedFields) => {
    let filterdData = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) filterdData[el] = obj[el];
    });
    return filterdData;
};

exports.getAllUser = factory.getAll(userModel);
exports.postUser = (req, res) => {
    return res.status(404).json({
        status: 'error',
        message: 'ther routes are not defined'
    });
};
exports.patchUser = (req, res) => {
    return res.status(404).json({
        status: 'error',
        message: 'ther routes are not defined'
    });
};

exports.updateUser = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConformation) {
        return next(
            new AppError(
                "Password can't be modified in this place.Please use Update password route instead.."
            )
        );
    }

    let filterObject = filerDataFromRequest(req.body, 'name', 'email');
    if (req.file) filterObject.photo = req.file.filename;

    let user = await userModel.findByIdAndUpdate(req.user._id, filterObject, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'Success',
        data: {
            user
        }
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    let user = await userModel.findByIdAndUpdate(req.user._id, {
        active: false
    });
    res.status(204).json({
        status: 'success',
        message: 'Your account successfully deleted.'
    });
});

exports.getUserByID = factory.getOne(userModel);
exports.deleteOneUser = factory.deleteOne(userModel);
