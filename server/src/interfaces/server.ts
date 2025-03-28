import { app } from "./app";
import config from "../config";
import connectDB from "../infrastructure/database/database";

// connecitng to Database
connectDB();

app.listen(config.env.port, () => {
  console.log(`server running at port ${process.env.PORT}`);
});
