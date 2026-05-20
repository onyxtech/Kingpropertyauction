import { Share2 } from "lucide-react";

export default function SocialTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Social & External Integration</h2>
        <p className="text-slate-600 font-medium">
          Share to social media & sync with portals (UC-012, UC-013)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Properties Shared", value: "892", color: "from-blue-500 to-indigo-600" },
          { label: "Zoopla Synced", value: "456", color: "from-purple-500 to-pink-600" },
          { label: "Social Reach", value: "125K", color: "from-green-500 to-emerald-600" },
          { label: "Engagement", value: "34.2%", color: "from-orange-500 to-amber-600" },
        ].map((stat, index) => (
          <div key={index} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg">
            <div className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
              <Share2 className="size-5 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
          <h3 className="text-xl font-black text-slate-900 mb-4">Social Media Platforms</h3>
          <div className="space-y-3">
            {[
              { platform: "Facebook", connected: true, shares: 342, engagement: "42.5%" },
              { platform: "LinkedIn", connected: true, shares: 189, engagement: "28.3%" },
              { platform: "Twitter", connected: true, shares: 256, engagement: "31.7%" },
              { platform: "WhatsApp", connected: false, shares: 0, engagement: "N/A" },
            ].map((social, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900">{social.platform}</h4>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${social.connected ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}>
                    {social.connected ? "Connected" : "Not Connected"}
                  </span>
                </div>
                {social.connected && (
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                    <span>Shares: <strong className="text-slate-900">{social.shares}</strong></span>
                    <span>Engagement: <strong className="text-slate-900">{social.engagement}</strong></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/60 shadow-lg">
          <h3 className="text-xl font-black text-slate-900 mb-4">Property Portals</h3>
          <div className="space-y-3">
            {[
              { portal: "Zoopla", connected: true, synced: 456, status: "active" },
              { portal: "Rightmove", connected: true, synced: 398, status: "active" },
              { portal: "OnTheMarket", connected: false, synced: 0, status: "inactive" },
              { portal: "PrimeLocation", connected: false, synced: 0, status: "inactive" },
            ].map((portal, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900">{portal.portal}</h4>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${portal.connected ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600"}`}>
                    {portal.connected ? "Connected" : "Not Connected"}
                  </span>
                </div>
                {portal.connected && (
                  <p className="text-sm text-slate-600 font-medium">{portal.synced} properties synced</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
