import { logger } from "../utils/logger";
import { prisma } from "../utils/prisma";
import cron from "node-cron";

cron.schedule("0 2 * * *", async () => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 5); // 5 hari yang lalu

    const deleted = await prisma.sensorReading.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate, // less than
        },
      },
    });

    logger.info(
      `Cleanup job: Deleted ${deleted.count} old readings older than 5 days`
    );
  } catch (error) {
    logger.error("Cleanup job error:", error);
  }
});

logger.info("Cleanup job scheduled: delete data >5 days every 02:00 AM");
