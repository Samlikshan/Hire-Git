"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const CreateSubscriptionUseCase_1 = require("../../../domain/usecases/Admin/SubscriptionPlans/CreateSubscriptionUseCase");
const SubscriptionPlansRepository_1 = require("../../../infrastructure/database/repositories/SubscriptionPlansRepository");
const ListSubscriptionUseCase_1 = require("../../../domain/usecases/Admin/SubscriptionPlans/ListSubscriptionUseCase");
const UpdateSubscriptionUseCase_1 = require("../../../domain/usecases/Admin/SubscriptionPlans/UpdateSubscriptionUseCase");
const DeleteSubscriptionUseCase_1 = require("../../../domain/usecases/Admin/SubscriptionPlans/DeleteSubscriptionUseCase");
const SubscriptionRepository_1 = require("../../../infrastructure/database/repositories/SubscriptionRepository");
const SubscriptionHistoryUseCase_1 = require("../../../domain/usecases/Admin/Subscription/SubscriptionHistoryUseCase");
const stripe_1 = __importDefault(require("stripe"));
class SubscriptionController {
    constructor() {
        this.subscriptionPlanRepository = new SubscriptionPlansRepository_1.SubscriptionPlanRepository();
        this.subscriptionRepository = new SubscriptionRepository_1.SubscriptionRepository();
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: process.env.STRIPE_APP_VERSION,
        });
        //useCases
        this.createSubscriptionUseCase = new CreateSubscriptionUseCase_1.CreateSubscriptionUseCase(this.subscriptionPlanRepository);
        this.updateSubscriptionUseCase = new UpdateSubscriptionUseCase_1.UpdateSubscriptionUseCase(this.subscriptionPlanRepository);
        this.listSubscriptionUseCase = new ListSubscriptionUseCase_1.ListSubscriptionUseCase(this.subscriptionPlanRepository);
        this.deleteSubscriptionUseCase = new DeleteSubscriptionUseCase_1.DeleteSubscriptionUseCase(this.subscriptionPlanRepository);
        this.subscriptionHistoryUseCase = new SubscriptionHistoryUseCase_1.SubscriptionHistoryUseCase(this.stripe, this.subscriptionRepository, this.subscriptionPlanRepository);
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newPlan = req.body;
                const response = yield this.createSubscriptionUseCase.execute(newPlan);
                res.json({ message: response.message, newPlan: response.newPlan });
            }
            catch (error) {
                next(error);
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { planId, updatedPlan } = req.body;
                const response = yield this.updateSubscriptionUseCase.execute(planId, updatedPlan);
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.list = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.listSubscriptionUseCase.execute();
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { planId } = req.params;
                const response = yield this.deleteSubscriptionUseCase.execute(planId);
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.dashboard = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filterBy = req.query.filterBy || "1m";
                const response = yield this.subscriptionHistoryUseCase.execute(filterBy);
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.SubscriptionController = SubscriptionController;
