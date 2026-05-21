import { useEffect, useState } from "react";
import { UserCheck } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

export default function StepSeller({ form, updateField }: any) {
  const [agents, setAgents] = useState<any[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);

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

  const handleAgentSelect = (agentId: string) => {
    const agent = agents.find((a: any) => a._id === agentId);
    if (agent) {
      const name = agent.name || agent.fullName || (agent.firstName && agent.lastName ? `${agent.firstName} ${agent.lastName}` : "") || agent.firstName || "";
      const contact = agent.phone || agent.phoneNumber || agent.email || "";
      updateField("agentName", name);
      updateField("agentContact", contact);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><UserCheck className="size-6 text-cyan-600" /> Agent Assignment</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Select Agent</label>
          {loadingAgents ? (
            <div className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm text-slate-500">Loading agents...</div>
          ) : (
            <select
              onChange={(e) => handleAgentSelect(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm"
            >
              <option value="">Select an agent (optional)</option>
              {agents.map((agent: any) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name || agent.fullName} — {agent.email}
                </option>
              ))}
            </select>
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
