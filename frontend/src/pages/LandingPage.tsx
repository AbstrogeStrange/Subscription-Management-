import How from '../components/Home/How';
import Hero from '../components/Home/Hero';
import Why from '../components/Home/Why';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Pricing from '../components/Home/pricing';
import Testimonial from '../components/Home/Testimonial';
import Footer from '../components/Shared/Footer';
import Navbar from '../components/Shared/Navbar';


export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-transparent">
      <Navbar />
      <Hero />
      <How />
      <Why />
      <Pricing />
      <Testimonial />
      <Footer />
    </div>
  );
};
