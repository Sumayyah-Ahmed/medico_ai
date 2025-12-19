import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Stethoscope, Activity, PieChart as PieChartIcon, ThermometerSun, Sparkles, Heart } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SymptomChips } from "@/components/SymptomChips";
import { ExportResults } from "@/components/ExportResults";
import { SymptomTimeline } from "@/components/SymptomTimeline";
import { AnimatedCard } from "@/components/AnimatedCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const diseases: Record<string, {
  name: string;
  category: "physical" | "mental";
  symptoms: { name: string; value: number; color: string }[];
  treatments: { name: string; effectiveness: number; color: string }[];
  description: string;
}> = {
  fever: {
    name: "Fever",
    category: "physical",
    symptoms: [
      { name: "High Temperature", value: 40, color: "#C2185B" },
      { name: "Body Aches", value: 30, color: "#FF7043" },
      { name: "Fatigue", value: 30, color: "#3F51B5" },
    ],
    treatments: [
      { name: "Rest", effectiveness: 90, color: "#2E7D32" },
      { name: "Hydration", effectiveness: 85, color: "#0288D1" },
      { name: "Medication", effectiveness: 75, color: "#FF7043" },
      { name: "Cold Compress", effectiveness: 65, color: "#607D8B" },
    ],
    description: "An elevated body temperature often indicating infection or illness."
  },
  cold: {
    name: "Common Cold",
    category: "physical",
    symptoms: [
      { name: "Runny Nose", value: 35, color: "#9b87f5" },
      { name: "Sore Throat", value: 35, color: "#7E69AB" },
      { name: "Cough", value: 30, color: "#D6BCFA" },
    ],
    treatments: [
      { name: "Rest", effectiveness: 85, color: "#9b87f5" },
      { name: "Hydration", effectiveness: 80, color: "#7E69AB" },
      { name: "Vitamin C", effectiveness: 70, color: "#D6BCFA" },
      { name: "Steam Inhalation", effectiveness: 60, color: "#8E9196" },
    ],
    description: "A viral infection affecting the upper respiratory tract."
  },
  headache: {
    name: "Migraine",
    category: "physical",
    symptoms: [
      { name: "Head Pain", value: 45, color: "#FF9F1C" },
      { name: "Sensitivity", value: 30, color: "#E71D36" },
      { name: "Nausea", value: 25, color: "#2EC4B6" },
    ],
    treatments: [
      { name: "Dark Room", effectiveness: 80, color: "#FF9F1C" },
      { name: "Pain Relief", effectiveness: 75, color: "#E71D36" },
      { name: "Hydration", effectiveness: 70, color: "#2EC4B6" },
      { name: "Rest", effectiveness: 65, color: "#011627" },
    ],
    description: "A severe throbbing pain, often accompanied by sensitivity to light and sound."
  },
  anxiety: {
    name: "Anxiety Disorder",
    category: "mental",
    symptoms: [
      { name: "Excessive Worry", value: 35, color: "#7C3AED" },
      { name: "Restlessness", value: 25, color: "#A78BFA" },
      { name: "Sleep Issues", value: 25, color: "#C4B5FD" },
      { name: "Physical Tension", value: 15, color: "#DDD6FE" },
    ],
    treatments: [
      { name: "Therapy (CBT)", effectiveness: 90, color: "#7C3AED" },
      { name: "Meditation", effectiveness: 80, color: "#A78BFA" },
      { name: "Exercise", effectiveness: 75, color: "#C4B5FD" },
      { name: "Breathing Exercises", effectiveness: 70, color: "#DDD6FE" },
    ],
    description: "A mental health condition characterized by persistent worry and fear affecting daily life."
  },
  depression: {
    name: "Depression",
    category: "mental",
    symptoms: [
      { name: "Persistent Sadness", value: 30, color: "#1E40AF" },
      { name: "Loss of Interest", value: 25, color: "#3B82F6" },
      { name: "Fatigue", value: 25, color: "#60A5FA" },
      { name: "Sleep Changes", value: 20, color: "#93C5FD" },
    ],
    treatments: [
      { name: "Psychotherapy", effectiveness: 85, color: "#1E40AF" },
      { name: "Physical Activity", effectiveness: 75, color: "#3B82F6" },
      { name: "Social Support", effectiveness: 70, color: "#60A5FA" },
      { name: "Routine Building", effectiveness: 65, color: "#93C5FD" },
    ],
    description: "A mood disorder causing persistent feelings of sadness and loss of interest in activities."
  },
  stress: {
    name: "Chronic Stress",
    category: "mental",
    symptoms: [
      { name: "Overwhelm", value: 30, color: "#DC2626" },
      { name: "Irritability", value: 25, color: "#F87171" },
      { name: "Muscle Tension", value: 25, color: "#FCA5A5" },
      { name: "Concentration Issues", value: 20, color: "#FECACA" },
    ],
    treatments: [
      { name: "Stress Management", effectiveness: 85, color: "#DC2626" },
      { name: "Relaxation Techniques", effectiveness: 80, color: "#F87171" },
      { name: "Time Management", effectiveness: 75, color: "#FCA5A5" },
      { name: "Lifestyle Changes", effectiveness: 70, color: "#FECACA" },
    ],
    description: "Prolonged mental or emotional strain from demanding circumstances."
  },
  insomnia: {
    name: "Insomnia",
    category: "mental",
    symptoms: [
      { name: "Difficulty Sleeping", value: 35, color: "#4F46E5" },
      { name: "Daytime Fatigue", value: 30, color: "#818CF8" },
      { name: "Mood Changes", value: 20, color: "#A5B4FC" },
      { name: "Concentration Issues", value: 15, color: "#C7D2FE" },
    ],
    treatments: [
      { name: "Sleep Hygiene", effectiveness: 85, color: "#4F46E5" },
      { name: "CBT for Insomnia", effectiveness: 80, color: "#818CF8" },
      { name: "Relaxation Techniques", effectiveness: 75, color: "#A5B4FC" },
      { name: "Screen Time Reduction", effectiveness: 70, color: "#C7D2FE" },
    ],
    description: "A sleep disorder characterized by difficulty falling asleep or staying asleep."
  },
  burnout: {
    name: "Burnout",
    category: "mental",
    symptoms: [
      { name: "Exhaustion", value: 35, color: "#EA580C" },
      { name: "Cynicism", value: 25, color: "#FB923C" },
      { name: "Reduced Performance", value: 25, color: "#FDBA74" },
      { name: "Detachment", value: 15, color: "#FED7AA" },
    ],
    treatments: [
      { name: "Work-Life Balance", effectiveness: 90, color: "#EA580C" },
      { name: "Taking Breaks", effectiveness: 85, color: "#FB923C" },
      { name: "Setting Boundaries", effectiveness: 80, color: "#FDBA74" },
      { name: "Seeking Support", effectiveness: 75, color: "#FED7AA" },
    ],
    description: "Physical and emotional exhaustion from prolonged workplace stress."
  },
  ptsd: {
    name: "PTSD",
    category: "mental",
    symptoms: [
      { name: "Flashbacks", value: 30, color: "#6366F1" },
      { name: "Nightmares", value: 25, color: "#818CF8" },
      { name: "Avoidance", value: 25, color: "#A5B4FC" },
      { name: "Hypervigilance", value: 20, color: "#C7D2FE" },
    ],
    treatments: [
      { name: "Trauma Therapy", effectiveness: 90, color: "#6366F1" },
      { name: "EMDR", effectiveness: 85, color: "#818CF8" },
      { name: "Support Groups", effectiveness: 75, color: "#A5B4FC" },
      { name: "Grounding Techniques", effectiveness: 70, color: "#C7D2FE" },
    ],
    description: "A mental health condition triggered by experiencing or witnessing traumatic events."
  },
  panicDisorder: {
    name: "Panic Disorder",
    category: "mental",
    symptoms: [
      { name: "Panic Attacks", value: 35, color: "#EF4444" },
      { name: "Heart Palpitations", value: 25, color: "#F87171" },
      { name: "Shortness of Breath", value: 25, color: "#FCA5A5" },
      { name: "Fear of Losing Control", value: 15, color: "#FECACA" },
    ],
    treatments: [
      { name: "CBT", effectiveness: 90, color: "#EF4444" },
      { name: "Breathing Techniques", effectiveness: 85, color: "#F87171" },
      { name: "Exposure Therapy", effectiveness: 80, color: "#FCA5A5" },
      { name: "Relaxation Training", effectiveness: 75, color: "#FECACA" },
    ],
    description: "Recurring unexpected panic attacks with intense fear and physical symptoms."
  },
  socialAnxiety: {
    name: "Social Anxiety",
    category: "mental",
    symptoms: [
      { name: "Fear of Judgment", value: 30, color: "#14B8A6" },
      { name: "Avoidance of Social Situations", value: 30, color: "#2DD4BF" },
      { name: "Physical Symptoms", value: 25, color: "#5EEAD4" },
      { name: "Self-Consciousness", value: 15, color: "#99F6E4" },
    ],
    treatments: [
      { name: "CBT", effectiveness: 90, color: "#14B8A6" },
      { name: "Gradual Exposure", effectiveness: 85, color: "#2DD4BF" },
      { name: "Social Skills Training", effectiveness: 75, color: "#5EEAD4" },
      { name: "Mindfulness", effectiveness: 70, color: "#99F6E4" },
    ],
    description: "Intense fear of social situations due to feelings of embarrassment or judgment."
  }
};

