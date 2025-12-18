import { motion } from "framer-motion";

interface SymptomChipsProps {
  onSelect: (symptom: string) => void;
}

const symptomSuggestions = [
  { label: "😷 Fever", value: "I have a fever and high temperature" },
  { label: "🤕 Headache", value: "I have a severe headache and sensitivity to light" },
  { label: "🤧 Cold", value: "I have a runny nose, sore throat and cough" },
  { label: "😰 Anxiety", value: "I feel anxious and worried all the time" },
  { label: "😔 Depression", value: "I feel sad, hopeless and have lost interest in things" },
  { label: "😫 Stress", value: "I feel overwhelmed and stressed with too much pressure" },
  { label: "😴 Insomnia", value: "I can't sleep and feel tired during the day" },
  { label: "🔥 Burnout", value: "I feel exhausted, drained and unmotivated from work" },
  { label: "💔 PTSD", value: "I have flashbacks and nightmares from trauma" },
  { label: "😱 Panic", value: "I have panic attacks with heart racing and can't breathe" },
  { label: "🫣 Social Anxiety", value: "I feel shy and embarrassed in social situations" },
];

export function SymptomChips({ onSelect }: SymptomChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {symptomSuggestions.map((suggestion, index) => (
        <motion.button
          key={suggestion.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(suggestion.value)}
          className="px-3 py-1.5 text-sm rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-800/50 dark:hover:to-purple-800/50 transition-all duration-200 border border-indigo-200 dark:border-indigo-700"
        >
          {suggestion.label}
        </motion.button>
      ))}
    </div>
  );
}
