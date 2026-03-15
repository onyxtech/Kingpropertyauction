import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Headphones,
  Globe,
  CheckCircle,
  Sparkles,
  X,
  Bot,
  User
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ContactUs() {
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "👋 Hi! I'm your King Property Auction AI Assistant. How can I help you today?" },
    { id: 2, sender: "bot", text: "I can assist you with:\n• Property searches\n• Auction information\n• Valuation requests\n• General inquiries" }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // Open chatbot on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatbot(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = { id: messages.length + 1, sender: "user", text: inputMessage };
    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = { 
        id: messages.length + 2, 
        sender: "bot", 
        text: "Thank you for your message! Our team will get back to you shortly. In the meantime, feel free to browse our available properties or contact us directly at 0800 123 4567." 
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 size-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-95" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
              <Sparkles className="size-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">24/7 Support • Expert Team • Quick Response</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Get In Touch
              <br />
              <span className="text-cyan-300">We're Here To Help</span>
            </h1>
            
            <p className="text-2xl text-white/90 font-medium">
              Have questions? Our expert team is ready to assist you
              <br />
              <span className="text-yellow-200">✨ Response within 2 hours</span>
            </p>
          </div>
        </div>
      </div>

      {/* Contact Options */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg">
              <Phone className="size-8 text-white" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Phone</h3>
            <p className="text-slate-600 mb-4 font-medium">Call us anytime</p>
            <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              0800 123 4567
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg">
              <Mail className="size-8 text-white" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Email</h3>
            <p className="text-slate-600 mb-4 font-medium">Send us a message</p>
            <p className="text-lg font-bold text-slate-900 break-all">
              info@kingauction.com
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 shadow-lg">
              <MessageCircle className="size-8 text-white" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Live Chat</h3>
            <p className="text-slate-600 mb-4 font-medium">Chat with us now</p>
            <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
              Start Chat
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60 hover:shadow-2xl transition-all hover:scale-105">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-6 shadow-lg">
              <Clock className="size-8 text-white" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Hours</h3>
            <p className="text-slate-600 mb-2 font-medium">Mon - Fri: 9am - 6pm</p>
            <p className="text-slate-600 font-medium">Sat - Sun: 10am - 4pm</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-xl border-2 border-white/60">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Send className="size-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900">Send us a Message</h2>
                <p className="text-slate-600 font-medium">We'll respond within 2 hours</p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+44 7xxx xxx xxx"
                  className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                <select className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium">
                  <option>General Inquiry</option>
                  <option>Property Valuation</option>
                  <option>Auction Question</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full px-5 py-4 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 flex items-center justify-center gap-3"
              >
                <Send className="size-5" />
                Send Message
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="space-y-6">
            {/* Location */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <div className="flex items-start gap-4 mb-6">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <MapPin className="size-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Visit Our Office</h3>
                  <p className="text-slate-600 font-medium mb-4">
                    123 Property Lane<br />
                    Mayfair, London<br />
                    W1K 5AB, United Kingdom
                  </p>
                  <button 
                    onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=123+Property+Lane+Mayfair+London+W1K+5AB+United+Kingdom', '_blank')}
                    className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            </div>

            {/* Support Team */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <div className="flex items-start gap-4">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Headphones className="size-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">Expert Support Team</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="size-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">24/7 Customer Support</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="size-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">Property Specialists</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="size-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">Legal Advisors</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="size-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">Finance Experts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
              <div className="flex items-start gap-4">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <Globe className="size-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    <button className="size-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-110">
                      f
                    </button>
                    <button className="size-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-110">
                      𝕏
                    </button>
                    <button className="size-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-110">
                      in
                    </button>
                    <button className="size-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-110">
                      IG
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />

      {/* Chatbot */}
      {showChatbot && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/60 w-[420px] max-h-[600px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Bot className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">AI Assistant</h3>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-semibold text-white/90">Online • Ready to help</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowChatbot(false)}
                className="size-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 active:scale-95"
                type="button"
                aria-label="Close chatbot"
              >
                <X className="size-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[400px] bg-gradient-to-br from-slate-50 to-blue-50/30">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`size-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    msg.sender === "user" 
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600" 
                      : "bg-gradient-to-br from-purple-500 to-pink-600"
                  } shadow-lg`}>
                    {msg.sender === "user" ? (
                      <User className="size-5 text-white" />
                    ) : (
                      <Bot className="size-5 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 ${msg.sender === "user" ? "text-right" : ""}`}>
                    <div className={`inline-block px-5 py-3 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                        : "bg-white/80 backdrop-blur-md text-slate-900 border-2 border-slate-200"
                    } shadow-lg font-medium whitespace-pre-line`}>
                      {msg.text}
                    </div>
                    <div className={`text-xs text-slate-500 mt-1 font-medium ${msg.sender === "user" ? "text-right" : ""}`}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 bg-white/80 backdrop-blur-xl border-t-2 border-slate-100">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-5 py-3 bg-white/80 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                />
                <button 
                  type="submit" 
                  className="size-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!inputMessage.trim()}
                >
                  <Send className="size-5" />
                </button>
              </form>
              <p className="text-xs text-slate-500 mt-3 text-center font-medium">
                💬 Powered by King Property Auction AI
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}