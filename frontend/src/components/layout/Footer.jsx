import React from 'react';
import { Link } from 'react-router-dom';
// Using only standard, guaranteed free medical/generic icons
import { 
  Mail, 
  Phone, 
  MapPin, 
  Activity, 
  Globe, 
  MessageSquare, 
  ShieldCheck,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white  pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(182,100%,37%)] rounded-lg flex items-center justify-center shadow-lg">
                <Activity className="text-white" size={24} />
              </div>
              <span className="text-2xl font-display font-bold tracking-tight">HealthHub</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering patients with AI-driven insights. Our platform ensures secure report analysis and seamless doctor consultations.
            </p>
            {/* Generic Social/Web Icons that always work */}
            <div className="flex gap-4 pt-2">
              <div className="p-2 rounded-full bg-white/5 hover:bg-[hsl(182,100%,37%)] transition-colors cursor-pointer">
                <Globe size={18} />
              </div>
              <div className="p-2 rounded-full bg-white/5 hover:bg-[hsl(182,100%,37%)] transition-colors cursor-pointer">
                <MessageSquare size={18} />
              </div>
              <div className="p-2 rounded-full bg-white/5 hover:bg-[hsl(182,100%,37%)] transition-colors cursor-pointer">
                <Heart size={18} />
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-[hsl(182,100%,37%)]">Resources</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home Page</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-white transition-colors">AI Health Assistant</Link></li>
              <li><Link to="/patient/find-doctor" className="hover:text-white transition-colors">Find Specialist</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Medical Services</Link></li>
            </ul>
          </div>

          {/* Trust & Security */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-[hsl(182,100%,37%)]">Security</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[hsl(182,100%,37%)]" />
                <span>HIPAA Compliant</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[hsl(182,100%,37%)]" />
                <span>Encrypted Data</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[hsl(182,100%,37%)]" />
                <span>AI Verified</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold mb-6 text-[hsl(182,100%,37%)]">Get in Touch</h4>
            <div className="flex items-start gap-3 text-sm text-gray-400">
              <MapPin className="w-5 h-5 text-[hsl(182,100%,37%)] shrink-0" />
              <span>Amritsar, Punjab, India</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Phone className="w-5 h-5 text-[hsl(182,100%,37%)] shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Mail className="w-5 h-5 text-[hsl(182,100%,37%)] shrink-0" />
              <span>contact@healthhub.com</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>© {currentYear} HealthHub AI. All rights reserved. Designed for smarter care.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;