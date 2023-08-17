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
        console.log(req.user);  
        res.status(200).json(await Post.create({ user: req.user, ...req.body }))
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}
exports.getPost = async (req, res) => {
    // console.log(req.user.username);
    // res.status(200).json(await Post.find({ user: { username:  req.user.username } }));
    // let users = await 
    const user = await User.findOne({ username: req.user.username });
    const userIds = user.follows;
    userIds.push(user._id);
    const post = await Post.find({ 'user.userId': { $in: userIds } }).sort({ createdAt: -1 })
    res.status(200).json(post);

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
    post.comments.push({userId:req.user.userId, username: req.user.firstname ,...req.body});
    post.save();
    console.log(post);
    res.status(200).json("Success")
}

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find({ firstname: { $ne: null }, username: { $ne: req.user.username } });
        const mainUser = await User.findOne({ username: req.user.username });
        res.status(200).json({ users, mainUser });
    } catch (err) {
        console.error(err)
    }
}
exports.signIn = async (req, res) => {
    const existing = await User.findOne({ username: req.body.username });
    try {
        if (existing) {
            if (req.body.password === existing.password) {
                const accessToken = jwt.sign({ userId: existing._id, username: req.body.username, firstname: existing.firstname, lastname: existing.lastname }, accessTokenSecret)

                res.status(200).json({ message: 'Logged in', id: existing._id, jwt: accessToken })
                return
            }
            res.status(400).json({ message: 'Password does not match, try again' })
            return
        }
        res.status(400).json({ message: 'Username does not exist, try again' })
    } catch (err) {
        console.log(err)
    }

}
exports.updateUser = async (req, res) => {
    try {
        // console.log("Updated", req.body)
        const result = await User.updateOne({ username: req.user.username }, req.body);
        if (result) {
            res.status(200).json(await User.findOne({ username: req.user.username }))
        }

        // const result = await User.findOneAndUpdate({ username: req.user.username }, req.body);
        // console.log("result = ", result)
        res.status(200).json(result)

    } catch (err) {
        console.error(err)
        if (err.errors) {
            res.status(400).json({ message: "Please fill out all the fields" })
            return;
        }
    }
}

exports.AllUsers = async (req, res) => {
    try {
        const result = await User.find()
        res.status(200).json(result)
    } catch (err) {
        console.error(err)
    }
}
exports.getUser = async (req, res) => {
    try {
        res.status(200).json(await User.findOne({ username: req.user.username }))
    } catch (err) {
        console.error(err)
    }
}

exports.followUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username })
        if (user.follows.includes(req.body.userId)) {
            user.follows = user.follows.filter(fol => fol !== req.body.userId)
            user.save();
        } else {
            user.follows.push(req.body.userId)
            user.save();
        }
        res.status(200).json(user)
    } catch (err) {
        console.error(err)
    }
}

// exports.unFollowUser = async (req, res) => {
//     try {
//         const user = await User.findOne({ username: req.user.username })
//         user.follows = user.follows.filter(fol => fol !== req.body.userId)
//         user.save();
//         res.status(200).json(user)
//     } catch (err) {
//         console.error(err)
//     }
// }