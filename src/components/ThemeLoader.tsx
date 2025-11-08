// ThemeLoader.tsx
import { motion, AnimatePresence } from "framer-motion";

export function ThemeLoader({ loading }: { loading: boolean }) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xl font-semibold text-foreground animate-pulse">
            Applying Theme...
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
