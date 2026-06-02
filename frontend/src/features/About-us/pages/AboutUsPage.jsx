import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Heart, Shield, Users, Award, Clock, Star, Globe, ChevronRight } from 'lucide-react';

export default function AboutUsPage() {
  const stats = [
    { value: '50K+', label: 'Happy Patients', icon: Users },
    { value: '100+', label: 'Expert Doctors', icon: Award },
    { value: '24/7', label: 'AI Support', icon: Clock },
    { value: '98%', label: 'Satisfaction Rate', icon: Star },
  ];

  const features = [
    {
      title: 'AI-Powered Diagnostics',
      description: 'Advanced artificial intelligence for accurate medical report analysis',
      icon: Activity,
      color: 'bg-primary/10',
      iconColor: 'text-primary'
    },
    {
      title: 'Secure & Private',
      description: 'Bank-grade encryption for your personal health records',
      icon: Shield,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Expert Doctors',
      description: 'Connect with verified and experienced healthcare professionals',
      icon: Heart,
      color: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      title: 'Seamless Booking',
      description: 'Easy appointment scheduling with instant confirmation',
      icon: Globe,
      color: 'bg-green-50',
      iconColor: 'text-green-600'
    },
  ];

  const team = [
    { name: 'Dr. Sarah Wilson', role: 'Lead Medical Advisor', avatar: '👩‍⚕️' },
    { name: 'Dr. Michael Chen', role: 'Chief of Cardiology', avatar: '👨‍⚕️' },
    { name: 'Dr. Priya Sharma', role: 'AI Research Head', avatar: '👩‍🔬' },
    { name: 'Rahul Mehta', role: 'Tech Director', avatar: '👨‍💻' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full mb-4">
              <Activity size={14} className="text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">Our Story</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Revolutionizing Healthcare with
              <span className="text-primary block mt-1">AI-Powered Intelligence</span>
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-base leading-relaxed">
              We're on a mission to make quality healthcare accessible, affordable, and intelligent 
              for everyone through cutting-edge technology and expert medical care.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                To empower individuals with intelligent healthcare solutions that combine 
                the precision of AI with the compassion of human expertise.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe that everyone deserves access to quality healthcare, and technology 
                is the key to making this vision a reality.
              </p>
              <div className="mt-6">
                <Link to="/find-doctors" className="inline-flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all">
                  Find a Doctor <ChevronRight size={16} />
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Shield size={24} className="text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">Our Promise</h3>
              </div>
              <p className="text-gray-600">
                Your health data is protected with industry-leading security measures. 
                We never compromise on privacy or quality of care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Why Choose Us</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We combine advanced technology with compassionate care to provide you with the best healthcare experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-3`}>
                    <Icon size={22} className={feature.iconColor} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Meet Our Leadership</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Passionate experts dedicated to transforming healthcare
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="text-center bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl mx-auto mb-3">
                  {member.avatar}
                </div>
                <h3 className="text-base font-semibold text-gray-800">{member.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Take Control of Your Health?</h2>
          <p className="text-gray-500 mb-6">
            Join thousands of happy patients who trust us for their healthcare needs
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/find-doctors" className="px-6 py-2.5 bg-primary text-white rounded-medical font-semibold hover:bg-primary-dark transition-colors">
              Find a Doctor
            </Link>
            <Link to="/signup" className="px-6 py-2.5 border border-primary text-primary rounded-medical font-semibold hover:bg-primary/5 transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}