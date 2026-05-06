import { useNavigate } from "react-router";
import {
  Crown,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Send,
  Gavel,
  Home,
  Building2,
  FileText,
  Shield,
  HelpCircle,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Globe,
  Clock,
  Award,
  Heart,
  UserPlus,
  LogIn,
  Play,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 size-96 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 size-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-white/10">
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="size-6 text-yellow-400" />
                      <h3 className="text-2xl font-black">Stay Updated!</h3>
                    </div>
                    <p className="text-white/80 text-sm">
                      Get exclusive auction alerts, property insights, and special offers delivered to your inbox.
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      <CheckCircle className="size-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs text-white/70">Weekly property highlights</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="size-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-xs text-white/70">Early auction access</span>
                    </div>
                  </div>
                  <div>
                    {!subscribed ? (
                      <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                        <div className="relative">
                          <Mail className="absolute left-4 top-4 size-5 text-slate-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/20 transition-all"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
                        >
                          Subscribe Now
                          <Send className="size-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </form>
                    ) : (
                      <div className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-6 text-center">
                        <CheckCircle className="size-12 text-emerald-400 mx-auto mb-3" />
                        <p className="font-bold text-emerald-300">Successfully Subscribed! 🎉</p>
                        <p className="text-sm text-white/70 mt-1">Check your inbox for confirmation</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Bar - Prominent Section */}
        <div className="border-b border-white/10 bg-white/5 backdrop-blur-md">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate("/buying-overview")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                <ShoppingCart className="size-5" />
                Buying
              </button>
              <button
                onClick={() => navigate("/selling-overview")}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                <DollarSign className="size-5" />
                Selling
              </button>
              <button
                onClick={() => navigate("/live-auctions")}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all hover:scale-105 flex items-center gap-2 animate-pulse"
              >
                <Play className="size-5" />
                Live Now
              </button>
              <button
                onClick={() => navigate("/view-live-locations")}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                <MapPin className="size-5" />
                Locations
              </button>
              <button
                onClick={() => navigate("/contact-us")}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                <Mail className="size-5" />
                Contact Us
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-amber-500/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                <UserPlus className="size-5" />
                Register
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-slate-500/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                <LogIn className="size-5" />
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-3 group mb-6"
              >
                <div className="size-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                  <Crown className="size-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <h1 className="font-black text-xl tracking-tight">
                    <span className="text-yellow-400">King</span>
                    <span className="text-white"> Property</span>
                  </h1>
                  <p className="text-xs font-bold text-white/60">
                    Auction Portal
                  </p>
                </div>
              </button>
              
              <p className="text-white/70 text-sm mb-6 leading-relaxed">
                UK's leading property auction platform, connecting buyers and sellers with transparent, efficient, and secure auction experiences since 2010.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a
                  href="tel:08001234567"
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
                >
                  <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <Phone className="size-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 font-medium">Call Us 24/7</p>
                    <p className="font-bold">0800 123 4567</p>
                  </div>
                </a>

                <a
                  href="mailto:info@kingpropertyauction.com"
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
                >
                  <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Mail className="size-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 font-medium">Email Us</p>
                    <p className="font-bold text-sm">info@kingpropertyauction.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 text-white/80">
                  <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <MapPin className="size-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 font-medium">Head Office</p>
                    <p className="font-bold text-sm">123 Auction Street, London, UK</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Auctions Links */}
            <div>
              <h4 className="font-black text-lg mb-6 flex items-center gap-2">
                <Gavel className="size-5 text-blue-400" />
                Auctions
              </h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => navigate("/auctions")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    View All Auctions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/live-auctions")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-red-400 group-hover:translate-x-1 transition-transform" />
                    Live Auctions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/online-auctions")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    Online Auctions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/view-all-lots")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    View All Lots
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/view-live-locations")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    Live Locations
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/auction-guide")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    Auction Guide
                  </button>
                </li>
              </ul>
            </div>

            {/* Buying & Selling */}
            <div>
              <h4 className="font-black text-lg mb-6 flex items-center gap-2">
                <Home className="size-5 text-emerald-400" />
                Services
              </h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => navigate("/buying-overview")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    Buying Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/selling-overview")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    Selling Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/free-valuation")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
                    Free Valuation
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/auction-finance")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    Auction Finance
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/solicitor")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    Find Solicitor
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/home-report")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    Home Report
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <h4 className="font-black text-lg mb-6 flex items-center gap-2">
                <Shield className="size-5 text-purple-400" />
                Support
              </h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => navigate("/guide-faq")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    Guide & FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/buying-guide")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    Buying Guide
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/contact-us")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/about")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/terms-of-sale")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    Terms of Sale
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/register-alert")}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ArrowRight className="size-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    Register Alert
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Trust Badges & Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 pb-12 border-b border-white/10">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/10 transition-all border border-white/10">
              <Award className="size-8 text-yellow-400 mx-auto mb-3" />
              <p className="font-bold text-white mb-1">Award Winning</p>
              <p className="text-xs text-white/60">Best Auction Platform 2024</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/10 transition-all border border-white/10">
              <Shield className="size-8 text-emerald-400 mx-auto mb-3" />
              <p className="font-bold text-white mb-1">Secure</p>
              <p className="text-xs text-white/60">Bank-level encryption</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/10 transition-all border border-white/10">
              <Clock className="size-8 text-blue-400 mx-auto mb-3" />
              <p className="font-bold text-white mb-1">24/7 Support</p>
              <p className="text-xs text-white/60">Always here to help</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/10 transition-all border border-white/10">
              <Heart className="size-8 text-rose-400 mx-auto mb-3" />
              <p className="font-bold text-white mb-1">Trusted</p>
              <p className="text-xs text-white/60">5K+ Happy Customers</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Media */}
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-sm font-medium">Follow Us:</span>
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-xl bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
                  aria-label="Facebook"
                >
                  <Facebook className="size-5 text-white" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-xl bg-white/10 hover:bg-sky-500 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-sky-500/50"
                  aria-label="Twitter"
                >
                  <Twitter className="size-5 text-white" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50"
                  aria-label="Instagram"
                >
                  <Instagram className="size-5 text-white" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-xl bg-white/10 hover:bg-blue-700 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-700/50"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="size-5 text-white" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-xl bg-white/10 hover:bg-red-600 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-red-600/50"
                  aria-label="YouTube"
                >
                  <Youtube className="size-5 text-white" />
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-white/60 text-sm">
                © {currentYear} <span className="font-bold text-white">King Property Auction</span>. All rights reserved.
              </p>
              <div className="flex items-center justify-center md:justify-end gap-4 mt-2">
                <button className="text-xs text-white/50 hover:text-white transition-colors">
                  Privacy Policy
                </button>
                <span className="text-white/30">•</span>
                <button className="text-xs text-white/50 hover:text-white transition-colors">
                  Terms & Conditions
                </button>
                <span className="text-white/30">•</span>
                <button className="text-xs text-white/50 hover:text-white transition-colors">
                  Cookie Policy
                </button>
              </div>
            </div>
          </div>

          {/* Partner Logos */}
          <div className="mt-12 pt-12 border-t border-white/10">
            <p className="text-center text-xs font-bold text-white/40 uppercase tracking-wider mb-6">
              Trusted By Leading Property Portals
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-30">
              <div className="text-xl font-black text-white/60">RIGHTMOVE</div>
              <div className="text-xl font-black text-white/60">ZOOPLA</div>
              <div className="text-xl font-black text-white/60">PRIMELOCATION</div>
              <div className="text-xl font-black text-white/60">ONTHEMARKET</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}