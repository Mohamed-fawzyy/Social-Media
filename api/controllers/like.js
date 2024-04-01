import { db } from '../connect.js'
import jwt from "jsonwebtoken"
import moment from "moment"

export const getLikes = (req, res) => {

    const q = `SELECT userId FROM likes WHERE postId = ?`;

    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.map(likes => likes.userId))

    });
}

export const addLike = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in! : ERROR 401 Not Authorized");

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is Not Valid! : ERROR 403 Forbiden");

        const q = "INSERT INTO likes (`userId`, `postId`) VALUES (?);";

        const values = [
            userInfo.id,
            req.body.postId,
        ]

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json("like action canceld : " + err);
            return res.status(200).json("post liked successfully" + data)
        });
    });
}

export const deleteLike = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in! : ERROR 401 Not Authorized");

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is Not Valid! : ERROR 403 Forbiden");

        const q = "DELETE FROM likes WHERE userId = ? AND postId = ?";

        db.query(q, [userInfo.id, req.query.postId], (err, data) => {
            if (err) return res.status(500).json("dislike action canceld : " + err);
            return res.status(200).json("post disliked successfully" + data)
        });
    });
}