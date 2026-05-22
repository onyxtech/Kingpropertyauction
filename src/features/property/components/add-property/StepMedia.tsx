import { Camera, Image as ImageIcon, Upload, X, Video, Globe, Map, FileText, Lock } from "lucide-react";

interface StepMediaProps {
  formData: any;
  uploadedImages: string[];
  handleInputChange: (field: string, value: any) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  theme: { primary: string };
}

export default function StepMedia({ formData, uploadedImages, handleInputChange, handleImageUpload, removeImage, theme }: StepMediaProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`size-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center`}
        >
          <Camera className="size-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Media & Documents
          </h2>
          <p className="text-slate-600 font-medium">
            Upload property images and documents
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Property Images */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3">
            <ImageIcon className="inline size-4 mr-1" />
            Property Images * (Max 20)
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="property-images"
            />
            <label htmlFor="property-images" className="cursor-pointer">
              <Upload className="size-12 text-slate-400 mx-auto mb-4" />
              <p className="text-sm font-bold text-slate-700 mb-2">
                Click to upload property images
              </p>
              <p className="text-xs text-slate-500">
                PNG, JPG up to 10MB each
              </p>
            </label>
          </div>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {uploadedImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Property ${index + 1}`}
                    className="w-full h-32 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 size-8 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Property Videos */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3">
            <Video className="inline size-4 mr-1" />
            Property Videos (Optional)
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50">
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => {
                if (e.target.files) {
                  handleInputChange("propertyVideos", [
                    ...(formData.propertyVideos || []),
                    ...Array.from(e.target.files),
                  ]);
                }
              }}
              className="hidden"
              id="property-video"
            />
            <label htmlFor="property-video" className="cursor-pointer">
              <Video className="size-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700 mb-1">
                Upload property video(s)
              </p>
              <p className="text-xs text-slate-500">MP4, MOV up to 100MB each</p>
            </label>
          </div>
          {(formData.propertyVideos || []).map((vid: File, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-blue-50 border-2 border-blue-200 rounded-xl mt-2">
              <Video className="size-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 flex-1 truncate">{vid.name}</span>
              <button
                type="button"
                onClick={() => handleInputChange("propertyVideos", (formData.propertyVideos || []).filter((_: any, idx: number) => idx !== i))}
                className="text-red-500 hover:text-red-700"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Virtual Tour Link */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            <Globe className="inline size-4 mr-1" />
            360° Virtual Tour Link (Optional)
          </label>
          <input
            type="url"
            placeholder="https://example.com/virtual-tour"
            value={formData.virtualTour}
            onChange={(e) =>
              handleInputChange("virtualTour", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Floor Plans */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3">
            <Map className="inline size-4 mr-1" />
            Floor Plans (Optional)
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50">
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={(e) => {
                if (e.target.files) {
                  handleInputChange("floorPlans", [
                    ...(formData.floorPlans || []),
                    ...Array.from(e.target.files),
                  ]);
                }
              }}
              className="hidden"
              id="floor-plan"
            />
            <label htmlFor="floor-plan" className="cursor-pointer">
              <FileText className="size-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700 mb-1">
                Upload floor plan(s)
              </p>
              <p className="text-xs text-slate-500">PDF, PNG, JPG up to 10MB each</p>
            </label>
          </div>
          {(formData.floorPlans || []).map((fp: File, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-green-50 border-2 border-green-200 rounded-xl mt-2">
              <FileText className="size-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 flex-1 truncate">{fp.name}</span>
              <button
                type="button"
                onClick={() => handleInputChange("floorPlans", (formData.floorPlans || []).filter((_: any, idx: number) => idx !== i))}
                className="text-red-500 hover:text-red-700"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Legal Documents */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3">
            <Lock className="inline size-4 mr-1" />
            Legal Documents (Optional)
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50">
            <input
              type="file"
              multiple
              accept="application/pdf"
              onChange={(e) => {
                if (e.target.files) {
                  const filesArray = Array.from(e.target.files);
                  handleInputChange("legalDocuments", [
                    ...formData.legalDocuments,
                    ...filesArray,
                  ]);
                }
              }}
              className="hidden"
              id="legal-docs"
            />
            <label htmlFor="legal-docs" className="cursor-pointer">
              <FileText className="size-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700 mb-1">
                Upload legal documents
              </p>
              <p className="text-xs text-slate-500">
                PDF files (Title deed, certificates, etc.)
              </p>
            </label>
            {formData.legalDocuments.length > 0 && (
              <p className="text-xs text-green-600 mt-2 font-medium">
                ✓ {formData.legalDocuments.length} document(s) uploaded
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}