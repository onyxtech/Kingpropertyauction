import { Clock, CheckCircle, Tag, ArrowRight } from "lucide-react";

interface SellBannerProps {
  onNavigate: () => void;
}

export default function SellBanner({ onNavigate }: SellBannerProps) {
  return (
    <div className="container mx-auto px-6 py-12 relative z-10">
      <div
        onClick={onNavigate}
        className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-3xl p-10 text-white shadow-2xl shadow-emerald-500/40 overflow-hidden cursor-pointer hover:shadow-3xl transition-all group"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute bottom-0 left-0 size-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-6 border-2 border-white/30">
              <Clock className="size-5 text-yellow-300 animate-pulse" />
              <span className="text-sm font-bold text-white">
                Fast Sale Guarantee
              </span>
            </div>

            <h2 className="text-5xl font-black mb-4 leading-tight">
              Sell Your Property
              <br />
              <span className="text-yellow-300">within 28 Days</span>
            </h2>

            <p className="text-2xl text-emerald-50 mb-6 font-medium">
              You Set The Price, No Upfront Costs & No Sale, No Fee.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="size-6 text-yellow-300 flex-shrink-0" />
                <span className="text-white font-semibold">
                  You Control The Price
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="size-6 text-yellow-300 flex-shrink-0" />
                <span className="text-white font-semibold">
                  Zero Upfront Costs
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="size-6 text-yellow-300 flex-shrink-0" />
                <span className="text-white font-semibold">No Sale, No Fee</span>
              </div>
            </div>

            <button className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3 group">
              <Tag className="size-6" />
              <span>Get Your Free Valuation</span>
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl p-6 text-center min-w-[200px]">
              <p className="text-5xl font-black mb-2">28</p>
              <p className="text-emerald-50 font-bold">Days Average</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl p-6 text-center min-w-[200px]">
              <p className="text-5xl font-black mb-2">£0</p>
              <p className="text-emerald-50 font-bold">Upfront Costs</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl p-6 text-center min-w-[200px]">
              <p className="text-5xl font-black mb-2">100%</p>
              <p className="text-emerald-50 font-bold">Your Control</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
