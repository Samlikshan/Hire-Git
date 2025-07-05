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
const stripe_1 = __importDefault(require("stripe"));
const CreateSubscriptionCheckoutUseCase_1 = require("../../domain/usecases/company/Subscription/CreateSubscriptionCheckoutUseCase");
const SubscriptionRepository_1 = require("../../infrastructure/database/repositories/SubscriptionRepository");
const SubscriptionCheckoutUseCase_1 = require("../../domain/usecases/company/Subscription/SubscriptionCheckoutUseCase");
const MySubscriptionsUseCase_1 = require("../../domain/usecases/company/Subscription/MySubscriptionsUseCase");
const CancelPaymentSessionUseCase_1 = require("../../domain/usecases/company/Subscription/CancelPaymentSessionUseCase");
class SubscriptionController {
    constructor() {
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: process.env.STRIPE_APP_VERSION,
        });
        this.subscriptionRepository = new SubscriptionRepository_1.SubscriptionRepository();
        this.createSubscriptionCheckoutUsecase = new CreateSubscriptionCheckoutUseCase_1.CreateSubscriptionCheckoutUseCase(this.stripe, this.subscriptionRepository);
        this.subscriptionCheckoutUseCase = new SubscriptionCheckoutUseCase_1.SubscriptionCheckoutUseCase(this.stripe, this.subscriptionRepository);
        this.mySubscriptionsUseCase = new MySubscriptionsUseCase_1.MySubScriptoinsUseCase(this.subscriptionRepository);
        this.cancelPaymentSessionUseCase = new CancelPaymentSessionUseCase_1.CancelPaymentSessionUseCase(this.subscriptionRepository);
        this.createCheckoutSession = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { priceId } = req.body;
                const user = req.user;
                const response = yield this.createSubscriptionCheckoutUsecase.execute(priceId, user === null || user === void 0 ? void 0 : user.id);
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.cancelCheckoutSession = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionId } = req.params;
                const user = req.user;
                const response = yield this.cancelPaymentSessionUseCase.execute(user === null || user === void 0 ? void 0 : user.id, sessionId);
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.verifyPayment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionId } = req.params;
                const user = req.user;
                const response = yield this.subscriptionCheckoutUseCase.execute(user === null || user === void 0 ? void 0 : user.id, sessionId);
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.mySubscriptions = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const response = yield this.mySubscriptionsUseCase.execute(user === null || user === void 0 ? void 0 : user.id);
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.SubscriptionController = SubscriptionController;
