import express from "express";

import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import likeRoutes from "./routes/likes.js"
import relationshipsRoutes from "./routes/relationships.js"
import commentRoutes from "./routes/comments.js"
import postRoutes from "./routes/posts.js"
import cors from "cors"
import multer from "multer"
import cookieParser from "cookie-parser"

const app = express()

//middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true)
    next()
})
app.use(express.json())  // for getting fields
app.use(cors({
    origin: "http://localhost:3000"
}))  // to preventing anyone to reach our api and allows specific url (if anyone try access ur url will return error)
app.use(cookieParser())  // for getting fields

app.use("/api/users", userRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/relationships", relationshipsRoutes)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({ storage: storage })

app.post('/api/upload', upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const file = req.file;
    return res.status(200).json(file.filename);
})


app.listen(8800, () => {
    console.log('API working!')
});