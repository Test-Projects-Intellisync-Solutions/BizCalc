import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, Building, Sparkles, Cpu, Database, Lock, Users, BarChart, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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

  const plans = [
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
      description: 'Advanced tools for growing businesses',
      monthlyPrice: 29.99,
      features: [
        'All Basic features',
        '10+ advanced calculators',
        'Basic AI financial insights',
        'Data export (CSV, PDF)',
        'Email support',
        'API access (100 calls/day)',
        'Up to 3 team members'
      ],
      notIncluded: [
        'Custom calculators',
        'Database integrations',
        'White-labeling options',
        'Dedicated account manager'
      ],
      cta: 'Start Free Trial',
      popular: true,
      icon: Sparkles
    },
    {
      name: 'Business',
      description: 'Comprehensive solution for established businesses',
      monthlyPrice: 79.99,
      features: [
        'All Pro features',
        'Full calculator suite',
        'Advanced AI analytics',
        'Database integrations',
        'Priority support',
        'API access (1000 calls/day)',
        'Up to 10 team members',
        'Custom reporting',
        'Data visualization tools'
      ],
      notIncluded: [
        'Custom development',
        'Dedicated account manager',
        'White-labeling options'
      ],
      cta: 'Start Free Trial',
      popular: false,
      icon: Building
    },
    {
      name: 'Enterprise',
      description: 'Tailored solutions for large organizations',
      monthlyPrice: 'Custom',
      features: [
        'All Business features',
        'Unlimited calculators',
        'Custom calculator development',
        'Advanced AI integrations',
        'Unlimited team members',
        'Dedicated account manager',
        'White-labeling options',
        'Custom database integrations',
        'Unlimited API access',
        'SSO & advanced security',
        'On-premise deployment option'
      ],
      notIncluded: [],
      cta: 'Contact Sales',
      popular: false,
      icon: BrainCircuit
    }
  ];

  // Features for the comparison table
  const comparisonFeatures = [
    { 
      category: 'Core Features',
      features: [
        { name: 'Financial Calculators', basic: true, pro: true, business: true, enterprise: true },
        { name: 'Documentation Access', basic: true, pro: true, business: true, enterprise: true },
        { name: 'Mobile Access', basic: true, pro: true, business: true, enterprise: true },
        { name: 'Data Export Options', basic: false, pro: true, business: true, enterprise: true },
        { name: 'API Access', basic: false, pro: '100 calls/day', business: '1000 calls/day', enterprise: 'Unlimited' }
      ]
    },
    {
      category: 'Advanced Tools',
      features: [
        { name: 'Advanced Calculators', basic: false, pro: true, business: true, enterprise: true },
        { name: 'Custom Calculators', basic: false, pro: false, business: false, enterprise: true },
        { name: 'Financial Projections', basic: false, pro: true, business: true, enterprise: true },
        { name: 'Scenario Planning', basic: false, pro: false, business: true, enterprise: true },
        { name: 'Risk Analysis', basic: false, pro: false, business: true, enterprise: true }
      ]
    },
    {
      category: 'AI & Analytics',
      features: [
        { name: 'Basic AI Insights', basic: false, pro: true, business: true, enterprise: true },
        { name: 'Advanced AI Analytics', basic: false, pro: false, business: true, enterprise: true },
        { name: 'Custom AI Models', basic: false, pro: false, business: false, enterprise: true },
        { name: 'Predictive Analytics', basic: false, pro: false, business: true, enterprise: true },
        { name: 'Industry Benchmarking', basic: false, pro: false, business: true, enterprise: true }
      ]
    },
    {
      category: 'Collaboration',
      features: [
        { name: 'Team Members', basic: '1 user', pro: 'Up to 3', business: 'Up to 10', enterprise: 'Unlimited' },
        { name: 'Shared Workspaces', basic: false, pro: true, business: true, enterprise: true },
        { name: 'Role-Based Access', basic: false, pro: false, business: true, enterprise: true },
        { name: 'Audit Logs', basic: false, pro: false, business: true, enterprise: true },
        { name: 'SSO Integration', basic: false, pro: false, business: false, enterprise: true }
      ]
    },
    {
      category: 'Support & Services',
      features: [
        { name: 'Support Level', basic: 'Community', pro: 'Email', business: 'Priority', enterprise: 'Dedicated' },
        { name: 'Onboarding', basic: 'Self-serve', pro: 'Guided', business: 'Full setup', enterprise: 'White glove' },
        { name: 'Training Sessions', basic: false, pro: false, business: '2 sessions', enterprise: 'Unlimited' },
        { name: 'SLA', basic: false, pro: false, business: false, enterprise: true },
        { name: 'Custom Development', basic: false, pro: false, business: false, enterprise: true }
      ]
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Choose the Right Plan for Your Business
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          From startups to enterprises, we have flexible pricing options to meet your financial planning needs.
        </p>
        
        {/* Billing toggle */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <Tabs 
            value={billingCycle} 
            onValueChange={(value) => setBillingCycle(value as 'monthly' | 'annually')}
            className="inline-flex bg-muted p-1 rounded-lg"
          >
            <TabsList className="grid grid-cols-2 w-[300px]">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="annually">
                Annually
                <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                  Save {annualDiscount}%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Pricing cards */}
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {plans.map((plan, index) => {
          const PlanIcon = plan.icon;
          return (
            <motion.div key={plan.name} variants={itemVariants}>
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
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    {typeof plan.monthlyPrice === 'number' ? (
                      <>
                        <span className="text-4xl font-bold">${calculatePrice(plan.monthlyPrice)}</span>
                        <span className="text-muted-foreground ml-1">/month</span>
                        {billingCycle === 'annually' && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Billed annually (${(parseFloat(calculatePrice(plan.monthlyPrice)) * 12).toFixed(2)})
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-4xl font-bold">{plan.monthlyPrice}</span>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.notIncluded.length > 0 && (
                      <>
                        <h4 className="font-medium pt-2">Not included:</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          {plan.notIncluded.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <X className="h-5 w-5 text-muted-foreground/70 mr-2 shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Feature comparison */}
      <div className="mt-24 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Compare Plan Features</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-medium text-lg w-1/3">Features</th>
                <th className="text-center py-4 px-4 font-medium text-lg">Basic</th>
                <th className="text-center py-4 px-4 font-medium text-lg">Pro</th>
                <th className="text-center py-4 px-4 font-medium text-lg">Business</th>
                <th className="text-center py-4 px-4 font-medium text-lg">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((category, categoryIndex) => (
                <>
                  <tr key={`category-${categoryIndex}`} className="bg-muted/50">
                    <td colSpan={5} className="py-3 px-4 font-semibold">{category.category}</td>
                  </tr>
                  {category.features.map((feature, featureIndex) => (
                    <tr key={`feature-${categoryIndex}-${featureIndex}`} className="border-b">
                      <td className="py-3 px-4">{feature.name}</td>
                      <td className="text-center py-3 px-4">
                        {feature.basic === true ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : feature.basic === false ? (
                          <X className="h-5 w-5 text-muted-foreground/70 mx-auto" />
                        ) : (
                          <span>{feature.basic}</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {feature.pro === true ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : feature.pro === false ? (
                          <X className="h-5 w-5 text-muted-foreground/70 mx-auto" />
                        ) : (
                          <span>{feature.pro}</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {feature.business === true ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : feature.business === false ? (
                          <X className="h-5 w-5 text-muted-foreground/70 mx-auto" />
                        ) : (
                          <span>{feature.business}</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {feature.enterprise === true ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : feature.enterprise === false ? (
                          <X className="h-5 w-5 text-muted-foreground/70 mx-auto" />
                        ) : (
                          <span>{feature.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enterprise callout */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 mb-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold">Need a custom solution?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Our Enterprise plan offers tailored solutions for large organizations with complex needs. 
              Get custom calculators, dedicated support, and advanced AI integrations.
            </p>
          </div>
          <div className="shrink-0">
            <Button size="lg" className="px-8">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">What happens after my free trial?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>After your 14-day free trial ends, your account will automatically switch to the Basic plan unless you choose to upgrade. We'll send you reminders before your trial ends, and you can upgrade or cancel at any time.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Can I change plans later?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Yes, you can upgrade, downgrade, or cancel your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes will take effect at the end of your current billing cycle.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Do you offer discounts for nonprofits or educational institutions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Yes, we offer special pricing for nonprofits, educational institutions, and startups. Please contact our sales team to learn more about our discount programs.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans. Enterprise customers can also pay by invoice.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Is my data secure?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Yes, we take data security seriously. We use industry-standard encryption, regular security audits, and strict access controls. Your data is never shared with third parties, and you can export or delete your data at any time.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">What kind of support is included?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Basic plans include community support. Pro plans add email support with 24-hour response times. Business plans include priority support with 4-hour response times. Enterprise plans come with a dedicated account manager and custom SLAs.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join thousands of businesses using BusinessOne to make smarter financial decisions.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="px-8">Start Free Trial</Button>
          <Button size="lg" variant="outline">View Demo</Button>
        </div>
      </div>
    </div>
  );
}