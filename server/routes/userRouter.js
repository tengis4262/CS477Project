const express = require('express');

const userRouter = require('../controllers/controller');

const router = express.Router();


router.post('/', userRouter.signUp);
router.post('/login', userRouter.signIn);
router.get('/all',userRouter.AllUsers)
router.use(userRouter.authorize);
router.get('/', userRouter.getAllUser);
router.get('/getUser', userRouter.getUser);
router.post('/update',userRouter.updateUser)
router.post('/post', userRouter.addPost);
router.get('/post', userRouter.getPost);
router.post('/post/:_id', userRouter.likePost);
router.post('/post/:_id/comment', userRouter.commentPost);
router.get('/check', userRouter.getUserByToken);
router.post('/follow',userRouter.followUser);
// router.post('/unfollow',userRouter.unFollowUser);





module.exports = router;