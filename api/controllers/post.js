import { db } from '../connect.js'
import jwt from "jsonwebtoken"
import moment from "moment"

export const getPosts = (req, res) => {

    const userId = req.query.userId
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in! : ERROR 401 Not Authorized");

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is Not Valid! : ERROR 403 Forbiden");

        const q = !isNaN(userId) ?
            `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ?  ORDER BY p.createdAt DESC`
            :
            `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
        Left JOIN relationships AS r ON (p.userId = r.followedUserId) where r.followerUserId = ? or p.userId = ?
        ORDER BY p.createdAt DESC`;

        const values = !isNaN(userId) ? [userId] : [userInfo.id, userInfo.id]

        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data)
        })
    });
}

export const addPost = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in! : ERROR 401 Not Authorized");

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is Not Valid! : ERROR 403 Forbiden");

        const q = "INSERT INTO posts (`desc`, `image`, `userId`, `createdAt`) VALUES (?)";

        const values = [
            req.body.desc,
            req.body.image,
            userInfo.id,
            moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json("Post action canceld : " + err);
            return res.status(200).json("post added successfully" + data)
        })
    });
}

export const deletePost = (req, res) => {
    const token = req.cookies.accessToken;

    console.log('req.params.id, userInfo.id');
    if (!token) return res.status(401).json("Not logged in! : ERROR 401 Not Authorized");
    jwt.verify(token, "secretKey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is Not Valid! : ERROR 403 Forbiden");

        const q = "DELETE FROM posts WHERE id = ? AND userId = ?";

        db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json("Delete post action canceld : " + err);
            if (data.affectedRows > 0) return res.status(200).json("Post Deleted successfully" + data)
            return res.status(403).json("You can Delete your post only : ERROR 403 Forbiden" + err)
        })
    });
}