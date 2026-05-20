import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface NotificationBannerProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export default function NotificationBanner({
  message,
  type,
  onClose,
}: NotificationBannerProps) {
  const Icon = icons[type];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl border-2 shadow-xl max-w-md ${colors[type]}`}
        >
          <Icon className="size-5 flex-shrink-0" />
          <p className="font-medium text-sm flex-1">{message}</p>
          {onClose && (
            <button onClick={onClose} className="ml-2 hover:opacity-70">
              <X className="size-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
