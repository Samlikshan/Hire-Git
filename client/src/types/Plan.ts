export interface Plan {
  _id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  // annualPrice: number;
  stripePriceId: string;
  features: { [key: string]: string | number };
  isPopular: boolean;
  isActive: boolean;
}
