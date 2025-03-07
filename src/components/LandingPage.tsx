
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Brain, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-studbud-100 rounded-full filter blur-3xl opacity-60 animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-50 animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-block mb-4 px-3 py-1 bg-studbud-100 text-studbud-700 rounded-full text-sm font-medium animate-fade-in" style={{ animationDelay: '0.1s' }}>
              AI-Powered Study Planning
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 max-w-4xl animate-fade-in text-balance" style={{ animationDelay: '0.2s' }}>
              Smart AI Study Planner — <span className="bg-clip-text text-transparent bg-gradient-to-r from-studbud-700 to-studbud-500">Personalized for You</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Create the perfect study schedule tailored to your goals, available time, and subject difficulty. Optimize your learning with AI assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link
                to="/study-details"
                className={cn(
                  "btn-primary flex items-center justify-center gap-2",
                  "px-6 py-3 rounded-full bg-studbud-500 text-white font-medium",
                  "hover:bg-studbud-600 shadow-lg hover:shadow-xl",
                  "transition-all duration-300 hover:scale-105 active:scale-95"
                )}
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          
          {/* Preview Mockup */}
          <div className="relative mx-auto w-full max-w-4xl animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="glass-card p-4 md:p-8 shadow-xl">
              <div className="bg-white rounded-lg p-4 md:p-6">
                <div className="grid grid-cols-7 gap-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-center font-medium text-gray-800">{day}</div>
                  ))}
                  
                  {Array.from({ length: 7 }).map((_, dayIndex) => (
                    <div key={dayIndex} className="space-y-2">
                      {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, sessionIndex) => {
                        const colors = [
                          'bg-studbud-100 text-studbud-700 border-studbud-200',
                          'bg-blue-50 text-blue-700 border-blue-100',
                          'bg-green-50 text-green-700 border-green-100',
                          'bg-purple-50 text-purple-700 border-purple-100',
                          'bg-orange-50 text-orange-700 border-orange-100'
                        ];
                        const colorIndex = Math.floor(Math.random() * colors.length);
                        
                        return (
                          <div 
                            key={sessionIndex}
                            className={`${colors[colorIndex]} rounded-lg p-2 text-xs border shadow-sm hover-card`}
                          >
                            <div className="font-medium">Math</div>
                            <div>15:00-16:30</div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Studbud Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform creates the perfect study plan based on your specific needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1 + 0.2}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-xl flex flex-col md:flex-row">
            <div className="md:w-3/5 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Ready to optimize your study routine?
              </h2>
              <p className="text-gray-600 mb-6">
                Create your personalized study plan in minutes and achieve your learning goals more efficiently.
              </p>
              <Link
                to="/study-details"
                className={cn(
                  "btn-primary inline-flex items-center justify-center gap-2",
                  "px-6 py-3 rounded-full bg-studbud-500 text-white font-medium",
                  "hover:bg-studbud-600 shadow-lg hover:shadow-xl",
                  "transition-all duration-300 hover:scale-105 active:scale-95"
                )}
              >
                Create Your Study Plan <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="md:w-2/5 bg-gradient-to-br from-studbud-400 to-studbud-600 flex items-center justify-center p-8 md:p-0">
              <Calendar className="h-24 w-24 text-white opacity-90" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="glass-card p-6 rounded-xl hover-card animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="bg-studbud-100 text-studbud-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const features = [
  {
    icon: <Target className="h-6 w-6" />,
    title: "Set Your Goal",
    description: "Define what you're studying for – an exam, skill learning, or daily study habit."
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Add Subjects",
    description: "List your subjects and rate the difficulty level for each one."
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Mark Available Times",
    description: "Tell us when you're free to study throughout the week."
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Get Your Plan",
    description: "Receive an AI-generated study schedule optimized for your success."
  }
];

export default LandingPage;
