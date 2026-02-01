import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  ArrowLeft,
  Calendar as CalendarIcon,
  Heart,
  Droplets,
  Flower2,
  Sun,
  Moon,
  Plus,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { saveUserData, getUserData } from "@/lib/userDataStorage";
import acupressureCramps from "@/assets/acupressure-cramps.jpg";
import acupressureHeadache from "@/assets/acupressure-headache.jpg";
import acupressureBackpain from "@/assets/acupressure-backpain.jpg";
import acupressureNausea from "@/assets/acupressure-nausea.jpg";
import acupressureBloating from "@/assets/acupressure-bloating.jpg";
import acupressureFatigue from "@/assets/acupressure-fatigue.jpg";

interface CycleData {
  lastPeriodStart: Date | null;
  cycleLength: number;
  periodLength: number;
  symptoms: SymptomLog[];
  notes: string[];
}

interface SymptomLog {
  date: Date;
  symptoms: string[];
  mood: string;
  flow: string;
  pain: number; // 1-5 scale
}

const CycleTracker = () => {
  const [cycleData, setCycleData] = useState<CycleData>({
    lastPeriodStart: null,
    cycleLength: 28,
    periodLength: 5,
    symptoms: [],
    notes: []
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [todaySymptoms, setTodaySymptoms] = useState<string[]>([]);
  const [todayMood, setTodayMood] = useState<string>("");
  const [todayFlow, setTodayFlow] = useState<string>("");
  const [todayPain, setTodayPain] = useState<number>(0);
  const [showAcupressure, setShowAcupressure] = useState(false);
  const [acupressureSolutions, setAcupressureSolutions] = useState<Array<{symptom: string, image: string, instructions: string}>>([]);

  useEffect(() => {
    const defaultData = {
      lastPeriodStart: null,
      cycleLength: 28,
      periodLength: 5,
      symptoms: [],
      notes: []
    };
    
    const stored = getUserData('cycle', defaultData);
    setCycleData({
      ...stored,
      lastPeriodStart: stored.lastPeriodStart ? new Date(stored.lastPeriodStart) : null,
      symptoms: stored.symptoms.map((s: any) => ({
        ...s,
        date: new Date(s.date)
      }))
    });
  }, []);

  useEffect(() => {
    const dataToStore = {
      ...cycleData,
      symptoms: cycleData.symptoms.map(s => ({
        ...s,
        date: s.date.toISOString()
      }))
    };
    saveUserData('cycle', dataToStore);
  }, [cycleData]);

  const calculateCyclePhase = () => {
    if (!cycleData.lastPeriodStart) return { phase: "unknown", dayInCycle: 0 };

    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - cycleData.lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24));
    const dayInCycle = (daysSinceStart % cycleData.cycleLength) + 1;

    let phase = "";
    if (dayInCycle <= cycleData.periodLength) {
      phase = "menstrual";
    } else if (dayInCycle <= 13) {
      phase = "follicular";
    } else if (dayInCycle <= 15) {
      phase = "ovulation";
    } else {
      phase = "luteal";
    }

    return { phase, dayInCycle };
  };

  const getNextPeriod = () => {
    if (!cycleData.lastPeriodStart) return null;
    
    const nextPeriod = new Date(cycleData.lastPeriodStart);
    nextPeriod.setDate(nextPeriod.getDate() + cycleData.cycleLength);
    return nextPeriod;
  };

  const getPhaseInfo = (phase: string) => {
    const phaseData = {
      menstrual: {
        icon: <Droplets className="h-5 w-5 text-red-500" />,
        color: "bg-red-100 text-red-800",
        description: "Rest and self-care time",
        tips: ["Stay hydrated", "Use heat therapy", "Get extra rest"]
      },
      follicular: {
        icon: <Flower2 className="h-5 w-5 text-green-500" />,
        color: "bg-green-100 text-green-800", 
        description: "Energy building phase",
        tips: ["Try new activities", "Eat iron-rich foods", "Light exercise"]
      },
      ovulation: {
        icon: <Sun className="h-5 w-5 text-yellow-500" />,
        color: "bg-yellow-100 text-yellow-800",
        description: "Peak fertility window",
        tips: ["Track symptoms", "Stay active", "Communicate well"]
      },
      luteal: {
        icon: <Moon className="h-5 w-5 text-purple-500" />,
        color: "bg-purple-100 text-purple-800",
        description: "Prepare for next cycle",
        tips: ["Manage cravings", "Practice mindfulness", "Monitor mood"]
      },
      unknown: {
        icon: <Heart className="h-5 w-5 text-gray-500" />,
        color: "bg-gray-100 text-gray-800",
        description: "Track your cycle to get insights",
        tips: ["Log your last period", "Note symptoms daily"]
      }
    };

    return phaseData[phase as keyof typeof phaseData] || phaseData.unknown;
  };

  const addSymptomLog = () => {
    const newLog: SymptomLog = {
      date: selectedDate,
      symptoms: todaySymptoms,
      mood: todayMood,
      flow: todayFlow,
      pain: todayPain
    };

    setCycleData(prev => ({
      ...prev,
      symptoms: [...prev.symptoms.filter(s => 
        s.date.toDateString() !== selectedDate.toDateString()
      ), newLog]
    }));

    // Generate acupressure solutions based on logged symptoms
    const solutions = getAcupressureSolutions(todaySymptoms, todayPain);
    if (solutions.length > 0) {
      setAcupressureSolutions(solutions);
      setShowAcupressure(true);
    }

    // Reset form
    setTodaySymptoms([]);
    setTodayMood("");
    setTodayFlow("");
    setTodayPain(0);
  };

  const getAcupressureSolutions = (symptoms: string[], painLevel: number) => {
    const solutions: Array<{symptom: string, image: string, instructions: string}> = [];
    
    const acupressureMap: Record<string, {image: string, instructions: string}> = {
      "Cramps": {
        image: acupressureCramps,
        instructions: "Apply firm pressure to the LI4 point (between thumb and index finger) for 2-3 minutes. This point helps relieve menstrual cramps and pelvic pain."
      },
      "Headache": {
        image: acupressureHeadache,
        instructions: "Press the points on your fingertips and the base of your thumb for 1-2 minutes each. These points help reduce headache intensity and tension."
      },
      "Back pain": {
        image: acupressureBackpain,
        instructions: "Massage the points on the back of your hand between the knuckles for 2 minutes. This helps alleviate lower back pain and tension."
      },
      "Nausea": {
        image: acupressureNausea,
        instructions: "Press the P6 point on your inner wrist (3 finger widths from the wrist crease) for 2-3 minutes. This is highly effective for nausea relief."
      },
      "Bloating": {
        image: acupressureBloating,
        instructions: "Gently massage the points on your palm center and base of fingers for 2 minutes. This helps reduce bloating and improve digestion."
      },
      "Fatigue": {
        image: acupressureFatigue,
        instructions: "Press the points on your fingertips and palm center for 1-2 minutes. These energy points help boost vitality and reduce fatigue."
      }
    };

    symptoms.forEach(symptom => {
      if (acupressureMap[symptom]) {
        solutions.push({
          symptom,
          ...acupressureMap[symptom]
        });
      }
    });

    // Add pain-specific solution if pain level is high
    if (painLevel >= 3 && !symptoms.includes("Cramps")) {
      solutions.push({
        symptom: "Pain Relief",
        image: acupressureCramps,
        instructions: "Apply pressure to the LI4 point for general pain relief. Hold for 2-3 minutes on each hand."
      });
    }

    return solutions;
  };

  const toggleSymptom = (symptom: string) => {
    setTodaySymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const commonSymptoms = [
    "Cramps", "Bloating", "Headache", "Fatigue", "Breast tenderness",
    "Mood swings", "Acne", "Back pain", "Nausea", "Food cravings"
  ];

  const moods = ["Great", "Good", "Okay", "Low", "Irritable", "Anxious"];
  const flowLevels = ["None", "Light", "Medium", "Heavy"];

  const { phase, dayInCycle } = calculateCyclePhase();
  const phaseInfo = getPhaseInfo(phase);
  const nextPeriod = getNextPeriod();

  return (
    <div className="min-h-screen bg-gradient-wellness">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Cycle Tracker</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Tracking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Acupressure Solutions Modal */}
            {showAcupressure && acupressureSolutions.length > 0 && (
              <Card className="bg-gradient-card shadow-gentle border-primary/30 border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Heart className="h-5 w-5" />
                      Acupressure Relief Solutions
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAcupressure(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                      Based on your symptoms, here are acupressure points that may help provide relief:
                    </p>
                    
                    {acupressureSolutions.map((solution, index) => (
                      <div key={index} className="bg-muted/50 p-4 rounded-lg space-y-3">
                        <h4 className="font-semibold text-primary">
                          Relief for: {solution.symptom}
                        </h4>
                        <img 
                          src={solution.image} 
                          alt={`Acupressure points for ${solution.symptom}`}
                          className="w-full max-w-md mx-auto rounded-lg shadow-md"
                        />
                        <p className="text-sm leading-relaxed">
                          {solution.instructions}
                        </p>
                      </div>
                    ))}
                    
                    <div className="bg-primary-soft/20 p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Note:</strong> Apply steady, firm pressure to each point. Breathe deeply while pressing. 
                        If you experience any discomfort, reduce pressure or stop. Consult a healthcare provider for persistent symptoms.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Cycle Status */}
            <Card className="bg-gradient-card shadow-gentle border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {phaseInfo.icon}
                  Current Cycle Phase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={phaseInfo.color}>
                      {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase
                    </Badge>
                    {dayInCycle > 0 && (
                      <span className="text-sm text-muted-foreground">
                        Day {dayInCycle} of cycle
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm">{phaseInfo.description}</p>
                  
                  <div className="bg-primary-soft/20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Phase-specific tips:</h4>
                    <ul className="space-y-1">
                      {phaseInfo.tips.map((tip, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {nextPeriod && (
                    <div className="pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Next period expected: {nextPeriod.toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Daily Logging */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Log Today's Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Symptoms */}
                <div>
                  <h4 className="font-medium mb-3">Symptoms</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {commonSymptoms.map(symptom => (
                      <Button
                        key={symptom}
                        variant={todaySymptoms.includes(symptom) ? "soft" : "outline"}
                        size="sm"
                        onClick={() => toggleSymptom(symptom)}
                      >
                        {symptom}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Mood */}
                <div>
                  <h4 className="font-medium mb-3">Mood</h4>
                  <div className="flex flex-wrap gap-2">
                    {moods.map(mood => (
                      <Button
                        key={mood}
                        variant={todayMood === mood ? "soft" : "outline"}
                        size="sm"
                        onClick={() => setTodayMood(mood)}
                      >
                        {mood}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Flow */}
                <div>
                  <h4 className="font-medium mb-3">Flow Level</h4>
                  <div className="flex gap-2">
                    {flowLevels.map(flow => (
                      <Button
                        key={flow}
                        variant={todayFlow === flow ? "soft" : "outline"}
                        size="sm"
                        onClick={() => setTodayFlow(flow)}
                      >
                        {flow}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Pain Level */}
                <div>
                  <h4 className="font-medium mb-3">Pain Level (0-5)</h4>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5].map(level => (
                      <Button
                        key={level}
                        variant={todayPain === level ? "soft" : "outline"}
                        size="sm"
                        onClick={() => setTodayPain(level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={addSymptomLog}
                  variant="hero"
                  className="w-full"
                  disabled={!todaySymptoms.length && !todayMood && !todayFlow && !todayPain}
                >
                  Save Today's Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendar */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Cycle Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Cycle Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{cycleData.cycleLength}</div>
                    <div className="text-sm text-muted-foreground">Cycle Length</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{cycleData.periodLength}</div>
                    <div className="text-sm text-muted-foreground">Period Length</div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const today = new Date();
                    setCycleData(prev => ({ ...prev, lastPeriodStart: today }));
                  }}
                >
                  Mark Period Start
                </Button>
              </CardContent>
            </Card>

            {/* Recent Symptoms */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Recent Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cycleData.symptoms.slice(-3).reverse().map((log, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="text-sm font-medium">
                        {log.date.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {log.symptoms.length > 0 && `Symptoms: ${log.symptoms.join(", ")}`}
                        {log.mood && ` • Mood: ${log.mood}`}
                      </div>
                    </div>
                  ))}
                  
                  {cycleData.symptoms.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No logs yet. Start tracking today!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleTracker;