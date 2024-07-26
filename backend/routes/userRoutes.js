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
  deleteUser,
  myProfile,
  updateMyProfile,
  getUser,
  addToWishlist,
  removeFromWishlist
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
router
  .route('/profile')
  .get(protect, myProfile)
  .put(protect, updateMyProfile);

router.get('/logout', protect, logOut);
router.put('/addwish', protect, addToWishlist);
router.put('/removewish', protect, removeFromWishlist);
router.get("/:id/verify/:token/", validateId, verifyToken);
router.post('/forgotpassword', ensureGuest, forgotPassword)
router.get("/:id/resetpassword/:token/", ensureGuest, validateId, resetPassword);
router.put("/updatepassword/:id", ensureGuest, validateId, updatePassword);

router.delete("/:id", protect, ensureAdmin, validateId, deleteUser);
router.get('/allusers', protect, ensureAdmin, getUsers);
router.get('/:id', protect, ensureAdmin, getUser);
router.put('/:id', protect, ensureAdmin, validateId, updateUser);


export default router;
