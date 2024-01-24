import express from "express";

import {
    register,
    login,
    confirm,
    forgotPassword,
    validateToken,
    resetPassword,
    profile
} from "../controllers/UserController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

// Authentication
router.post('/', register); // Create a new user
router.post('/login', login); // Login a user
router.get('/confirm/:token', confirm); // Confirm user
router.post('/forgot-password', forgotPassword); // Forgotten password
router.route('/forgot-password/:token')
    .get(validateToken)     // Validate token to reset password
    .post(resetPassword);   // Reset password

router.get('/profile', checkAuth, profile);

export default router;