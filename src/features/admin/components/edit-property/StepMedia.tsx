import { mediaUrl } from "@/lib/mediaUrl";
import { Camera, Upload, X, Video, FileText, File, Map } from "lucide-react";

export default function StepMedia({
  form, updateField, newImages, imagePreviews, handleImageUpload,
  removeExistingImage, removeNewImage, property,
  videoFiles, setVideoFiles, floorPlanFiles, setFloorPlanFiles,
  existingVideos, setExistingVideos, existingFloorPlans, setExistingFloorPlans,
  existingLegalDocs, removeExistingLegalDoc, legalDocFiles, removeNewLegalDoc, handleLegalDocUpload,
}: any) {

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Camera className="size-6 text-pink-600" /> Media & Documents</h2>

      {/* Existing Images */}
      {form.existingImages?.length > 0 && (
        <div>
          <p className="text-sm font-bold text-slate-700 mb-2">Current Images</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {form.existingImages.map((img: string, i: number) => (
              <div key={i} className="relative group">
                <img src={mediaUrl(img)} alt="" className="w-full h-24 object-cover rounded-xl" />
                <button type="button" title="Remove Image" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 size-6 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><X className="size-3" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload New Images */}
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
                <button type="button" title="Remove Image" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 size-6 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><X className="size-3" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Videos */}
      <div>
        <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Video className="size-4 text-blue-600" /> Property Videos (Optional)</p>

        {existingVideos?.length > 0 && (
          <div className="space-y-2 mb-3">
            <p className="text-xs font-bold text-slate-500">Current Videos ({existingVideos.length}):</p>
            {existingVideos.map((vid: string, i: number) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <Video className="size-4 text-blue-600 flex-shrink-0" />
                <video src={mediaUrl(vid)} className="h-16 rounded-lg flex-1" />
                <button type="button" title="Remove Video" onClick={() => setExistingVideos(existingVideos.filter((_: any, idx: number) => idx !== i))} className="text-red-500 hover:text-red-700 flex-shrink-0"><X className="size-4" /></button>
              </div>
            ))}
          </div>
        )}

        {videoFiles?.length > 0 && (
          <div className="space-y-2 mb-3">
            <p className="text-xs font-bold text-slate-500">New Videos to Upload:</p>
            {videoFiles.map((vid: File, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                <Video className="size-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 flex-1 truncate">{vid.name}</span>
                <button type="button" title="Remove Video" onClick={() => setVideoFiles(videoFiles.filter((_: any, idx: number) => idx !== i))} className="text-red-500 hover:text-red-700"><X className="size-4" /></button>
              </div>
            ))}
          </div>
        )}

        <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50 hover:border-blue-400 transition-all">
          <input type="file" multiple accept="video/*" onChange={(e) => { if (e.target.files) { setVideoFiles([...(videoFiles || []), ...Array.from(e.target.files)]); e.target.value = ''; } }} className="hidden" id="edit-videos" />
          <label htmlFor="edit-videos" className="cursor-pointer">
            <Video className="size-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Add video(s)</p>
            <p className="text-xs text-slate-500">MP4, MOV up to 100MB each</p>
          </label>
        </div>
      </div>

      {/* Floor Plans */}
      <div>
        <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Map className="size-4 text-green-600" /> Floor Plans (Optional)</p>

        {existingFloorPlans?.length > 0 && (
          <div className="space-y-2 mb-3">
            <p className="text-xs font-bold text-slate-500">Current Floor Plans ({existingFloorPlans.length}):</p>
            {existingFloorPlans.map((fp: string, i: number) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                <FileText className="size-4 text-green-600 flex-shrink-0" />
                {fp.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img src={mediaUrl(fp)} alt="" className="h-16 rounded-lg flex-1 object-contain" />
                ) : (
                  <a href={mediaUrl(fp)} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-green-700 flex-1 truncate hover:underline">Floor Plan {i + 1}</a>
                )}
                <button type="button" title="Remove Floor Plan" onClick={() => setExistingFloorPlans(existingFloorPlans.filter((_: any, idx: number) => idx !== i))} className="text-red-500 hover:text-red-700 flex-shrink-0"><X className="size-4" /></button>
              </div>
            ))}
          </div>
        )}

        {floorPlanFiles?.length > 0 && (
          <div className="space-y-2 mb-3">
            <p className="text-xs font-bold text-slate-500">New Floor Plans to Upload:</p>
            {floorPlanFiles.map((fp: File, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                <FileText className="size-4 text-green-600" />
                <span className="text-sm font-medium text-green-700 flex-1 truncate">{fp.name}</span>
                <button type="button" title="Remove Floor Plan" onClick={() => setFloorPlanFiles(floorPlanFiles.filter((_: any, idx: number) => idx !== i))} className="text-red-500 hover:text-red-700"><X className="size-4" /></button>
              </div>
            ))}
          </div>
        )}

        <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50 hover:border-green-400 transition-all">
          <input type="file" multiple accept="image/*,application/pdf" onChange={(e) => { if (e.target.files) { setFloorPlanFiles([...(floorPlanFiles || []), ...Array.from(e.target.files)]); e.target.value = ''; } }} className="hidden" id="edit-floorplans" />
          <label htmlFor="edit-floorplans" className="cursor-pointer">
            <FileText className="size-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Add floor plan(s)</p>
            <p className="text-xs text-slate-500">PDF, PNG, JPG up to 10MB each</p>
          </label>
        </div>
      </div>

      {/* Legal Documents */}
      <div>
        <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><File className="size-4 text-purple-600" /> Legal Documents (Optional)</p>

        {existingLegalDocs?.length > 0 && (
          <div className="space-y-2 mb-3">
            <p className="text-xs font-bold text-slate-500">Current Documents ({existingLegalDocs.length}):</p>
            {existingLegalDocs.map((doc: string, i: number) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-purple-50 border-2 border-purple-200 rounded-xl">
                <FileText className="size-4 text-purple-600 flex-shrink-0" />
                <a href={mediaUrl(doc)} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-purple-700 flex-1 truncate hover:underline">{doc.split('/').pop()}</a>
                <button type="button" title="Remove Document" onClick={() => removeExistingLegalDoc(i)} className="text-red-500 hover:text-red-700 flex-shrink-0"><X className="size-4" /></button>
              </div>
            ))}
          </div>
        )}

        {legalDocFiles?.length > 0 && (
          <div className="space-y-2 mb-3">
            <p className="text-xs font-bold text-slate-500">New Documents to Upload:</p>
            {legalDocFiles.map((doc: File, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-purple-50 border-2 border-purple-200 rounded-xl">
                <FileText className="size-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700 flex-1 truncate">{doc.name}</span>
                <button type="button" title="Remove Document" onClick={() => removeNewLegalDoc(i)} className="text-red-500 hover:text-red-700"><X className="size-4" /></button>
              </div>
            ))}
          </div>
        )}

        <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50 hover:border-purple-400 transition-all">
          <input type="file" multiple accept="application/pdf,image/*" onChange={handleLegalDocUpload} className="hidden" id="edit-legaldocs" />
          <label htmlFor="edit-legaldocs" className="cursor-pointer">
            <File className="size-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Add legal documents</p>
            <p className="text-xs text-slate-500">PDF, PNG, JPG up to 10MB each</p>
          </label>
        </div>
      </div>
    </div>
  );
}
