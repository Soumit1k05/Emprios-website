import { Layers, Zap, Star, Shield } from 'lucide-react';

export const bundlesContent = [
  { 
    name: 'Basic', 
    price: '$49', 
    icon: Layers, 
    features: ['5 Marketing Nodes', 'Standard Analytics', 'Email Support', 'Basic AI Templates'], 
    tag: 'Starter' 
  },
  { 
    name: 'Pro', 
    price: '$99', 
    icon: Zap, 
    features: ['20 Marketing Nodes', 'Deep Insights', 'Priority Chat', 'Custom Workflows'], 
    tag: 'Most Popular', 
    popular: true 
  },
  { 
    name: 'Premium', 
    price: '$199', 
    icon: Star, 
    features: ['Unlimited Nodes', 'Global Sync', 'Account Manager', 'White-label Logic'], 
    tag: 'Enterprise' 
  },
  { 
    name: 'Legendary', 
    price: '$499', 
    icon: Shield, 
    features: ['Full Tech Stack', 'Private Hosting', 'Custom Feature Dev', '0% Fees'], 
    tag: 'The Ultimate' 
  }
];

export const siteMetadata = {
  title: 'EMPIROS',
  tagline: 'Build your network today',
  description: 'The official codebase for EMPRIOS (emprios.in), a modern, high-conversion affiliate marketing platform.',
  contactEmail: 'contact@emprios.in'
};
