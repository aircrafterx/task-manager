const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
require("dns").setDefaultResultOrder("ipv4first");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        message: "Too many requests, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: {
        message: "Too many login attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 7,
    message: {
        message: "Too many registration attempts. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false
});

const resendVerificationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    keyGenerator: (req) => {
        return req.body.email || req.ip;
    },
    message: {
        message: "Too many verification email requests. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const taskRoutes = require("./routes/tasks");
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

require("./cron/taskScheduler")
require("./cron/taskReminder")

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(limiter);

app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/register", registerLimiter);
app.use("/api/auth/resend-verification", resendVerificationLimiter);

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