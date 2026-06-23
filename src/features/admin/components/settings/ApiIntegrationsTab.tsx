import { Save } from "lucide-react";

interface ApiIntegrationsTabProps {
  integrationsForm: {
    groqApiKey: string;
    geminiApiKey: string;
    googlePlacesApiKey: string;
    openaiApiKey: string;
    activeAiProvider: string;
    zooplaEnabled: boolean;
    zooplaApiKey: string;
    zooplaApiSecret: string;
    zooplaBranchId: string;
    zooplaAgentId: string;
    zooplaTestMode: boolean;
  };
  setIntegrationsForm: (form: any) => void;
  isSaving: boolean;
  onSave: () => void;
  onTestZoopla?: () => void;
  zooplaTestResult?: { success: boolean; message: string } | null;
  testingZoopla?: boolean;
}
export default function ApiIntegrationsTab({
  integrationsForm,
  setIntegrationsForm,
  isSaving,
  onSave,
  onTestZoopla,
  zooplaTestResult,
  testingZoopla,
}: ApiIntegrationsTabProps) {
  return (
    <div className="space-y-8">
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
        <p className="text-amber-800 text-sm font-semibold">
          API keys saved here are stored securely in the database and override
          environment variables at runtime.
        </p>
      </div>

      <div>
        <h4 className="text-sm font-black text-slate-700 mb-4 uppercase tracking-wider">
          Active AI Provider
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {(["groq", "gemini", "openai"] as const).map((provider) => (
            <button
              key={provider}
              onClick={() =>
                setIntegrationsForm({
                  ...integrationsForm,
                  activeAiProvider: provider,
                })
              }
              className={`p-4 rounded-xl text-sm font-bold transition-all border-2 capitalize ${
                integrationsForm.activeAiProvider === provider
                  ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {provider === "groq"
                ? "⚡ Groq"
                : provider === "gemini"
                  ? "✨ Gemini"
                  : "🤖 OpenAI"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            label: "Groq API Key",
            key: "groqApiKey",
            placeholder: "gsk_...",
            provider: "groq" as const,
            hint: "Used for AI chat. Get key at console.groq.com",
          },
          {
            label: "Gemini API Key",
            key: "geminiApiKey",
            placeholder: "AIza...",
            provider: "gemini" as const,
            hint: "Google Gemini AI. Get key at aistudio.google.com",
          },
          {
            label: "Google Places API Key",
            key: "googlePlacesApiKey",
            placeholder: "AIza...",
            provider: null,
            hint: "UK address autocomplete on all forms. Enable Places API in Google Cloud Console.",
          },
          {
            label: "OpenAI API Key",
            key: "openaiApiKey",
            placeholder: "sk-...",
            provider: "openai" as const,
            hint: "GPT-4 option. Get key at platform.openai.com",
          },
        ].map((field) => (
          <div
            key={field.key}
            className={`p-4 rounded-xl border-2 transition-all ${
              field.provider &&
              integrationsForm.activeAiProvider === field.provider
                ? "border-blue-400 bg-blue-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-700">
                {field.label}
              </label>
              {field.provider &&
                integrationsForm.activeAiProvider === field.provider && (
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                    Active
                  </span>
                )}
              {!field.provider && (
                <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded-full">
                  Maps
                </span>
              )}
            </div>
            <input
              type="password"
              value={(integrationsForm as any)[field.key]}
              onChange={(e) =>
                setIntegrationsForm({
                  ...integrationsForm,
                  [field.key]: e.target.value,
                })
              }
              placeholder={field.placeholder}
              className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">{field.hint}</p>
          </div>
        ))}
      </div>

            {/* Zoopla Integration */}
      <div className="border-t-2 border-slate-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider">
              🏠 Zoopla Property Listing
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Auto-list properties on Zoopla when added to the platform
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={integrationsForm.zooplaEnabled}
              onChange={(e) =>
                setIntegrationsForm({
                  ...integrationsForm,
                  zooplaEnabled: e.target.checked,
                })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
          </label>
        </div>

        {integrationsForm.zooplaEnabled && (
          <div className="space-y-4 p-4 bg-purple-50/50 border-2 border-purple-200 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={integrationsForm.zooplaTestMode}
                  onChange={(e) =>
                    setIntegrationsForm({
                      ...integrationsForm,
                      zooplaTestMode: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
              </label>
              <span className="text-xs font-bold text-amber-700">
                Test Mode (Sandbox)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "API Key", key: "zooplaApiKey", placeholder: "Enter Zoopla API key", hint: "From Zoopla developer portal" },
                { label: "API Secret", key: "zooplaApiSecret", placeholder: "Enter Zoopla API secret", hint: "Keep this secure" },
                { label: "Branch ID", key: "zooplaBranchId", placeholder: "e.g. BR-12345", hint: "Your Zoopla branch identifier" },
                { label: "Agent ID (optional)", key: "zooplaAgentId", placeholder: "e.g. AG-12345", hint: "Leave empty to use Branch ID" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">
                    {field.label}
                  </label>
                  <input
                    type={field.key.includes("Secret") ? "password" : "text"}
                    value={(integrationsForm as any)[field.key]}
                    onChange={(e) =>
                      setIntegrationsForm({
                        ...integrationsForm,
                        [field.key]: e.target.value,
                      })
                    }
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                  <p className="text-xs text-slate-400 mt-1">{field.hint}</p>
                </div>
              ))}
            </div>

            {/* Test Connection */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onTestZoopla}
                disabled={testingZoopla || !integrationsForm.zooplaApiKey}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 disabled:opacity-50 transition-all"
              >
                {testingZoopla ? "Testing..." : "Test Connection"}
              </button>
              {zooplaTestResult && (
                <span
                  className={`text-sm font-bold ${
                    zooplaTestResult.success ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {zooplaTestResult.success ? "✅ Connected" : `❌ ${zooplaTestResult.message}`}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <Save className="size-4" />
          {isSaving ? "Saving..." : "Save Integrations"}
        </button>
      </div>
    </div>
  );
}
