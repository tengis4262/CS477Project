const User = require('../models/user');
const Post = require('../models/posts');
const { ObjectId } = require('mongodb');
const user = require('../models/user');
const jwt = require('jsonwebtoken');

const accessTokenSecret = 'Tengis-Web-Twitter01!'

exports.signUp = async (req, res) => {
    try {
        res.status(200).json(await User.create(req.body))
    } catch (err) {
        console.log(err)
        if (err.errors) {
            res.status(400).json({ message: "Password too short" })
            return;
        }
        res.status(400).json({ message: "Duplicate username,try different username" })
    }
}
exports.authorize = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader;
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                res.status(403).json({ 'error': 'Unauthorized' });
            } else {
                req.user = user;
                next();
            }
        })
    } else {
        res.status(401).json({ 'error': 'Please login' });
    }
}
exports.getUserByToken = async (req, res) => {
    const user = await User.findOne({ username: req.user.username });
    res.status(200).json(user);
}

exports.addPost = async (req, res) => {
    try {
        res.status(200).json(await Post.create({ user: req.user, ...req.body }))
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}
exports.getPost = async (req, res) => {
    console.log( req.user.username);
    // res.status(200).json(await Post.find({ user: { username:  req.user.username } }));
    res.status(200).json(await Post.find({ 'user.username': req.user.username }));

}

exports.likePost = async (req, res) => {
    const post = await Post.findById({ _id: new ObjectId(req.params._id) });
    let likeCount = post.like;
    likeCount++;
    post.like = likeCount;
    post.save();
    res.status(200).json("Success")
}
exports.commentPost = async (req, res) => {
    const post = await Post.findById({ _id: new ObjectId(req.params._id) });
    post.comments.push(req.body);
    post.save();
    res.status(200).json("Success")
}

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users)
    } catch (err) {
        console.error(err)
    }
}
exports.signIn = async (req, res) => {
    const existing = await User.findOne({ username: req.body.username });
    try {
        if (existing) {
            if (req.body.password === existing.password) {
                const accessToken = jwt.sign({ userId: existing._id, username: req.body.username }, accessTokenSecret)

                res.status(200).json({ message: 'Logged in', id: existing._id, jwt: accessToken })
            }
            res.status(400).json({ message: 'Password does not match, try again' })
        }
        res.status(400).json({ message: 'Username does not exist, try again' })
    } catch (err) {
        console.log(err)
    }

}