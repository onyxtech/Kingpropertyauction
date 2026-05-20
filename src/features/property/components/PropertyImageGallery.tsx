import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/features/shared/figma/ImageWithFallback";

interface PropertyImageGalleryProps {
  images: string[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onOpenModal: () => void;
  onSetIndex: (idx: number) => void;
  propertyTitle: string;
  propertyId: string;
}

export default function PropertyImageGallery({
  images,
  currentIndex,
  onPrev,
  onNext,
  onOpenModal,
  onSetIndex,
  propertyTitle,
  propertyId,
}: PropertyImageGalleryProps) {
  return (
    <div className="container mx-auto px-6 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 relative">
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
            <ImageWithFallback
              src={images[currentIndex]}
              alt={propertyTitle}
              className="w-full h-full object-cover"
            />
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 size-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:scale-110"
            >
              <ChevronLeft className="size-6 text-slate-900" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 size-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl hover:scale-110"
            >
              <ChevronRight className="size-6 text-slate-900" />
            </button>
            <button
              onClick={onOpenModal}
              className="absolute bottom-4 right-4 px-5 py-3 bg-white/90 rounded-xl font-bold text-slate-900 flex items-center gap-2 shadow-xl"
            >
              View All {images.length} Photos
            </button>
            <div className="absolute top-4 left-4 px-4 py-2 bg-black/60 rounded-full text-white font-bold text-sm">
              {currentIndex + 1} / {images.length}
            </div>
            <div className="absolute top-4 right-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-black shadow-xl">
              {propertyId}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-4">
          {images.slice(0, 4).map((img: string, idx: number) => (
            <div
              key={idx}
              onClick={() => onSetIndex(idx)}
              className={`relative h-28 rounded-2xl overflow-hidden cursor-pointer transition-all ${
                currentIndex === idx
                  ? "ring-4 ring-blue-600 scale-105"
                  : "hover:scale-105 opacity-70 hover:opacity-100"
              }`}
            >
              <ImageWithFallback
                src={img}
                alt={`View ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
