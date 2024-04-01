import { db } from '../connect.js'
import jwt from "jsonwebtoken"

export const getUser = (req, res) => {

    const userId = req.params.userId;
    const q = `SELECT * FROM users WHERE id = ?`;

    db.query(q, [userId], (err, data) => {
        if(err) return res.status(500).json(err)
        const{password, ...info} = data[0] // (...info) take all data except pass
        return res.json(info);
    });
} 
export const updateUser = (req, res) => {

    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("Not logged in! : ERROR 401 Not Authorized");

    jwt.verify(token, "secretKey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is Not Valid! : ERROR 403 Forbiden");

        const q = "UPDATE users SET `name` = ?, `city` = ?, `website` = ?, `coverPic` = ?, `profilePic` = ? WHERE id = ?";

        const values = [
            req.body.name,
            req.body.city,
            req.body.website,
            req.body.coverPic,
            req.body.profilePic,
            userInfo.id,
        ]

        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json("Update data action canceld : " + err);
            if(data.affectedRows > 0) return res.status(200).json("Update added successfully" + data)
            return res.status(403).json("You can update your data only : ERROR 403 Forbiden")
        })
    });
} 