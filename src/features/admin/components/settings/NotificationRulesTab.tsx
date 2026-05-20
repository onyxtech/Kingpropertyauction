interface NotificationRulesTabProps {
  rules: Record<string, boolean>;
  ruleLabels: Record<string, string>;
  onRuleToggle: (key: string) => void;
}

export default function NotificationRulesTab({
  rules,
  ruleLabels,
  onRuleToggle,
}: NotificationRulesTabProps) {
  return (
    <div>
      <p className="text-sm text-slate-600 mb-6">
        Enable or disable automatic email notifications for each event type.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(ruleLabels).map(([key, label]) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-white hover:shadow-sm transition-all border-2 border-transparent hover:border-slate-200"
          >
            <span className="font-semibold text-slate-900 text-sm">
              {label}
            </span>
            <button
              onClick={() => onRuleToggle(key)}
              className={`relative w-12 h-7 rounded-full transition-all duration-200 ${
                rules[key] !== false ? "bg-green-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-0.5 size-6 bg-white rounded-full shadow-md transition-all duration-200 ${
                  rules[key] !== false ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
