import { X, Video, MapPin, Pause, Share2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "@/features/shared/figma/ImageWithFallback";

interface VirtualTourModalProps {
  show: boolean;
  property: any | null;
  tourPlaying: boolean;
  setTourPlaying: (playing: boolean) => void;
  activeRoom: string;
  setActiveRoom: (room: string) => void;
  roomImages: Record<string, string>;
  getPropertyImage: (property: any) => string;
  onClose: () => void;
  onShare: () => void;
  onNavigate: (path: string) => void;
}

const ROOMS = [
  { name: "Living Room", icon: "🛋️", gradient: "from-blue-500 to-cyan-500", id: "living" },
  { name: "Kitchen", icon: "🍳", gradient: "from-emerald-500 to-teal-500", id: "kitchen" },
  { name: "Master Bedroom", icon: "🛏️", gradient: "from-purple-500 to-pink-500", id: "bedroom" },
  { name: "Bathroom", icon: "🛁", gradient: "from-orange-500 to-red-500", id: "bathroom" },
  { name: "Exterior", icon: "🏡", gradient: "from-yellow-500 to-amber-500", id: "exterior" },
];

const HOTSPOTS = [
  { room: "bedroom", pos: "top-1/4 left-1/4", color: "bg-blue-500/80", emoji: "🛏️" },
  { room: "bathroom", pos: "top-1/3 right-1/3", color: "bg-purple-500/80", emoji: "🛁" },
  { room: "kitchen", pos: "bottom-1/4 left-1/2", color: "bg-emerald-500/80", emoji: "🍳" },
];

export default function VirtualTourModal({
  show,
  property,
  tourPlaying,
  setTourPlaying,
  activeRoom,
  setActiveRoom,
  roomImages,
  getPropertyImage,
  onClose,
  onShare,
  onNavigate,
}: VirtualTourModalProps) {
  return (
    <AnimatePresence>
      {show && property && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl w-full max-w-6xl shadow-2xl relative overflow-hidden border-2 border-white/10"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 to-orange-500 origin-left"
            />

            <button
              className="absolute top-6 right-6 size-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all hover:rotate-90 z-10 border border-white/20"
              onClick={onClose}
            >
              <X className="size-6 text-white" />
            </button>

            <div className="bg-gradient-to-b from-black/50 to-transparent p-8 relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full mb-4 shadow-xl">
                    <Video className="size-5 animate-pulse" />
                    <span className="text-sm font-bold">Video Tour</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2">{property.propertyTitle}</h3>
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className="size-5" />
                    <span className="text-lg font-medium">
                      {property.location?.city}, {property.location?.area}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 pt-0">
              <div className="bg-gradient-to-br from-blue-950 via-purple-950 to-pink-950 rounded-2xl overflow-hidden aspect-video relative border-2 border-white/10 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tourPlaying ? activeRoom : "default"}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full absolute inset-0"
                  >
                    <ImageWithFallback
                      src={tourPlaying ? roomImages[activeRoom] : getPropertyImage(property)}
                      alt={property.propertyTitle}
                      className="w-full h-full object-cover opacity-90"
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <AnimatePresence>
                  {!tourPlaying && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <motion.button
                        onClick={() => setTourPlaying(true)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="size-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl cursor-pointer group"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Video className="size-12 text-white" />
                        </motion.div>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {tourPlaying && (
                    <>
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTourPlaying(false)}
                        className="absolute top-4 right-4 size-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/40 shadow-xl z-10"
                      >
                        <Pause className="size-6 text-white" />
                      </motion.button>
                      {HOTSPOTS.map((spot) => (
                        <motion.button
                          key={spot.room}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1.25 }}
                          whileTap={{ scale: 1.1 }}
                          onClick={() => setActiveRoom(spot.room)}
                          className={`absolute ${spot.pos} size-10 ${spot.color} backdrop-blur-md rounded-full flex items-center justify-center border-2 shadow-xl cursor-pointer ${activeRoom === spot.room ? "border-yellow-400 scale-125" : "border-white"}`}
                        >
                          <span className="text-white text-lg font-black">{spot.emoji}</span>
                        </motion.button>
                      ))}
                    </>
                  )}
                </AnimatePresence>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                  <div className="px-6 py-3 bg-black/70 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className={`size-2 rounded-full animate-pulse ${tourPlaying ? "bg-green-500" : "bg-orange-500"}`} />
                      <span className="text-white text-sm font-bold">
                        {tourPlaying ? "Interactive 360° View" : "Click Play to Start Tour"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                {ROOMS.map((room, index) => (
                  <motion.button
                    key={room.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTourPlaying(true);
                      setActiveRoom(room.id);
                    }}
                    className={`p-4 bg-gradient-to-br ${room.gradient} rounded-2xl text-white font-bold shadow-lg hover:shadow-2xl border-2 group ${activeRoom === room.id && tourPlaying ? "border-yellow-400 scale-105 ring-4 ring-yellow-400/30" : "border-white/20"}`}
                  >
                    <span className="text-3xl mb-2 block">{room.icon}</span>
                    <span className="text-sm">{room.name}</span>
                  </motion.button>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onShare}
                  className="flex-1 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="size-5" /> Share Virtual Tour
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClose();
                    onNavigate(`/properties/${property.slug || property._id}`);
                  }}
                  className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                >
                  <ChevronRight className="size-5" /> View Full Details
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
