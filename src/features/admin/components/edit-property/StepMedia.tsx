import { Camera, Upload, X, Video, FileText, File, Map } from "lucide-react";

export default function StepMedia({
  form,
  updateField,
  newImages,
  imagePreviews,
  handleImageUpload,
  removeExistingImage,
  removeNewImage,
  property,
  videoFile,
  setVideoFile,
  floorPlanFile,
  setFloorPlanFile,
  existingVideo,
  setExistingVideo,
  existingFloorPlan,
  setExistingFloorPlan,
  existingLegalDocs,
  removeExistingLegalDoc,
  legalDocFiles,
  removeNewLegalDoc,
  handleLegalDocUpload,
}: any) {
  const mediaBase = (url: string) =>
    url?.startsWith("http") ? url : `http://localhost:5000${url}`;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
        <Camera className="size-6 text-pink-600" /> Media & Documents
      </h2>

      {/* Existing Images */}
      {form.existingImages?.length > 0 && (
        <div>
          <p className="text-sm font-bold text-slate-700 mb-2">
            Current Images
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {form.existingImages.map((img: string, i: number) => (
              <div key={i} className="relative group">
                <img
                  src={mediaBase(img)}
                  alt=""
                  className="w-full h-24 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(i)}
                  className="absolute top-1 right-1 size-6 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload New Images */}
      <div>
        <p className="text-sm font-bold text-slate-700 mb-2">
          Upload New Images
        </p>
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 hover:border-blue-400 transition-all cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="edit-images"
          />
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
                <img
                  src={preview}
                  alt=""
                  className="w-full h-24 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute top-1 right-1 size-6 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video */}
      <div>
        <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
          <Video className="size-4 text-blue-600" /> Property Video (Optional)
        </p>
        {existingVideo ? (
          <div className="space-y-2">
            <video
              src={mediaBase(existingVideo)}
              controls
              className="w-full max-h-48 rounded-xl border-2 border-slate-200"
            />
            <button
              type="button"
              onClick={() => setExistingVideo("")}
              className="text-xs text-red-600 font-bold hover:text-red-800 flex items-center gap-1"
            >
              <X className="size-3" /> Remove video
            </button>
          </div>
        ) : videoFile ? (
          <div className="flex items-center gap-3 p-3 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <Video className="size-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 flex-1 truncate">
              {videoFile.name}
            </span>
            <button
              type="button"
              onClick={() => setVideoFile(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50 hover:border-blue-400 transition-all">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                if (e.target.files?.[0]) setVideoFile(e.target.files[0]);
              }}
              className="hidden"
              id="edit-video"
            />
            <label htmlFor="edit-video" className="cursor-pointer">
              <Video className="size-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">
                Upload property video
              </p>
              <p className="text-xs text-slate-500">MP4, MOV up to 100MB</p>
            </label>
          </div>
        )}
      </div>

      {/* Floor Plan */}
      <div>
        <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
          <Map className="size-4 text-green-600" /> Floor Plan (Optional)
        </p>
        {existingFloorPlan ? (
          <div className="space-y-2">
            {existingFloorPlan.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img
                src={mediaBase(existingFloorPlan)}
                alt="Floor Plan"
                className="w-full max-h-48 object-contain rounded-xl border-2 border-slate-200 bg-slate-50"
              />
            ) : (
              <a
                href={mediaBase(existingFloorPlan)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 font-bold text-sm hover:bg-green-100 transition-colors w-fit"
              >
                <FileText className="size-4" /> Download Floor Plan
              </a>
            )}
            <button
              type="button"
              onClick={() => setExistingFloorPlan("")}
              className="text-xs text-red-600 font-bold hover:text-red-800 flex items-center gap-1"
            >
              <X className="size-3" /> Remove floor plan
            </button>
          </div>
        ) : floorPlanFile ? (
          <div className="flex items-center gap-3 p-3 bg-green-50 border-2 border-green-200 rounded-xl">
            <FileText className="size-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 flex-1 truncate">
              {floorPlanFile.name}
            </span>
            <button
              type="button"
              onClick={() => setFloorPlanFile(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50 hover:border-green-400 transition-all">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => {
                if (e.target.files?.[0]) setFloorPlanFile(e.target.files[0]);
              }}
              className="hidden"
              id="edit-floorplan"
            />
            <label htmlFor="edit-floorplan" className="cursor-pointer">
              <FileText className="size-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">
                Upload floor plan
              </p>
              <p className="text-xs text-slate-500">PDF, PNG, JPG up to 10MB</p>
            </label>
          </div>
        )}
      </div>

      {/* Legal Documents */}
      <div>
        <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
          <File className="size-4 text-purple-600" /> Legal Documents (Optional)
        </p>

        {/* Existing Legal Documents */}
        {(existingLegalDocs || []).length > 0 && (
          <div className="space-y-2 mb-3">
            {existingLegalDocs.map((doc: string, i: number) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-xl"
              >
                <FileText className="size-4 text-purple-600 flex-shrink-0" />
                <span className="text-sm font-medium text-purple-700 flex-1 truncate">
                  {doc.startsWith("http") ? doc.split("/").pop() : doc}
                </span>
                <button
                  type="button"
                  onClick={() => removeExistingLegalDoc(i)}
                  className="text-red-500 hover:text-red-700 flex-shrink-0"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New Legal Document Files */}
        {(legalDocFiles || []).length > 0 && (
          <div className="space-y-2 mb-3">
            {legalDocFiles.map((file: File, i: number) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-3 bg-purple-100 border-2 border-purple-300 rounded-xl"
              >
                <FileText className="size-4 text-purple-600 flex-shrink-0" />
                <span className="text-sm font-medium text-purple-700 flex-1 truncate">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeNewLegalDoc(i)}
                  className="text-red-500 hover:text-red-700 flex-shrink-0"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50 hover:border-purple-400 transition-all">
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleLegalDocUpload}
            className="hidden"
            id="edit-legal-docs"
          />
          <label htmlFor="edit-legal-docs" className="cursor-pointer">
            <FileText className="size-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">
              Upload legal documents
            </p>
            <p className="text-xs text-slate-500">PDF files up to 10MB each</p>
          </label>
        </div>
      </div>
    </div>
  );
}
