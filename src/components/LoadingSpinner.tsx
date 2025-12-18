import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative"
      >
        <Brain className="h-12 w-12 text-purple-500" />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-purple-500/30 border-t-purple-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-purple-600 dark:text-purple-400 font-medium"
        >
          Analyzing your symptoms...
        </motion.p>
        <p className="text-sm text-muted-foreground mt-1">
          Our AI is processing your input
        </p>
      </motion.div>
    </div>
  );
}
