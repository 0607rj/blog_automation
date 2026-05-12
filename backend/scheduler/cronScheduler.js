/**
 * CRON SCHEDULER
 * Runs the autonomous pipeline every 15 days.
 * Uses node-cron for reliable scheduling.
 * 
 * Schedule: Every 15 days at 2:00 AM IST
 * This ensures the pipeline runs during low-traffic hours.
 */
const cron = require("node-cron");
const { runAutonomousPipeline } = require("../agents/autonomousPipeline");

let isRunning = false;
let lastRunAt = null;
let lastRunResult = null;
let schedulerStatus = "idle";

/**
 * Start the autonomous scheduler.
 * Runs pipeline every 15 days at 2:00 AM.
 * 
 * Cron expression: "0 2 1,15 * *" = At 02:00 on day 1 and 15 of every month
 * This approximates a 15-day cycle.
 */
function startScheduler() {
  console.log("🕐 Autonomous scheduler initialized — runs on 1st and 15th of each month at 2:00 AM");
  
  // Schedule: 1st and 15th of every month at 2:00 AM
  cron.schedule("0 2 1,15 * *", async () => {
    console.log("🚀 Autonomous pipeline triggered by scheduler at", new Date().toISOString());
    await executeAutonomousRun();
  }, {
    timezone: "Asia/Kolkata"
  });

  schedulerStatus = "active";
}

/**
 * Execute a single autonomous run.
 * Guards against concurrent runs.
 */
async function executeAutonomousRun(runType = "autonomous") {
  if (isRunning) {
    console.log("⚠️ Pipeline already running. Skipping.");
    return { status: "skipped", reason: "Already running" };
  }

  isRunning = true;
  schedulerStatus = "running";
  console.log(`🤖 Starting ${runType} pipeline run...`);

  try {
    const result = await runAutonomousPipeline({
      runType,
      onStepUpdate: (logEntry) => {
        console.log(`  [${logEntry.step}] ${logEntry.status}: ${logEntry.message}`);
      }
    });

    lastRunAt = new Date();
    lastRunResult = result;
    schedulerStatus = "idle";
    isRunning = false;

    console.log(`✅ Pipeline completed: "${result.title || 'Unknown'}" (${result.durationMs}ms)`);
    return result;

  } catch (err) {
    console.error("❌ Autonomous pipeline failed:", err.message);
    schedulerStatus = "error";
    isRunning = false;
    lastRunResult = { status: "failed", error: err.message };
    return lastRunResult;
  }
}

/**
 * Get scheduler status for dashboard API.
 */
function getSchedulerStatus() {
  return {
    schedulerStatus,
    isRunning,
    lastRunAt,
    lastRunResult,
    nextScheduledRun: getNextScheduledRun(),
    schedule: "1st and 15th of each month at 2:00 AM IST"
  };
}

/**
 * Calculate the next scheduled run time.
 */
function getNextScheduledRun() {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();

  if (day < 15) {
    return new Date(year, month, 15, 2, 0, 0);
  } else {
    // Next month, 1st
    return new Date(year, month + 1, 1, 2, 0, 0);
  }
}

module.exports = { startScheduler, executeAutonomousRun, getSchedulerStatus };
