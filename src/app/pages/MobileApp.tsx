import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  Search,
  Heart,
  Home,
  Gavel,
  User,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Clock,
  Bell,
  Filter,
  Share2,
  Phone,
  MessageCircle,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Star,
  Video,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function MobileApp() {
  const navigate = useNavigate();
  const [activeScreen, setActiveScreen] = useState("home");

  const properties = [
    {
      id: 1,
      title: "Modern Apartment",
      location: "Mayfair, London",
      price: "£850,000",
      image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NzEyOTA3MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      beds: 3,
      baths: 2,
      sqft: "1,800",
      type: "auction",
      timeLeft: "2h 15m",
    },
    {
      id: 2,
      title: "Luxury Interior",
      location: "Chelsea, London",
      price: "£1,200,000",
      image: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3VzZSUyMGludGVyaW9yfGVufDF8fHx8MTc3MTI5MDcxNXww&ixlib=rb-4.1.0&q=80&w=1080",
      beds: 4,
      baths: 3,
      sqft: "2,400",
      type: "sale",
    },
  ];

  const renderHomeScreen = () => (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-blue-100">Welcome back,</p>
            <p className="text-xl font-semibold">John Smith</p>
          </div>
          <div className="relative">
            <button className="size-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Bell className="size-5" />
            </button>
            <div className="absolute top-0 right-0 size-3 bg-red-500 rounded-full border-2 border-white" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search location or property..."
            className="w-full pl-12 pr-12 py-3.5 bg-white text-slate-900 rounded-2xl focus:outline-none"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 size-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <Filter className="size-5 text-white" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 -mt-4 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">24</p>
            <p className="text-xs text-slate-600">Live Auctions</p>
          </div>
          <div className="text-center border-x border-slate-200">
            <p className="text-2xl font-bold text-slate-900">156</p>
            <p className="text-xs text-slate-600">Saved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">8</p>
            <p className="text-xs text-slate-600">Active Bids</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Categories</h3>
          <button className="text-sm text-blue-600">See All</button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Home, label: "Houses", color: "blue" },
            { icon: Building2, label: "Apartments", color: "purple" },
            { icon: Gavel, label: "Auctions", color: "pink" },
            { icon: TrendingUp, label: "Trending", color: "emerald" },
          ].map((category, index) => {
            const Icon = category.icon;
            return (
              <button
                key={index}
                className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className={`size-12 mx-auto mb-2 bg-${category.color}-100 rounded-xl flex items-center justify-center`}>
                  <Icon className={`size-6 text-${category.color}-600`} />
                </div>
                <p className="text-xs text-slate-700 font-medium">{category.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Auctions */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Live Auctions</h3>
          <button className="text-sm text-blue-600 flex items-center gap-1">
            View All
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="relative h-48">
                <ImageWithFallback
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {property.type === "auction" && (
                  <div className="absolute top-3 left-3 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                    <Clock className="size-3" />
                    {property.timeLeft}
                  </div>
                )}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button className="size-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Heart className="size-4 text-slate-600" />
                  </button>
                  <button className="size-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Share2 className="size-4 text-slate-600" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <div className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded flex items-center gap-1">
                    <Video className="size-3" />
                    Virtual Tour
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 mb-1">{property.title}</h4>
                    <div className="flex items-center gap-1 text-slate-600 mb-3">
                      <MapPin className="size-3" />
                      <span className="text-xs">{property.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="size-4 fill-current" />
                    <span className="text-xs font-medium text-slate-700">4.8</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Bed className="size-4" />
                    <span className="text-xs">{property.beds}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Bath className="size-4" />
                    <span className="text-xs">{property.baths}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Maximize className="size-4" />
                    <span className="text-xs">{property.sqft} sqft</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">
                      {property.type === "auction" ? "Current Bid" : "Price"}
                    </p>
                    <p className="text-xl font-bold text-blue-600">{property.price}</p>
                  </div>
                  {property.type === "auction" ? (
                    <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium text-sm">
                      Place Bid
                    </button>
                  ) : (
                    <button className="px-6 py-2.5 border border-blue-600 text-blue-600 rounded-xl font-medium text-sm">
                      Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAuctionsScreen = () => (
    <div className="flex-1 overflow-auto p-6">
      <div className="text-center py-12">
        <div className="size-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <Gavel className="size-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Auctions Screen</h3>
        <p className="text-sm text-slate-600">View all active auctions and place bids</p>
      </div>
    </div>
  );

  const renderFavoritesScreen = () => (
    <div className="flex-1 overflow-auto p-6">
      <div className="text-center py-12">
        <div className="size-16 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
          <Heart className="size-8 text-pink-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Favorites Screen</h3>
        <p className="text-sm text-slate-600">Your saved properties appear here</p>
      </div>
    </div>
  );

  const renderProfileScreen = () => (
    <div className="flex-1 overflow-auto">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 pb-20 rounded-b-3xl">
        <div className="text-center">
          <div className="size-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
            <User className="size-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-1">John Smith</h3>
          <p className="text-sm text-blue-100">john.smith@example.com</p>
        </div>
      </div>

      <div className="px-6 -mt-12">
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-slate-900">42</p>
              <p className="text-xs text-slate-600">Bids Placed</p>
            </div>
            <div className="text-center border-x border-slate-200">
              <p className="text-xl font-bold text-slate-900">12</p>
              <p className="text-xs text-slate-600">Won Auctions</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-slate-900">156</p>
              <p className="text-xs text-slate-600">Favorites</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { icon: User, label: "Edit Profile" },
            { icon: Gavel, label: "My Bids" },
            { icon: Heart, label: "Saved Properties" },
            { icon: Bell, label: "Notifications" },
            { icon: MessageCircle, label: "Messages" },
            { icon: Phone, label: "Support" },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="w-full bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Icon className="size-5 text-slate-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">{item.label}</span>
                </div>
                <ChevronRight className="size-5 text-slate-400" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </button>

      {/* Mobile Frame */}
      <div className="relative">
        <div className="size-[812px] max-w-full max-h-[90vh] bg-slate-900 rounded-[3rem] p-4 shadow-2xl">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-slate-900 rounded-b-3xl z-10" />

          {/* Screen */}
          <div className="size-full bg-slate-50 rounded-[2.5rem] overflow-hidden flex flex-col">
            {/* Status Bar */}
            <div className="h-12 bg-gradient-to-br from-blue-600 to-indigo-600 px-8 flex items-center justify-between text-white text-xs">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <div className="size-1 bg-white rounded-full" />
                <div className="size-1 bg-white rounded-full" />
                <div className="size-1 bg-white rounded-full" />
              </div>
            </div>

            {/* Content */}
            {activeScreen === "home" && renderHomeScreen()}
            {activeScreen === "auctions" && renderAuctionsScreen()}
            {activeScreen === "favorites" && renderFavoritesScreen()}
            {activeScreen === "profile" && renderProfileScreen()}

            {/* Bottom Navigation */}
            <div className="bg-white border-t border-slate-200 px-6 py-3 safe-area-inset-bottom">
              <div className="flex items-center justify-around">
                {[
                  { id: "home", icon: Home, label: "Home" },
                  { id: "auctions", icon: Gavel, label: "Auctions" },
                  { id: "favorites", icon: Heart, label: "Favorites" },
                  { id: "profile", icon: User, label: "Profile" },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveScreen(item.id)}
                      className="flex flex-col items-center gap-1 min-w-0"
                    >
                      <div
                        className={`size-10 rounded-xl flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-gradient-to-br from-blue-600 to-indigo-600"
                            : "bg-transparent"
                        }`}
                      >
                        <Icon
                          className={`size-5 ${
                            isActive ? "text-white" : "text-slate-600"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-xs ${
                          isActive ? "text-blue-600 font-medium" : "text-slate-600"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Device Label */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
          <p className="text-sm text-slate-600">iOS / Android Mobile App</p>
        </div>
      </div>
    </div>
  );
}
