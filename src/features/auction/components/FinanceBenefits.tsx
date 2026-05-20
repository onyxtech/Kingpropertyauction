import { Clock, Shield, Award, TrendingUp } from "lucide-react";

const benefits = [
  { icon: Clock, title: "24-Hour Approval", desc: "Fast decision making" },
  { icon: Shield, title: "Secure Process", desc: "FCA regulated lenders" },
  { icon: Award, title: "Expert Advisors", desc: "Dedicated support team" },
  { icon: TrendingUp, title: "Competitive Rates", desc: "Best market rates" },
];

export default function FinanceBenefits() {
  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white/60">
        <h3 className="text-2xl font-black text-slate-900 mb-6">Why Choose Us?</h3>
        <div className="space-y-4">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                <div className="size-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Icon className="size-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-slate-600 font-medium">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-3xl p-8 shadow-xl text-white">
        <h3 className="text-3xl font-black mb-4">Ready to Apply?</h3>
        <p className="text-xl font-medium mb-6">Speak to our finance specialists today</p>
        <button className="w-full py-4 bg-white text-indigo-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
          Call 0800 123 4567
        </button>
      </div>
    </div>
  );
}
