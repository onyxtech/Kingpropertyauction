import { useEffect, useState } from "react";
import { UserCheck } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { apiClient } from "@/lib/apiClient";

interface StepSellerProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  theme: { primary: string };
}

export default function StepSeller({ formData, handleInputChange, theme }: StepSellerProps) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const [agents, setAgents] = useState<any[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    setLoadingAgents(true);
    apiClient.fetch("/users?role=agent&limit=100")
      .then((res: any) => {
        if (res.success) {
          const all = res.data || [];
          setAgents(all.filter((u: any) => u.role === "agent"));
        }
      })
      .catch(() => {})
      .finally(() => setLoadingAgents(false));
  }, [isAdmin]);

  const handleAgentSelect = (agent: any) => {
    const name = agent.name || "";
    const contact = agent.phone || agent.phoneNumber || agent.email || "";
    handleInputChange("agentId", agent._id);
    handleInputChange("agentName", name);
    handleInputChange("agentContact", contact);
    setAgentSearch(name);
    setShowAgentDropdown(false);
  };

  const filteredAgents = agents.filter((a: any) => {
    const name = a.name || a.fullName || `${a.firstName || ""} ${a.lastName || ""}`.trim();
    const search = agentSearch.toLowerCase();
    return name.toLowerCase().includes(search) || (a.email || "").toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}>
          <UserCheck className="size-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Agent Assignment</h2>
          <p className="text-slate-600 font-medium">Assign an agent to this property</p>
        </div>
      </div>

      {isAdmin ? (
        <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
          <h3 className="text-lg font-black text-blue-900 mb-4">Select Agent</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Assigned Agent</label>
              {loadingAgents ? (
                <div className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-500">Loading agents...</div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search agent by name or email..."
                    value={agentSearch}
                    onChange={(e) => { setAgentSearch(e.target.value); setShowAgentDropdown(true); }}
                    onFocus={() => setShowAgentDropdown(true)}
                    onBlur={() => setShowAgentDropdown(false)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {showAgentDropdown && filteredAgents.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredAgents.map((agent: any) => (
                        <button
                          key={agent._id}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleAgentSelect(agent);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-blue-50 first:rounded-t-xl last:rounded-b-xl"
                        >
                          {agent.name || agent.fullName || `${agent.firstName || ""} ${agent.lastName || ""}`.trim()} — {agent.email}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Agent Name</label>
                <input
                  type="text"
                  value={formData.agentName}
                  onChange={(e) => handleInputChange("agentName", e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Agent Contact</label>
                <input
                  type="text"
                  value={formData.agentContact}
                  onChange={(e) => handleInputChange("agentContact", e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl p-8 border-2 border-slate-200 text-center">
          <UserCheck className="size-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">Agent Assignment</h3>
          <p className="text-slate-500 font-medium">
            An agent will be assigned to your property by our admin team after submission.
          </p>
        </div>
      )}
    </div>
  );
}
