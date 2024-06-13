import express from 'express';
import passport from 'passport';
import {
  authUser,
  createUser,
  successRoute,
  failed, 
  verifyToken,
  updatePassword,
  resetPassword,
  forgotPassword,
  logOut,
} from '../controllers/userController.js';
import { protect, ensureAdmin, ensureGuest, validateId} from '../middleswares/authMiddleware.js';
import generateToken  from '../utils/generateToken.js';

const router = express.Router();

router.post('/register', ensureGuest, createUser);
router.post('/auth', ensureGuest, authUser);
router.get('/googlelogin', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/users/failed' }),
  (req, res) => {
    res.redirect('/api/users/success');
  }
);
router.get('/facebooklogin', passport.authenticate('facebook'));
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/api/users/failed' }),
  (req, res) => {
    res.redirect('/api/users/success');
  }
);


router.get('/logout', protect, logOut);
router.get('/failed', failed);
router.get('/success', protect, successRoute);
router.get("/:id/verify/:token/", validateId, verifyToken);
router.post('/forgotpassword', ensureGuest, forgotPassword)
router.get("/:id/resetpassword/:token/", ensureGuest, validateId, resetPassword);
router.put("/:id/resetpassword/:token/", ensureGuest, validateId, updatePassword);
/*router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);*/

export default router;