interface HistoryRecord {
  id: string;
  symptoms: string;
  predicted_disease: string;
  created_at: string;
}

export default function Symptoms() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<{
    disease?: string;
    treatment?: string;
  } | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      toast({
        title: "Error",
        description: "Please enter your symptoms",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setPrediction(null);

    // Simulate AI processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const symptomsLower = symptoms.toLowerCase();
      let detectedDisease = "cold";

      if (symptomsLower.includes("fever") || symptomsLower.includes("temperature")) {
        detectedDisease = "fever";
      } else if (symptomsLower.includes("headache") || symptomsLower.includes("migraine")) {
        detectedDisease = "headache";
      } else if (symptomsLower.includes("anxious") || symptomsLower.includes("anxiety") || symptomsLower.includes("worry") || symptomsLower.includes("panic")) {
        detectedDisease = "anxiety";
      } else if (symptomsLower.includes("depress") || symptomsLower.includes("sad") || symptomsLower.includes("hopeless") || symptomsLower.includes("empty")) {
        detectedDisease = "depression";
      } else if (symptomsLower.includes("stress") || symptomsLower.includes("overwhelm") || symptomsLower.includes("pressure")) {
        detectedDisease = "stress";
      } else if (symptomsLower.includes("sleep") || symptomsLower.includes("insomnia") || symptomsLower.includes("can't sleep") || symptomsLower.includes("tired")) {
        detectedDisease = "insomnia";
      } else if (symptomsLower.includes("burnout") || symptomsLower.includes("exhausted") || symptomsLower.includes("drained") || symptomsLower.includes("unmotivated")) {
        detectedDisease = "burnout";
      } else if (symptomsLower.includes("trauma") || symptomsLower.includes("flashback") || symptomsLower.includes("nightmare") || symptomsLower.includes("ptsd")) {
        detectedDisease = "ptsd";
      } else if (symptomsLower.includes("panic") || symptomsLower.includes("heart racing") || symptomsLower.includes("can't breathe") || symptomsLower.includes("losing control")) {
        detectedDisease = "panicDisorder";
      } else if (symptomsLower.includes("social") || symptomsLower.includes("shy") || symptomsLower.includes("embarrassed") || symptomsLower.includes("judged")) {
        detectedDisease = "socialAnxiety";
      }

      setSelectedDisease(detectedDisease);
      const diseaseData = diseases[detectedDisease];
      
      setPrediction({
        disease: diseaseData.name,
        treatment: `Recommended treatments include: ${diseaseData.treatments
          .map(t => t.name)
          .join(", ")}. ${diseaseData.description}`,
      });

      const newRecord: HistoryRecord = {
        id: Date.now().toString(),
        symptoms: symptoms,
        predicted_disease: diseaseData.name,
        created_at: new Date().toISOString(),
      };
      setHistory(prev => [newRecord, ...prev].slice(0, 10));

      toast({
        title: "Analysis Complete",
        description: `Detected: ${diseaseData.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChipSelect = (value: string) => {
    setSymptoms(value);
  };

  const handleHistorySelect = (record: HistoryRecord) => {
    setSymptoms(record.symptoms);
    toast({
      title: "Loaded from history",
      description: `Symptoms: "${record.symptoms.slice(0, 50)}..."`,
    });
  };

  const clearHistory = () => {
    setHistory([]);
    toast({
      title: "History cleared",
      description: "All session records have been removed.",
    });
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 transition-colors duration-500">
      <ThemeToggle />
      
      <div className="max-w-5xl mx-auto space-y-8 pt-8">
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div 
            className="flex items-center justify-center gap-3 mb-2"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Health & Wellness Analyzer
            </h1>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              
            </motion.div>
          </motion.div>
          <p className="text-muted-foreground text-lg">
            AI-powered symptom analysis for physical and mental health
          </p>
          
          {/* Stats badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-4 mt-4"
          >
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
              11 Conditions
            </span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              Frontend Only
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
              No Data Stored
            </span>
          </motion.div>
        </motion.div>

        {/* Main Form Card */}
        <AnimatedCard delay={0.1}>
          <div className="flex items-center gap-3 mb-6">
            <Stethoscope className="h-6 w-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-foreground">Symptom Analysis</h2>
          </div>
          
          <p className="text-muted-foreground mb-4">
            Quick select a condition or describe your symptoms below:
          </p>
          
          <SymptomChips onSelect={handleChipSelect} />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-foreground font-medium">Describe your symptoms in detail</label>
              <Textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe how you're feeling (e.g., fever, headache, anxiety, feeling stressed, trouble sleeping, feeling sad or overwhelmed)..."
                className="min-h-[150px] resize-none bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-purple-500 transition-all duration-200"
                required
              />
            </div>
            
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Stethoscope className="h-5 w-5" />
                    </motion.div>
                    Analyzing...
                  </span>
                ) : (
                  <>
                    <Stethoscope className="mr-2 h-5 w-5" />
                    Analyze Symptoms
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </AnimatedCard>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <AnimatedCard>
                <LoadingSpinner />
              </AnimatedCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {prediction && selectedDisease && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <AnimatedCard delay={0.1}>
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="h-6 w-6 text-purple-500" />
                  <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
                  <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
                    diseases[selectedDisease].category === "mental" 
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  }`}>
                    {diseases[selectedDisease].category === "mental" ? "Mental Health" : "Physical Health"}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">Possible Condition</h3>
                    <p className="text-2xl font-bold text-foreground">{prediction.disease}</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">Recommended Approach</h3>
                    <p className="text-foreground">{prediction.treatment}</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700"
                  >
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      ⚠️ <strong>Disclaimer:</strong> This is an AI-powered analysis for educational purposes and should not replace professional medical or mental health advice. 
                      Please consult with a healthcare provider for proper diagnosis and treatment.
                    </p>
                  </motion.div>

                  <ExportResults prediction={prediction} symptoms={symptoms} />
                </div>
              </AnimatedCard>

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-8 overflow-visible">
                <AnimatedCard delay={0.2} className="overflow-visible">
                  <div className="flex items-center gap-3 mb-4">
                    <PieChartIcon className="h-6 w-6 text-purple-500" />
                    <h2 className="text-xl font-bold text-foreground">Symptom Distribution</h2>
                  </div>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={diseases[selectedDisease].symptoms}
                          cx="50%"
                          cy="40%"
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {diseases[selectedDisease].symptoms.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => `${value}%`}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255,255,255,0.9)', 
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }} 
                        />
                        <Legend 
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{ paddingTop: '20px' }}
                          formatter={(value, entry: any) => {
                            const item = diseases[selectedDisease].symptoms.find(s => s.name === value);
                            return `${value}: ${item?.value || 0}%`;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </AnimatedCard>

                <AnimatedCard delay={0.3}>
                  <div className="flex items-center gap-3 mb-4">
                    <ThermometerSun className="h-6 w-6 text-purple-500" />
                    <h2 className="text-xl font-bold text-foreground">Treatment Effectiveness</h2>
                  </div>
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={diseases[selectedDisease].treatments} margin={{ top: 10, right: 10, bottom: 40, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 11 }} 
                          angle={-20}
                          textAnchor="end"
                          height={60}
                          interval={0}
                        />
                        <YAxis label={{ value: 'Effectiveness (%)', angle: -90, position: 'insideLeft', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255,255,255,0.9)', 
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }} 
                        />
                        <Bar dataKey="effectiveness" radius={[4, 4, 0, 0]}>
                          {diseases[selectedDisease].treatments.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </AnimatedCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline */}
        {history.length > 0 && (
          <AnimatedCard delay={0.4}>
            <SymptomTimeline 
              history={history} 
              onClear={clearHistory}
              onSelect={handleHistorySelect}
            />
          </AnimatedCard>
        )}

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8 space-y-2"
        >
          <p className="text-muted-foreground">
            Built for educational purposes • Not a substitute for professional medical advice
          </p>
          <p className="text-sm text-muted-foreground/60">
            Built by Sumayyah & powered by React
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
