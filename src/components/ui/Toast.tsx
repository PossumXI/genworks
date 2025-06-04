import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

const toastTypes = {
  success: 'bg-green-100 text-green-800 border-green-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
};

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  type = 'info',
  duration = 5000,
  onClose,
}) => {
  React.useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg ${toastTypes[type]}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="font-medium">{title}</p>
            {description && (
              <p className="mt-1 text-sm opacity-90">{description}</p>
            )}
          </div>
          <button
            onClick={() => onClose(id)}
            className="ml-4 inline-flex shrink-0 rounded-md p-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const ToastContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="fixed bottom-0 right-0 z-50 w-full md:max-w-sm p-4 md:p-6 pointer-events-none">
      <AnimatePresence>{children}</AnimatePresence>
    </div>
  );
};