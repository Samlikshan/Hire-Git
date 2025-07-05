"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/Admin/adminController");
const verifyTokenMiddleware_1 = require("../middlewares/verifyTokenMiddleware");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const router = express_1.default.Router();
const adminController = new adminController_1.AdminController();
router.get("/list-companies", (0, verifyTokenMiddleware_1.verifyToken)(), (0, adminMiddleware_1.adminMiddleWare)(), adminController.listCompanies);
router.post("/review-company", (0, verifyTokenMiddleware_1.verifyToken)(), (0, adminMiddleware_1.adminMiddleWare)(), adminController.reveiwCompany);
router.get("/pending-companies", (0, verifyTokenMiddleware_1.verifyToken)(), (0, adminMiddleware_1.adminMiddleWare)(), adminController.listPendingCompanies);
router.get("/list-candidates", (0, verifyTokenMiddleware_1.verifyToken)(), (0, adminMiddleware_1.adminMiddleWare)(), adminController.listCandidates);
router.post("/block-candidates", (0, verifyTokenMiddleware_1.verifyToken)(), (0, adminMiddleware_1.adminMiddleWare)(), adminController.blockCandidate);
exports.default = router;
