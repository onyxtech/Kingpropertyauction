import { Camera, Upload, X, Video, FileText, File } from "lucide-react";

export default function StepMedia({ form, updateField, newImages, imagePreviews, handleImageUpload, removeExistingImage, removeNewImage, property }: any) {
  const mediaBase = (url: string) => url?.startsWith("http") ? url : `http://localhost:5000${url}`;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Camera className="size-6 text-pink-600" /> Media & Documents</h2>

      {form.existingImages?.length > 0 && (
        <div>
          <p className="text-sm font-bold text-slate-700 mb-2">Current Images</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {form.existingImages.map((img: string, i: number) => (
              <div key={i} className="relative group">
                <img src={mediaBase(img)} alt="" className="w-full h-24 object-cover rounded-xl" />
                <button onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 size-6 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><X className="size-3" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-bold text-slate-700 mb-2">Upload New Images</p>
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 hover:border-blue-400 transition-all cursor-pointer">
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="edit-images" />
          <label htmlFor="edit-images" className="cursor-pointer">
            <Upload className="size-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Click to upload</p>
            <p className="text-xs text-slate-500">PNG, JPG up to 10MB each</p>
          </label>
        </div>
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-3">
            {imagePreviews.map((preview: string, i: number) => (
              <div key={i} className="relative group">
                <img src={preview} alt="" className="w-full h-24 object-cover rounded-xl" />
                <button onClick={() => removeNewImage(i)} className="absolute top-1 right-1 size-6 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><X className="size-3" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {property?.media?.propertyVideo && (
        <div>
          <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Video className="size-4 text-blue-600" /> Property Video</p>
          <video src={mediaBase(property.media.propertyVideo)} controls className="w-full max-h-64 rounded-xl border-2 border-slate-200" />
        </div>
      )}

      {property?.media?.floorPlan && (
        <div>
          <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><FileText className="size-4 text-green-600" /> Floor Plan</p>
          {property.media.floorPlan.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
            <img src={mediaBase(property.media.floorPlan)} alt="Floor Plan" className="w-full max-h-64 object-contain rounded-xl border-2 border-slate-200 bg-slate-50" />
          ) : (
            <a href={mediaBase(property.media.floorPlan)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 font-bold text-sm hover:bg-green-100 transition-colors w-fit">
              <FileText className="size-4" /> Download Floor Plan
            </a>
          )}
        </div>
      )}

      {property?.media?.legalDocuments?.length > 0 && (
        <div>
          <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><File className="size-4 text-purple-600" /> Legal Documents</p>
          <div className="space-y-2">
            {property.media.legalDocuments.map((doc: string, i: number) => (
              <a key={i} href={mediaBase(doc)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-xl text-purple-700 font-bold text-sm hover:bg-purple-100 transition-colors">
                <FileText className="size-4" /> Document {i + 1} — {doc.split('/').pop()}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}