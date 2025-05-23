import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, Building, Sparkles, BrainCircuit, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Plan {
  name: string;
  description: string;
  monthlyPrice: number;
  features: string[];
  notIncluded?: string[];
  cta: string;
  popular: boolean;
  icon: LucideIcon;
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  
  // Define discount percentage for annual billing
  const annualDiscount = 20;
  
  // Calculate prices with discount for annual billing
  const calculatePrice = (monthlyPrice: number) => {
    if (billingCycle === 'annually') {
      const annualPrice = monthlyPrice * 12;
      const discountAmount = annualPrice * (annualDiscount / 100);
      return ((annualPrice - discountAmount) / 12).toFixed(2);
    }
    return monthlyPrice.toFixed(2);
  };



  const plans: Plan[] = [
    {
      name: 'Basic',
      description: 'Essential financial tools for individuals and startups',
      monthlyPrice: 0,
      features: [
        'All current calculators',
        'Basic financial reports',
        'Single user access',
        'Community support',
        'Standard documentation'
      ],
      notIncluded: [
        'Advanced calculators',
        'AI-powered insights',
        'Team collaboration',
        'Data export options',
        'Priority support'
      ],
      cta: 'Get Started',
      popular: false,
      icon: Zap
    },
    {
      name: 'Pro',
      description: 'Advanced features for growing businesses and professionals',
      monthlyPrice: 29.99,
      features: [
        'Everything in Basic',
        'Advanced calculators',
        'AI-powered insights',
        'Up to 5 team members',
        'Email support',
        'Data export options',
        'API access (limited)'
      ],
      notIncluded: [
        'Unlimited team members',
        'Priority support',
        'Custom development',
        'Dedicated account manager'
      ],
      cta: 'Start Free Trial',
      popular: true,
      icon: Sparkles
    },
    {
      name: 'Business',
      description: 'Complete solution for teams and organizations',
      monthlyPrice: 99.99,
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Priority support',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated account manager',
        'Custom development',
        'SAML SSO',
        'Compliance reporting'
      ],
      cta: 'Contact Sales',
      popular: false,
      icon: Building
    }
  ];

  // Animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  } as const;

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Choose the Right Plan for Your Business
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Select the plan that best fits your needs. Start with our free plan and upgrade anytime.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Button
            variant={billingCycle === 'monthly' ? 'default' : 'outline'}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly Billing
          </Button>
          <Button
            variant={billingCycle === 'annually' ? 'default' : 'outline'}
            onClick={() => setBillingCycle('annually')}
          >
            Annual Billing (Save {annualDiscount}%)
          </Button>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const PlanIcon = plan.icon;
          return (
            <motion.div 
              key={plan.name} 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="h-full"
            >
              <Card className={`h-full flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`p-2 rounded-full ${plan.popular ? 'bg-primary/20' : 'bg-muted'}`}>
                      <PlanIcon className={`h-5 w-5 ${plan.popular ? 'text-primary' : ''}`} />
                    </div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${calculatePrice(plan.monthlyPrice)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                    {billingCycle === 'annually' && (
                      <span className="ml-2 text-sm text-green-600">
                        Save {annualDiscount}% annually
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded?.map((item) => (
                      <li key={item} className="flex items-center text-muted-foreground">
                        <X className="h-4 w-4 text-muted-foreground/50 mr-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg">
                    {plan.cta || 'Get Started'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
