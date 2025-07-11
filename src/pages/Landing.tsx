
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Package className="w-8 h-8 text-blue-600" />,
      title: "Smart Inventory Management",
      description: "Track stock levels, expiry dates, and product pricing across all stores"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Price Optimization",
      description: "AI-powered price suggestions to maximize sales and reduce waste"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Advanced Analytics",
      description: "Real-time dashboards with sales forecasting and performance metrics"
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: "Multi-Store Management",
      description: "Centralized control for up to 30 stores with transfer suggestions"
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: "Loss Prevention",
      description: "Early expiry alerts and automated transfer recommendations"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Automated Workflows",
      description: "Streamline operations with approval workflows and notifications"
    }
  ];

  const stats = [
    { label: "Active Stores", value: "30+", color: "text-blue-600" },
    { label: "Products Tracked", value: "10K+", color: "text-green-600" },
    { label: "Cost Savings", value: "25%", color: "text-purple-600" },
    { label: "Waste Reduction", value: "40%", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">InventoryPro</h1>
            </div>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Access Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 px-4 py-2">
            Advanced Inventory Management System
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Optimize Your Inventory
            <span className="text-blue-600 block mt-2">Maximize Your Profits</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your multi-store operations with AI-powered insights, 
            automated transfer suggestions, and real-time analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="px-8 py-3"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Inventory
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and features designed to streamline your operations 
              and boost profitability across all locations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {feature.icon}
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Inventory Management?
          </h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of retailers who have optimized their operations with InventoryPro.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
          >
            Start Your Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Package className="w-6 h-6" />
              <span className="text-xl font-bold">InventoryPro</span>
            </div>
            <div className="flex items-center space-x-4">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Trusted by 500+ businesses</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
