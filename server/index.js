const express = require("express");
const cors = require("cors");

const taskRoutes = require("./routes/tasks");
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({status: "ok"});
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: "Internal Server Error"})
})

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})


const port = process.env.SERVER_PORT || 5000;
app.listen(port, () => {
    console.log(`server runnning at http://localhost:${port}`);
});