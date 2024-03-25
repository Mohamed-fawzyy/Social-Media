import { db } from '../connect.js'
import jwt from "jsonwebtoken"
import moment from "moment"

export const getPosts = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in! : ERROR 401 Not Authorized");

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is Not Valid! : ERROR 403 Forbiden");

        const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
        JOIN relationships AS r ON (p.userId = r.followedUserId) where r.followerUserId = ? or p.userId = ?
        ORDER BY p.createdAt DESC`;

        db.query(q, [userInfo.id, userInfo.id], (err, data) => {
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