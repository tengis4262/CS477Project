const express = require('express');

const userRouter = require('../controllers/controller');

const router = express.Router();


router.post('/', userRouter.signUp);
router.get('/', userRouter.getAllUser);
router.post('/login', userRouter.signIn);
router.use(userRouter.authorize);
router.post('/post', userRouter.addPost);
router.get('/post', userRouter.getPost);
router.post('/post/:_id', userRouter.likePost);
router.post('/post/:_id/comment', userRouter.commentPost);
router.get('/check', userRouter.getUserByToken);




module.exports = router;