import { useEffect, useState } from "react";
import { UserCheck } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

export default function StepSeller({ form, updateField }: any) {
  const [agents, setAgents] = useState<any[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);

  useEffect(() => {
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
  }, []);

  const handleAgentSelect = (agent: any) => {
    const name = agent.name || "";
    const contact = agent.phone || agent.phoneNumber || agent.email || "";
    updateField("agentId", agent._id);
    updateField("agentName", name);
    updateField("agentContact", contact);
    setAgentSearch(name);
    setShowAgentDropdown(false);
  };

  const filteredAgents = agents.filter((a: any) => {
    const name = a.name || a.fullName || `${a.firstName || ""} ${a.lastName || ""}`.trim();
    const search = agentSearch.toLowerCase();
    return name.toLowerCase().includes(search) || (a.email || "").toLowerCase().includes(search);
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><UserCheck className="size-6 text-cyan-600" /> Agent Assignment</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Select Agent</label>
          {loadingAgents ? (
            <div className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-500">Loading agents...</div>
          ) : (
            <div className="relative">
              <input
                type="text"
                placeholder="Search agent by name or email..."
                value={agentSearch}
                onChange={(e) => { setAgentSearch(e.target.value); setShowAgentDropdown(true); }}
                onFocus={() => setShowAgentDropdown(true)}
                onBlur={() => setShowAgentDropdown(false)}
                className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm"
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
                      className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-blue-50 first:rounded-t-xl last:rounded-b-xl"
                    >
                      {agent.name || agent.fullName || `${agent.firstName || ""} ${agent.lastName || ""}`.trim()} — {agent.email}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-bold mb-1">Agent Name</label><input type="text" value={form.agentName} onChange={(e) => updateField("agentName", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
          <div><label className="block text-sm font-bold mb-1">Agent Contact</label><input type="text" value={form.agentContact} onChange={(e) => updateField("agentContact", e.target.value)} className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm" /></div>
        </div>
      </div>
    </div>
  );
}
