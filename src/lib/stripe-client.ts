// This file is for client-side Stripe functionality
// It will only use the NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripeClient = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!key) {
      console.error('Stripe publishable key is missing');
      throw new Error('Stripe publishable key is not available');
    }
    
    stripePromise = loadStripe(key);
  }
  
  return stripePromise;
}; 