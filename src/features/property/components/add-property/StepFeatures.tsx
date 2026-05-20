import { Star, Trees, Sparkles, Home, Zap, Shield, Upload, Users } from "lucide-react";

interface StepFeaturesProps {
  formData: any;
  handleFeatureToggle: (feature: string) => void;
  theme: { primary: string };
}

export default function StepFeatures({ formData, handleFeatureToggle, theme }: StepFeaturesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
        >
          <Star className="size-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Property Features & Amenities
          </h2>
          <p className="text-slate-600 font-medium">
            Select all available features
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { key: "garden", label: "Garden", icon: Trees },
          {
            key: "swimmingPool",
            label: "Swimming Pool",
            icon: Sparkles,
          },
          { key: "balcony", label: "Balcony", icon: Home },
          {
            key: "airConditioning",
            label: "Air Conditioning",
            icon: Zap,
          },
          {
            key: "securitySystem",
            label: "Security System",
            icon: Shield,
          },
          { key: "elevator", label: "Elevator", icon: Upload },
          { key: "gym", label: "Gym", icon: Users },
          { key: "solarSystem", label: "Solar System", icon: Zap },
        ].map((feature) => {
          const Icon = feature.icon;
          return (
            <label
              key={feature.key}
              className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                formData.features[
                  feature.key as keyof typeof formData.features
                ]
                  ? "bg-blue-50 border-blue-500"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="checkbox"
                checked={
                  formData.features[
                    feature.key as keyof typeof formData.features
                  ]
                }
                onChange={() => handleFeatureToggle(feature.key)}
                className="size-5 rounded accent-blue-600"
              />
              <Icon
                className={`size-5 ${formData.features[feature.key as keyof typeof formData.features] ? "text-blue-600" : "text-slate-500"}`}
              />
              <span className="text-sm font-bold text-slate-700">
                {feature.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}