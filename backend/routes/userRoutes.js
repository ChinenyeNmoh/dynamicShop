import express from 'express';
import passport from 'passport';
import {
  authUser,
  createUser,
  sendData, 
  verifyToken,
  updatePassword,
  resetPassword,
  forgotPassword,
  logOut,
  getUsers,
  updateUser,
  blockUser,
  unBlockUser,
  deleteUser,
  myProfile,
  updateMyProfile,
  getUser
} from '../controllers/userController.js';

import { protect, ensureAdmin, ensureGuest, validateId} from '../middleswares/authMiddleware.js';

const router = express.Router();

router.post('/register', ensureGuest, createUser);
router.post('/auth', ensureGuest, authUser);
router.get('/googlelogin',  passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
  sendData
  
);
router.get('/facebooklogin',  passport.authenticate('facebook'));
router.get(
  '/facebook/callback',
  passport.authenticate('facebook'), 
  sendData
);

router.get('/logout', protect, logOut);
router.get("/:id/verify/:token/", validateId, verifyToken);
router.post('/forgotpassword', ensureGuest, forgotPassword)
router.get("/:id/resetpassword/:token/", ensureGuest, validateId, resetPassword);
router.put("/updatepassword/:id", ensureGuest, validateId, updatePassword);
router.put("/block/:id", protect, ensureAdmin, validateId, blockUser);
router.put("/unblock/:id", protect, ensureAdmin, validateId, unBlockUser);
router.delete("/deleteuser/:id", protect, ensureAdmin, validateId, deleteUser);
router.get('/allusers', protect, ensureAdmin, getUsers);
router.get('/getuser/:id', protect, ensureAdmin, getUser);
router.put('/updateuser/:id', protect, ensureAdmin, validateId, updateUser);
router
  .route('/profile')
  .get(protect, myProfile)
  .put(protect, updateMyProfile);

export default router;
