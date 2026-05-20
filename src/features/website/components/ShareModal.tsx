import { X, Share2, Facebook, Twitter, MessageCircle, Mail, Link2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ShareModalProps {
  show: boolean;
  property: any | null;
  onClose: () => void;
  onCopyLink: () => void;
}

export default function ShareModal({ show, property, onClose, onCopyLink }: ShareModalProps) {
  if (!property) return null;

  const propertyUrl = `${window.location.origin}/properties/${property.slug || property._id}`;

  const shareOptions = [
    {
      label: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=`,
    },
    {
      label: "Twitter",
      icon: Twitter,
      color: "bg-sky-500 hover:bg-sky-600",
      url: `https://twitter.com/intent/tweet?url=`,
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-600 hover:bg-green-700",
      url: `https://wa.me/?text=`,
    },
    {
      label: "Email",
      icon: Mail,
      color: "bg-slate-700 hover:bg-slate-800",
      url: `mailto:?subject=${encodeURIComponent(property.propertyTitle)}&body=`,
    },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 size-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
              >
                <X className="size-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Share2 className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black">Share Property</h3>
                  <p className="text-sm text-white/80">{property.propertyTitle}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {shareOptions.map((item) => (
                  <button
                    key={item.label}
                    onClick={() =>
                      window.open(item.url + encodeURIComponent(propertyUrl), "_blank")
                    }
                    className={`p-4 ${item.color} text-white rounded-2xl font-bold transition-all hover:scale-105 flex items-center justify-center gap-2`}
                  >
                    <item.icon className="size-5" /> {item.label}
                  </button>
                ))}
              </div>
              <div className="pt-4 border-t-2 border-slate-100">
                <p className="text-sm font-bold text-slate-600 mb-3">Or copy link</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={propertyUrl}
                    className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-sm text-slate-700 font-medium"
                  />
                  <button
                    onClick={onCopyLink}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Link2 className="size-4" /> Copy
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
