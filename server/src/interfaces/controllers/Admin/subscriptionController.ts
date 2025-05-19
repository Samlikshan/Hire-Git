import { NextFunction, Request, Response } from "express";
import { CreateSubscriptionUseCase } from "../../../domain/usecases/Admin/SubscriptionPlans/CreateSubscriptionUseCase";
import { SubscriptionPlanRepository } from "../../../infrastructure/database/repositories/SubscriptionPlansRepository";
import { ListSubscriptionUseCase } from "../../../domain/usecases/Admin/SubscriptionPlans/ListSubscriptionUseCase";
import { UpdateSubscriptionUseCase } from "../../../domain/usecases/Admin/SubscriptionPlans/UpdateSubscriptionUseCase";
import { DeleteSubscriptionUseCase } from "../../../domain/usecases/Admin/SubscriptionPlans/DeleteSubscriptionUseCase";
import { SubscriptionRepository } from "../../../infrastructure/database/repositories/SubscriptionRepository";
import { SubscriptionHistoryUseCase } from "../../../domain/usecases/Admin/Subscription/SubscriptionHistoryUseCase";
import Stripe from "stripe";

export class SubscriptionController {
  private subscriptionPlanRepository = new SubscriptionPlanRepository();
  private subscriptionRepository = new SubscriptionRepository();
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: process.env.STRIPE_APP_VERSION! as "2025-03-31.basil",
  });
  //useCases
  private createSubscriptionUseCase = new CreateSubscriptionUseCase(
    this.subscriptionPlanRepository
  );
  private updateSubscriptionUseCase = new UpdateSubscriptionUseCase(
    this.subscriptionPlanRepository
  );
  private listSubscriptionUseCase = new ListSubscriptionUseCase(
    this.subscriptionPlanRepository
  );
  private deleteSubscriptionUseCase = new DeleteSubscriptionUseCase(
    this.subscriptionPlanRepository
  );
  private subscriptionHistoryUseCase = new SubscriptionHistoryUseCase(
    this.stripe,
    this.subscriptionRepository,
    this.subscriptionPlanRepository
  );

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newPlan = req.body;

      const response = await this.createSubscriptionUseCase.execute(newPlan);
      res.json({ message: response.message, newPlan: response.newPlan });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId, updatedPlan } = req.body;
      const response = await this.updateSubscriptionUseCase.execute(
        planId,
        updatedPlan
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.listSubscriptionUseCase.execute();

      res.json(response);
    } catch (error) {
      next(error);
    }
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId } = req.params;
      const response = await this.deleteSubscriptionUseCase.execute(planId);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  dashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filterBy =
        (req.query.filterBy as "7d" | "1m" | "6m" | "1y" | "all") || "1m";
      const response = await this.subscriptionHistoryUseCase.execute(filterBy);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
