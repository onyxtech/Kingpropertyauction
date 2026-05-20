import Slider from "react-slick";
import { TrendingUp, Gavel, Users, Zap, Sparkles } from "lucide-react";

interface HeroSliderProps {
  totalProperties: number;
  liveAuctionCount: number;
  totalAuctionValue: number;
  totalBids: number;
  totalBidders: number;
}

export default function HeroSlider({
  totalProperties,
  liveAuctionCount,
  totalAuctionValue,
  totalBids,
  totalBidders,
}: HeroSliderProps) {
  return (
    <div className="relative overflow-hidden">
      <Slider
        dots={true}
        infinite={true}
        speed={1000}
        slidesToShow={1}
        slidesToScroll={1}
        autoplay={true}
        autoplaySpeed={5000}
        fade={true}
        arrows={false}
        className="hero-slider"
      >
        {/* Slide 1: Find Your Perfect Property */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-95" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-0 right-0 size-96 bg-cyan-300 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1.5s" }}
            />
          </div>

          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
                <Sparkles className="size-4 text-yellow-300 animate-pulse" />
                <span className="text-sm font-bold text-white">
                  ✨ Premium Properties • AI-Powered Search • Instant Viewing
                </span>
              </div>

              <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                Find Your Perfect Property
                <br />
                <span className="text-cyan-300">With Confidence</span>
              </h1>

              <p className="text-2xl text-white/90 mb-10 font-medium">
                Browse thousands of properties or participate in live auctions
                to secure the best deals.
                <br />
                <span className="text-yellow-200">
                  💎 Transparent • Secure • Verified
                </span>
              </p>

              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <TrendingUp className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">
                      {totalProperties.toLocaleString()}
                    </p>
                    <p className="text-sm font-semibold text-white/80">
                      Active Listings
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <Gavel className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">
                      {liveAuctionCount}
                    </p>
                    <p className="text-sm font-semibold text-white/80">
                      Live Auctions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Users className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">
                      {totalBidders.toLocaleString()}
                    </p>
                    <p className="text-sm font-semibold text-white/80">
                      Active Bidders
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2: Online Property Auctions */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 opacity-95" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 size-96 bg-white rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-0 right-0 size-96 bg-yellow-300 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1.5s" }}
            />
          </div>

          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30 shadow-xl">
                <Gavel className="size-4 text-yellow-300 animate-pulse" />
                <span className="text-sm font-bold text-white">
                  🔴 Live Bidding • Real-Time Updates • Instant Wins
                </span>
              </div>

              <h1 className="text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                Online Property Auctions
                <br />
                <span className="text-yellow-300">Bid from Anywhere</span>
              </h1>

              <p className="text-2xl text-white/90 mb-10 font-medium">
                Join live auctions from the comfort of your home. Real-time
                bidding with instant notifications.
                <br />
                <span className="text-yellow-200">
                  🏆 Competitive • Fair • Transparent
                </span>
              </p>

              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <Gavel className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">
                      {liveAuctionCount}
                    </p>
                    <p className="text-sm font-semibold text-white/80">
                      Live Auctions Now
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg">
                    <Zap className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">
                      {new Intl.NumberFormat("en-GB", {
                        style: "currency",
                        currency: "GBP",
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(totalAuctionValue)}
                    </p>
                    <p className="text-sm font-semibold text-white/80">
                      Total Value
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-xl">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <Users className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">
                      {totalBids.toLocaleString()}
                    </p>
                    <p className="text-sm font-semibold text-white/80">
                      Total Bids
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
}
