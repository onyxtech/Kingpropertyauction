import { Camera, Upload, X } from "lucide-react";

export default function StepMedia({ form, updateField, newImages, imagePreviews, handleImageUpload, removeExistingImage, removeNewImage }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Camera className="size-6 text-pink-600" /> Media & Images</h2>
      
      {form.existingImages?.length > 0 && (
        <div>
          <p className="text-sm font-bold text-slate-700 mb-2">Current Images</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {form.existingImages.map((img: string, i: number) => (
              <div key={i} className="relative group">
                <img src={img.startsWith("http") ? img : `http://localhost:5000${img}`} alt="" className="w-full h-24 object-cover rounded-xl" />
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
    </div>
  );
}