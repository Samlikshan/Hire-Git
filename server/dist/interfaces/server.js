"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = __importDefault(require("../config"));
const CronJobService_1 = require("../infrastructure/services/CronJobService");
const database_1 = __importDefault(require("../infrastructure/database/database"));
const cronJobService = new CronJobService_1.CronJobService();
// connecitng to Database
(0, database_1.default)();
// scheduling cron-job to expire subscriptions
cronJobService.subscriptionExpiration();
app_1.server.listen(config_1.default.env.port, () => {
    console.log(`server running at port ${process.env.PORT}`);
});
