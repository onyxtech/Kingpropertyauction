import { ThumbsUp, TrendingUp, Shield, Users, Award, Clock, CheckCircle, Sparkles, Target, Heart, Crown, Zap, Star, DollarSign } from "lucide-react";
import Header from "../components/Header";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useNavigate } from "react-router";
import Footer from "../components/Footer";

export default function WhyBuyAtKing() {
  const navigate = useNavigate();
  
  const reasons = [
    { title: "Best Value", desc: "Save up to 25% below market value", icon: TrendingUp, gradient: "from-blue-500 to-indigo-600", stat: "25%" },
    { title: "Transparent Process", desc: "No hidden fees or surprises", icon: CheckCircle, gradient: "from-purple-500 to-pink-600", stat: "100%" },
    { title: "Expert Team", desc: "Professional support throughout", icon: Users, gradient: "from-emerald-500 to-teal-600", stat: "24/7" },
    { title: "Fast Process", desc: "Complete in just 28 days", icon: Clock, gradient: "from-orange-500 to-amber-600", stat: "28 Days" }
  ];

  const benefits = [
    {
      title: "Exceptional Value",
      desc: "Properties typically sell for 5-25% below market value, offering excellent investment opportunities.",
      icon: DollarSign,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "Legal Certainty",
      desc: "Binding contracts on the day mean no gazumping or deals falling through at the last minute.",
      icon: Shield,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Speed & Efficiency",
      desc: "Complete your purchase in 28 days with our streamlined process and dedicated support team.",
      icon: Zap,
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      title: "Wide Selection",
      desc: "Access to thousands of properties including exclusive listings not available on the open market.",
      icon: Target,
      gradient: "from-orange-500 to-amber-600"
    },
    {
      title: "Expert Guidance",
      desc: "Our experienced team provides comprehensive support from viewing through to completion.",
      icon: Users,
      gradient: "from-rose-500 to-pink-600"
    },
    {
      title: "Trusted Platform",
      desc: "Over 15 years of experience with 98% customer satisfaction and thousands of successful sales.",
      icon: Award,
      gradient: "from-cyan-500 to-blue-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      property: "3-Bed Terrace, Hackney",
      saved: "£75,000",
      quote: "I saved £75,000 below market value! The team was professional and helpful throughout. Highly recommended!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
    },
    {
      name: "James Patterson",
      property: "2-Bed Apartment, Canary Wharf",
      saved: "£45,000",
      quote: "The auction process was smooth and transparent. Completed in 28 days exactly as promised.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
    },
    {
      name: "Emma Thompson",
      property: "4-Bed Detached, Surrey",
      saved: "£125,000",
      quote: "Best decision we ever made. The property was perfect and we got an incredible deal!",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
    }
  ];

  const stats = [
    { value: "15,234", label: "Properties Sold", gradient: "from-blue-500 to-indigo-600" },
    { value: "£2.5B", label: "Total Sales Value", gradient: "from-purple-500 to-pink-600" },
    { value: "98%", label: "Customer Satisfaction", gradient: "from-emerald-500 to-teal-600" },
    { value: "15+", label: "Years Experience", gradient: "from-orange-500 to-amber-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 opacity-95" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Sparkles className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">👍 15 Years • 15,234 Sales • 98% Satisfaction</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Why Buy At King Auction?
              <br />
              <span className="text-yellow-300">Discover The Advantages</span>
            </h1>
            
            <p className="text-2xl text-white/90 mb-10 font-medium">
              Join thousands of successful buyers who've saved big on property
              <br />
              <span className="text-yellow-200">✨ Save up to 25% below market value</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Key Reasons */}
        <div className="mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-12 text-center">Top Reasons to Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((reason, idx) => {
              const Icon = reason.icon;
              return (
                <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                  <div className={`size-14 rounded-2xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="size-7 text-white" />
                  </div>
                  <div className={`text-4xl font-black mb-3 bg-gradient-to-r ${reason.gradient} bg-clip-text text-transparent`}>
                    {reason.stat}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{reason.title}</h3>
                  <p className="text-slate-600 font-medium">{reason.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Benefits */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
            The King Auction Advantage
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                  <div className={`size-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="size-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{benefit.title}</h3>
                  <p className="text-slate-600 font-medium">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 text-center">
            Success Stories
          </h2>
          <p className="text-xl text-slate-600 font-medium text-center mb-12">
            Real buyers, real savings, real results
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-bold text-sm shadow-xl">
                    Saved {testimonial.saved}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Heart key={i} className="size-5 fill-rose-500 text-rose-500" />
                    ))}
                  </div>
                  <p className="text-slate-700 font-medium mb-4 italic">"{testimonial.quote}"</p>
                  <div className="border-t-2 border-slate-100 pt-4">
                    <p className="font-black text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-600 font-medium">{testimonial.property}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16 bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border-2 border-white/60">
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
            Our Track Record
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className={`text-5xl font-black mb-3 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <p className="text-slate-600 font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-3xl p-12 shadow-xl text-white text-center">
          <div className="size-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-6">
            <ThumbsUp className="size-8 text-white" />
          </div>
          <h2 className="text-4xl font-black mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-2xl font-medium mb-10">
            Join thousands of satisfied buyers and start saving today
          </p>
          <div className="flex items-center gap-4 justify-center">
            <button className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105" onClick={() => navigate('/auctions')}>
              Browse Properties
            </button>
            <button className="px-10 py-5 bg-white/20 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/30 transition-all" onClick={() => navigate('/contact-us')}>
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}