import { server } from "./app";
import config from "../config";
import { CronJobService } from "../infrastructure/services/CronJobService";
import connectDB from "../infrastructure/database/database";

const cronJobService = new CronJobService();

// connecitng to Database
connectDB();
// scheduling cron-job to expire subscriptions
cronJobService.subscriptionExpiration();
server.listen(config.env.port, () => {
  console.log(`server running at port ${process.env.PORT}`);
});
