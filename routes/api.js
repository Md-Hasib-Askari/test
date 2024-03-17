import express from 'express';
const router = express.Router();
import * as todoController from '../app/controllers/todoController.js';
import * as userController from '../app/controllers/userController.js';

router.post('/store', todoController.store);
router.get('/show', todoController.show);
router.delete('/destroy/:id', todoController.destroy);

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/otp/:otp', userController.verifyOTP);

export default router;