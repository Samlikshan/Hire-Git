export default {
  corsOptions: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
  },
};
