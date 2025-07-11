
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Package, TrendingUp, Upload, ArrowRight, CheckCircle } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload className="w-8 h-8 text-blue-600" />,
      title: 'CSV Data Upload',
      description: 'Upload inventory and store data to run optimization algorithms'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
      title: 'Smart Analytics',
      description: 'Get insights on inventory levels, sales predictions, and stock optimization'
    },
    {
      icon: <Package className="w-8 h-8 text-purple-600" />,
      title: 'Transfer Suggestions',
      description: 'Automatic suggestions for optimal product transfers between stores'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      title: 'Dynamic Pricing',
      description: 'AI-powered pricing recommendations based on expiry dates and demand'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Package className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">SmartStockX</span>
          </div>
          <div className="flex space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button onClick={() => navigate('/run-optimization')}>
              Run Optimization
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Smart Inventory
            <span className="text-blue-600"> Optimization</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Maximize profits, minimize waste. Our AI-powered platform optimizes inventory management,
            suggests strategic transfers, and implements dynamic pricing across your retail network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/run-optimization')}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
            >
              <Upload className="w-5 h-5 mr-2" />
              Start Optimization
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="text-lg px-8 py-4 border-2"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Smart Retailers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to optimize your inventory and maximize profitability
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Simple steps to transform your inventory management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Data</h3>
              <p className="text-blue-100">Upload your inventory and store CSV files</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-blue-100">Our algorithms analyze and optimize your inventory</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Results</h3>
              <p className="text-blue-100">Receive actionable insights and transfer suggestions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Optimize Your Inventory?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join retailers who are already maximizing their profits with SmartStockX
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/run-optimization')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
          >
            <Upload className="w-5 h-5 mr-2" />
            Start Your Optimization
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Package className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold">SmartStockX</span>
          </div>
          <p className="text-gray-400">
            Intelligent inventory optimization for modern retailers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
