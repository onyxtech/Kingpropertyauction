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

  const handleAgentSelect = (agentId: string) => {
    const agent = agents.find((a: any) => a._id === agentId);
    if (agent) {
      const name = agent.name || agent.fullName || (agent.firstName && agent.lastName ? `${agent.firstName} ${agent.lastName}` : "") || agent.firstName || "";
      const contact = agent.phone || agent.phoneNumber || agent.email || "";
      handleInputChange("agentName", name);
      handleInputChange("agentContact", contact);
    } else {
      handleInputChange("agentName", "");
      handleInputChange("agentContact", "");
    }
  };

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
                <select
                  onChange={(e) => handleAgentSelect(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            {formData.agentName && (
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
            )}
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
