import { db } from "../connect.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = (req, res) => {

    // check user if exist
    const q = 'SELECT * FROM users WHERE username = ?';

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err)
        if (data.length) return res.status(409).json("Wrong in Data!")

        // create new user and hashing the password
        const salt = bcrypt.genSaltSync(10) // hashing process
        const hashedPassword = bcrypt.hashSync(req.body.password, salt) // return encrypt result

        const q = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?)";
        const values = [
            req.body.username,
            req.body.email,
            hashedPassword,
            req.body.name,
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err)
            return res.status(200).json("User has been created.")
        });
    })
}

export const login = (req, res) => {

    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err)
        if (data.length === 0) return res.status(404).json("User Not Found")

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
        if (!checkPassword) return res.status(400).json("Wrong pass or username");

        const token = jwt.sign({ id: data[0].id }, "secretKey"); // create token to check if this id can do any crud operations
        const { password, ...others } = data[0]

        res.cookie("accessToken", token, { httpOnly: true }).status(200).json(others);

    });

}

export const logout = (_req, res) => {

    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none" //block cookie for server port
    }).status(200).json("User has been Logged out.");
}