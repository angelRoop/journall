import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { TrendingUp, BarChart3, Brain, Calendar } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Track every trade',
      description: 'Record all your trades with detailed information including P&L, tags, and emotions to build a comprehensive trading history.',
    },
    {
      icon: BarChart3,
      title: 'Analyze performance',
      description: 'Visualize your trading performance with interactive charts and statistics to identify patterns and improve your strategy.',
    },
    {
      icon: Brain,
      title: 'Manage emotions',
      description: 'Track your emotional state during trades to understand how psychology affects your trading decisions and outcomes.',
    },
    {
      icon: Calendar,
      title: 'Calendar view',
      description: 'See your trades organized by date in an intuitive calendar interface to spot trends and plan your trading schedule.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>TradeJournal - Professional trading journal for serious traders</title>
        <meta name="description" content="Track your trades, analyze performance, and manage emotions with TradeJournal. The professional trading journal built for serious traders." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="relative py-20 lg:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
                    Master your trading with data-driven insights
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-prose">
                    TradeJournal helps you track every trade, analyze your performance, and understand the emotions behind your decisions. Build better trading habits with comprehensive analytics.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/dashboard">
                      <Button size="lg" className="gap-2">
                        Get started free
                        <TrendingUp className="w-5 h-5" />
                      </Button>
                    </Link>
                    <Link to="/add-trade">
                      <Button size="lg" variant="outline">
                        Add a trade
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl blur-3xl"></div>
                  <img
                    src="https://images.unsplash.com/photo-1640340435016-1964cf4e723b"
                    alt="Professional trading workspace with multiple monitors showing financial charts and data"
                    className="relative rounded-2xl shadow-2xl w-full"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 bg-muted/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Everything you need to improve your trading
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Powerful features designed to help you track, analyze, and optimize your trading performance.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="border-2 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-8">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to take your trading to the next level?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join traders who are using data and analytics to make better trading decisions every day.
              </p>
              <Link to="/dashboard">
                <Button size="lg" className="gap-2">
                  Start tracking your trades
                  <TrendingUp className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;