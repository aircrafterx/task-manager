const cron = require("node-cron");
const db = require("../db");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
});

cron .schedule("0 9 * * *", async () => {
    try {
        console.log("Running task remider sheduling...");

        const result = await db.query(`
            SELECT 
                tasks.id, tasks.title, tasks.due_date, users.email
            FROM tasks 
            JOIN users
            ON tasks.user_id = users.id
            WHERE 
                tasks.due_date = CURRENT_DATE + INTERVAL '1 day'
                AND tasks.status != 'completed'
                AND tasks.is_deleted = false
                AND tasks.reminder_sent = false
        `)

        for(const task of result.rows){
            const formattedDate = new Date(task.due_date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });

            const formattedTime = new Date(task.due_date).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit"
            });

            const emailHtml = `
                <div style = "font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;" >
                    <div style="
                        max-width: 500px;
                        margin: auto;
                        background: white;
                        padding: 40px;
                        border-radius: 12px;
                        text-align: center;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    ">

                    <h1 style="
                        color: #111827;
                        margin-bottom: 20px;
                        font-size: 28px;
                    ">
                        Task Reminder
                    </h1>

                    <p style="
                        color: #4b5563;
                        font-size: 16px;
                        line-height: 1.6;
                        margin-bottom: 25px;
                    ">
                        Your task is approaching its deadline.
                    </p>

                    <div style="
                        background-color: #f9fafb;
                        border: 1px solid #e5e7eb;
                        border-radius: 10px;
                        padding: 20px;
                        margin-bottom: 30px;
                        text-align: left;
                    ">

                        <p style="
                            margin: 0 0 12px 0;
                            color: #111827;
                            font-size: 15px;
                        ">
                            <strong>Due Date:</strong> ${formattedDate}
                            <br />
                            <strong>Time:</strong> ${formattedTime}
                        </p>

                    </div>

                    <p style="
                        color: #4b5563;
                        font-size: 15px;
                        line-height: 1.6;
                        margin-bottom: 30px;
                    ">
                        Please complete your task before the deadline to avoid it being marked as overdue.
                    </p>

                    <a
                        href="http://localhost:3000"
                        style="
                            display: inline-block;
                            background-color: #dc2626;
                            color: white;
                            padding: 14px 28px;
                            border-radius: 8px;
                            font-weight: bold;
                            font-size: 14px;
                            text-decoration: none;
                        "
                    >
                        Open Task Manager
                    </a>

                    <p style="
                        margin-top: 35px;
                        color: #9ca3af;
                        font-size: 13px;
                    ">
                        AircrafterX Task Manager Notification System
                    </p>

                </div>

        </div >
        `;


            await transporter.sendMail({
                from: `"AircrafterX Notifications" <${process.env.EMAIL_USER}>`,
                to: task.email,
                subject: "Task due Reminder",
                html: emailHtml
            });

            await db.query(`
                UPDATE tasks
                SET reminder_sent = true
                WHERE id = $1
            `, [task.id]);

            console.log('Reminder sent for task ', task.id);
        }

        console.log("Remider Sent..");
    }catch(err){
        console.log("Task Reminder error: ", err);
    }
});