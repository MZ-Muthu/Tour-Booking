let express = require('express');

let userController = require('./../controllers/userControllers');
let authController = require('./../controllers/authController');
let factory = require('./../controllers/handleFactory');

let router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch(
    '/updateUser',
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateUser
);
router.patch('/updateUserPassword', authController.updateUserPassword);
router.delete('/deleteUser', userController.deleteUser);
router.route('/me').get(factory.getMe, userController.getUserByID);

router.use(authController.restrictTo('admin'));
router.delete('/deleteOneUser', userController.deleteOneUser);

router.route('/').get(userController.getAllUser).post(userController.postUser);

router
    .route('/:id')
    .get(userController.getUserByID)
    .patch(userController.patchUser)
    .delete(userController.deleteUser);

module.exports = router;
