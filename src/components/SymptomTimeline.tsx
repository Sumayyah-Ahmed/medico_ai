import { motion } from "framer-motion";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistoryRecord {
  id: string;
  symptoms: string;
  predicted_disease: string;
  created_at: string;
}

interface SymptomTimelineProps {
  history: HistoryRecord[];
  onClear: () => void;
  onSelect: (record: HistoryRecord) => void;
}

export function SymptomTimeline({ history, onClear, onSelect }: SymptomTimelineProps) {
  if (history.length === 0) return null;

  const getConditionColor = (disease: string) => {
    const colors: Record<string, string> = {
      "Fever": "bg-red-500",
      "Common Cold": "bg-blue-500",
      "Migraine": "bg-orange-500",
      "Anxiety Disorder": "bg-purple-500",
      "Depression": "bg-indigo-500",
      "Chronic Stress": "bg-rose-500",
      "Insomnia": "bg-violet-500",
      "Burnout": "bg-amber-500",
    };
    return colors[disease] || "bg-gray-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-purple-500" />
          <h2 className="text-2xl font-bold text-foreground">Session Timeline</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-indigo-500 to-pink-500" />

        <div className="space-y-4">
          {history.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
              onClick={() => onSelect(record)}
              className="relative pl-10 cursor-pointer group"
            >
              {/* Timeline dot */}
              <motion.div
                className={`absolute left-2 top-4 w-5 h-5 rounded-full ${getConditionColor(record.predicted_disease)} ring-4 ring-white dark:ring-gray-900 shadow-lg`}
                whileHover={{ scale: 1.2 }}
              />

              <div className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 hover:shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300">
                    {record.predicted_disease}
                  </span>
                  <span className="text-xs text-muted-foreground bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {record.symptoms}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
