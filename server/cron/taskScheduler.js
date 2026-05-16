const cron = require("node-cron");
const db = require("../db");

cron.schedule("0 * * * *", async () => {
    try {
        console.log("Running overdue task scheduler...");

        await db.query(`
            UPDATE tasks 
            SET status = 'overdue'
            WHERE
                due_date < CURRENT_DATE
                AND status != 'completed'
                AND status != 'overdue'
                AND is_deleted = false
        `);

        console.log("Task scheduling is completed!");
    }catch(err){
        console.log("Task Scheduler Error: ", err);
    }
})
