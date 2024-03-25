import { db } from '../connect.js'
import jwt from "jsonwebtoken"
import moment from "moment"

export const getTotalUsers = (req, res) => {

    const q = `SELECT COUNT(*) as TotalUsers FROM users;`;

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data)
    });
}

export const getTotalPosts = (req, res) => {

    const q = `SELECT COUNT(*) as TotalPosts FROM posts;`;

    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data)
    });
}

export const getTopActiveUsers = (req, res) => {

    const q = `SELECT u.name AS userName, COUNT(p.userId) AS NumberOfPosts
    FROM users AS u 
    JOIN posts AS p ON u.id = p.userId
    GROUP BY u.id, u.name
    ORDER BY NumberOfPosts DESC
    LIMIT 3;
    `;

    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data)
    });
}