import { Mail, Send, CheckCircle, Sparkles } from "lucide-react";

interface FooterNewsletterProps {
  email: string;
  setEmail: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  subscribed: boolean;
  loading: boolean;
  error: string;
}

export default function FooterNewsletter({ email, setEmail, onSubmit, subscribed, loading, error }: FooterNewsletterProps) {
  return (
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
                  <form onSubmit={onSubmit} className="space-y-3">
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
                      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? "Subscribing..." : "Subscribe Now"}
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
  );
}
