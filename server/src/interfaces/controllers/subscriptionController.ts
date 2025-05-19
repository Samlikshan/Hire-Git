import Stripe from "stripe";
import { CreateSubscriptionCheckoutUseCase } from "../../domain/usecases/company/Subscription/CreateSubscriptionCheckoutUseCase";
import { SubscriptionRepository } from "../../infrastructure/database/repositories/SubscriptionRepository";
import { NextFunction, Request, Response } from "express";
import { SubscriptionCheckoutUseCase } from "../../domain/usecases/company/Subscription/SubscriptionCheckoutUseCase";
import { MySubScriptoinsUseCase } from "../../domain/usecases/company/Subscription/MySubscriptionsUseCase";

export class SubscriptionController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: process.env.STRIPE_APP_VERSION! as "2025-03-31.basil",
  });
  private subscriptionRepository = new SubscriptionRepository();

  private createSubscriptionCheckoutUsecase =
    new CreateSubscriptionCheckoutUseCase(
      this.stripe,
      this.subscriptionRepository
    );

  private subscriptionCheckoutUseCase = new SubscriptionCheckoutUseCase(
    this.stripe,
    this.subscriptionRepository
  );

  private mySubscriptionsUseCase = new MySubScriptoinsUseCase(
    this.subscriptionRepository
  );

  createCheckoutSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { priceId } = req.body;
      const user = req.user;
      const response = await this.createSubscriptionCheckoutUsecase.execute(
        priceId,
        user?.id!
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;
      const user = req.user;
      const response = await this.subscriptionCheckoutUseCase.execute(
        user?.id!,
        sessionId
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  mySubscriptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const response = await this.mySubscriptionsUseCase.execute(user?.id!);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
