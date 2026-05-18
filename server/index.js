const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        message: "Too many requests, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5
});

const taskRoutes = require("./routes/tasks");
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

require("./cron/taskScheduler")
require("./cron/taskReminder")

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(limiter);

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
})

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({status: "ok"});
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: "Internal Server Error"});
});

const port = process.env.SERVER_PORT || 5000;
app.listen(port, () => {
    console.log(`server runnning at http://localhost:${port}`);
});