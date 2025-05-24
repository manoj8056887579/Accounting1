
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Building, 
  Package, 
  CreditCard, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  Settings, 
  Users, 
  Globe, 
  Database, 
  Bot, 
  ChevronDown, 
  X, 
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';

const SuperWebsite = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Building className="h-10 w-10 text-primary" />,
      title: "Multi-Organization Management",
      description: "Create and manage multiple organizations with separate data and user roles."
    },
    {
      icon: <Package className="h-10 w-10 text-primary" />,
      title: "Flexible Subscription Plans",
      description: "Configure custom subscription plans with different features and pricing tiers."
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Multiple Payment Gateways",
      description: "Support for various payment gateways including Razorpay, with more coming soon."
    },
    {
      icon: <Mail className="h-10 w-10 text-primary" />,
      title: "SMTP & WhatsApp Integration",
      description: "Set up custom email notifications and WhatsApp business messaging."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Advanced User Management",
      description: "Role-based access controls and customizable permissions system."
    },
    {
      icon: <Database className="h-10 w-10 text-primary" />,
      title: "Centralized Administration",
      description: "Single dashboard to manage all aspects of your SaaS platform."
    }
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "₹999",
      description: "Essential features for small businesses" ,
      features: [
        "10 Users",
        "Basic Inventory Management",
        "Simple POS System",
        "Standard Support",
        "5GB Storage"
      ],
      isPopular: false
    },
    {
      name: "Standard",
      price: "₹1,999",
      description: "Perfect for growing businesses",
      features: [
        "25 Users",
        "Advanced Inventory Management",
        "Complete POS System",
        "Priority Support",
        "15GB Storage",
        "CRM Integration",
        "Basic Reports"
      ],
      isPopular: true
    },
    {
      name: "Premium",
      price: "₹3,999",
      description: "Advanced features for larger operations",
      features: [
        "Unlimited Users",
        "Complete Inventory Management",
        "Advanced POS System",
        "24/7 Priority Support",
        "50GB Storage",
        "Full CRM Integration",
        "Advanced Reports",
        "WhatsApp Integration",
        "Multi-branch Support"
      ],
      isPopular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Header / Navigation */}
      <header className={`sticky top-0 z-40 w-full transition-all duration-200 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-bizblue-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-bizblue-500 to-bizteal-500 bg-clip-text text-transparent">BizApp</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-bizblue-500 transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium hover:text-bizblue-500 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-bizblue-500 transition-colors">Testimonials</a>
            <a href="#faq" className="text-sm font-medium hover:text-bizblue-500 transition-colors">FAQ</a>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" asChild className="rounded-full">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="rounded-full bg-gradient-to-r from-bizblue-500 to-bizteal-500 hover:from-bizblue-600 hover:to-bizteal-600 transition-all">
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container py-4 flex flex-col space-y-4">
              <a href="#features" className="text-sm font-medium hover:text-bizblue-500 transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#pricing" className="text-sm font-medium hover:text-bizblue-500 transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#testimonials" className="text-sm font-medium hover:text-bizblue-500 transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
              <a href="#faq" className="text-sm font-medium hover:text-bizblue-500 transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                </Button>
                <Button asChild className="w-full bg-gradient-to-r from-bizblue-500 to-bizteal-500">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-bizteal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-bizblue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-bizblue-600 to-bizteal-600 bg-clip-text text-transparent">
                Complete Business Management Solution
              </h1>
              <p className="text-xl text-slate-600 md:w-3/4 mx-auto">
                An all-in-one SaaS platform that helps businesses manage their inventory, 
                sales, accounting, and customer relationships with powerful tools.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <Button size="lg" asChild className="rounded-full bg-gradient-to-r from-bizblue-500 to-bizteal-500 hover:from-bizblue-600 hover:to-bizteal-600 text-lg px-8 py-6 shadow-lg shadow-bizblue-500/20 hover:shadow-xl hover:shadow-bizblue-500/30 transition-all">
                <Link to="/login">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full border-2 hover:bg-slate-50 text-lg px-8 py-6">
                Request Demo
              </Button>
            </div>
          </div>
          
          {/* Featured companies */}
          <div className="mt-16 md:mt-24">
            <p className="text-center text-sm uppercase tracking-widest text-slate-500 font-medium mb-6">Trusted by leading companies</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-70">
              <div className="text-xl font-bold text-slate-700">TechCorp</div>
              <div className="text-xl font-bold text-slate-700">GlobalFinance</div>
              <div className="text-xl font-bold text-slate-700">RetailMaster</div>
              <div className="text-xl font-bold text-slate-700">HealthSolutions</div>
              <div className="text-xl font-bold text-slate-700">EduConnect</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlight Section */}
      <section id="features" className="py-20 md:py-28 lg:py-32 bg-white">
        <div className="container">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-bizteal-100 text-bizteal-700 rounded-full mb-2">
              <span className="text-sm font-medium">Powerful Features</span>
            </div>
            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                Everything You Need to Run Your Business
              </h2>
              <p className="text-lg text-slate-600 md:w-3/4 mx-auto">
                Streamline operations, boost productivity, and gain valuable insights with our comprehensive suite of business tools.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <Card key={index} className="border border-slate-200 transition-all duration-300 hover:shadow-lg hover:border-bizteal-200 overflow-hidden group">
                <CardHeader>
                  <div className="p-3 w-16 h-16 rounded-2xl bg-gradient-to-br from-bizblue-50 to-bizteal-50 flex items-center justify-center group-hover:from-bizblue-100 group-hover:to-bizteal-100 transition-colors">
                    <div className="text-bizblue-500">{feature.icon}</div>
                  </div>
                  <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-28 lg:py-32 bg-slate-50">
        <div className="container">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-bizblue-100 text-bizblue-700 rounded-full mb-2">
              <span className="text-sm font-medium">Simple Pricing</span>
            </div>
            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                Choose the Perfect Plan for Your Business
              </h2>
              <p className="text-lg text-slate-600 md:w-3/4 mx-auto">
                Flexible options designed to scale with your business needs. All plans come with a 14-day free trial.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`overflow-hidden flex flex-col transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${plan.isPopular ? 'border-bizteal-500 shadow-lg relative' : 'border-slate-200'}`}>
                {plan.isPopular && (
                  <div className="absolute -right-12 top-6 bg-gradient-to-r from-bizblue-500 to-bizteal-500 text-white px-12 py-1 rotate-45 font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader className={plan.isPopular ? 'bg-gradient-to-br from-bizblue-50 to-bizteal-50' : ''}>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-slate-500">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-bizteal-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <Button 
                    className={`w-full py-6 text-base ${plan.isPopular ? 'bg-gradient-to-r from-bizblue-500 to-bizteal-500 hover:from-bizblue-600 hover:to-bizteal-600' : ''}`} 
                    variant={plan.isPopular ? "default" : "outline"}
                    asChild
                  >
                    <Link to="/login">
                      {plan.isPopular ? "Start Free Trial" : "Get Started"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-28 lg:py-32 bg-white">
        <div className="container">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-bizblue-100 text-bizblue-700 rounded-full mb-2">
              <span className="text-sm font-medium">Customer Stories</span>
            </div>
            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                Trusted by Businesses Everywhere
              </h2>
              <p className="text-lg text-slate-600 md:w-3/4 mx-auto">
                See what our customers have to say about their experience with BizApp.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {[
              {
                quote: "This SaaS solution has completely transformed how we manage our inventory and sales. The super admin features are exactly what we needed for our multi-branch operation.",
                author: "Priya Sharma",
                position: "CEO, Retail Enterprises",
                image: "https://randomuser.me/api/portraits/women/32.jpg"
              },
              {
                quote: "The flexibility of the subscription plans allowed us to start small and scale as our business grew. The WhatsApp integration has been a game-changer for our customer service.",
                author: "Rahul Mehta",
                position: "Operations Manager, TechSolutions",
                image: "https://randomuser.me/api/portraits/men/47.jpg"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-slate-50 border-slate-200 overflow-hidden">
                <CardContent className="pt-8 px-8">
                  <div className="flex flex-col gap-6">
                    <div className="flex text-bizteal-500">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-lg italic">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="flex items-center mt-4">
                      <div className="rounded-full overflow-hidden w-14 h-14 mr-4">
                        <img src={testimonial.image} alt={testimonial.author} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{testimonial.author}</p>
                        <p className="text-sm text-slate-500">{testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-28 lg:py-32 bg-slate-50">
        <div className="container">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-bizblue-100 text-bizblue-700 rounded-full mb-2">
              <span className="text-sm font-medium">Common Questions</span>
            </div>
            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-slate-600 md:w-3/4 mx-auto">
                Find answers to common questions about our platform and services.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-16 max-w-4xl mx-auto">
            {[
              {
                question: "How does the multi-organization feature work?",
                answer: "Each organization gets its own isolated data environment with separate users, roles, and permissions. The super admin can manage all organizations from a central dashboard."
              },
              {
                question: "Can I customize the subscription plans?",
                answer: "Yes, as a super admin you can create custom subscription plans with different features, user limits, and pricing tiers."
              },
              {
                question: "Do you support international payment methods?",
                answer: "We currently support Razorpay with plans to add more international payment gateways soon."
              },
              {
                question: "How secure is my business data?",
                answer: "We implement industry-standard security measures including data encryption, regular backups, and strict access controls."
              }
            ].map((faq, index) => (
              <Card key={index} className="border border-slate-200 transition-all duration-300 hover:shadow-md hover:border-bizteal-200">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 lg:py-32 bg-gradient-to-br from-bizblue-600 to-bizteal-600 text-white">
        <div className="container">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Ready to supercharge your business?
              </h2>
              <p className="text-xl text-white/90 md:w-3/4 mx-auto">
                Get started with a 14-day free trial. No credit card required.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <Button size="lg" asChild className="rounded-full bg-white text-bizblue-600 hover:bg-white/90 text-lg px-8 py-6">
                <Link to="/login">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full border-2 border-white/70 text-white hover:bg-white/10 text-lg px-8 py-6">
                <Link to="/login">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-900 text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            <div className="space-y-6 md:w-1/3">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-bizteal-400" />
                <span className="text-2xl font-bold text-white">BizApp</span>
              </div>
              <p className="text-slate-400">
                A complete business management solution for modern enterprises. Streamline operations, boost productivity, and gain valuable insights.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Integrations</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Updates</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Tutorials</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Support</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Legal</a></li>
                </ul>
              </div>
            </div>
          </div>
          <Separator className="my-10 bg-slate-800" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} BizApp. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SuperWebsite;
