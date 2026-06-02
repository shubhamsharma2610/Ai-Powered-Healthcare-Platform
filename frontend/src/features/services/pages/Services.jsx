import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Stethoscope, 
  Calendar, 
  BarChart3, 
  PhoneCall, 
  BookOpen,
  ArrowRight 
} from 'lucide-react';

function Services() {
  const services = [
    {
      icon: Brain,
      title: "AI Health Assistant",
      description: "Get instant AI-powered analysis of your medical reports with personalized doctor recommendations.",
      color: "primary"
    },
    {
      icon: Stethoscope,
      title: "Find Doctors",
      description: "Connect with qualified healthcare professionals in your area based on specialty and availability.",
      color: "blue"
    },
    {
      icon: Calendar,
      title: "Appointment Booking",
      description: "Schedule appointments with doctors easily through our streamlined booking system.",
      color: "purple"
    },
    {
      icon: BarChart3,
      title: "Health Analytics",
      description: "Track your health metrics and get insights into your wellness journey with detailed analytics.",
      color: "orange"
    },
    {
      icon: PhoneCall,
      title: "Emergency Support",
      description: "24/7 emergency healthcare support and immediate assistance when you need it most.",
      color: "red"
    },
    {
      icon: BookOpen,
      title: "Health Education",
      description: "Access comprehensive health education resources and learn about preventive healthcare.",
      color: "green"
    }
  ];

  const getColorClasses = (color) => {
    switch(color) {
      case 'primary':
        return { bg: 'bg-primary/10', text: 'text-primary', hover: 'hover:border-primary/30' };
      case 'blue':
        return { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'hover:border-blue-200' };
      case 'purple':
        return { bg: 'bg-purple-50', text: 'text-purple-600', hover: 'hover:border-purple-200' };
      case 'orange':
        return { bg: 'bg-orange-50', text: 'text-orange-600', hover: 'hover:border-orange-200' };
      case 'red':
        return { bg: 'bg-red-50', text: 'text-red-600', hover: 'hover:border-red-200' };
      case 'green':
        return { bg: 'bg-green-50', text: 'text-green-600', hover: 'hover:border-green-200' };
      default:
        return { bg: 'bg-primary/10', text: 'text-primary', hover: 'hover:border-primary/30' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            <span className="text-primary">✨</span>
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">What We Offer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Comprehensive healthcare solutions tailored for your needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            const colors = getColorClasses(service.color);
            return (
              <div 
                key={index}
                className={`group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${colors.hover}`}
              >
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} className={colors.text} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Ready to Get Started?</h2>
            <p className="text-gray-500 text-sm mb-5">
              Join thousands of happy patients using HealthSync
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link 
                to="/find-doctors" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Find a Doctor <ArrowRight size={16} />
              </Link>
              <Link 
                to="/signup" 
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;