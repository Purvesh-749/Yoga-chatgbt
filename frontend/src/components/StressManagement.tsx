import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Heart,
  Brain,
  Wind,
  Timer,
  Target,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { saveUserData, getUserData } from "@/lib/userDataStorage";

interface MeditationSession {
  id: string;
  name: string;
  duration: number; // in minutes
  type: "breathing" | "mindfulness" | "body-scan" | "visualization";
  description: string;
  instructions: string[];
}

interface StressData {
  dailyStress: number; // 1-10 scale
  completedSessions: number;
  totalMinutes: number;
  streak: number;
}

const StressManagement = () => {
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes default
  const [currentStep, setCurrentStep] = useState(0);
  const [stressData, setStressData] = useState<StressData>({
    dailyStress: 5,
    completedSessions: 0,
    totalMinutes: 0,
    streak: 0
  });

  const meditationSessions: MeditationSession[] = [
    {
      id: "box-breathing",
      name: "Box Breathing",
      duration: 5,
      type: "breathing",
      description: "Simple 4-4-4-4 breathing pattern to calm your nervous system",
      instructions: [
        "Sit comfortably with your back straight",
        "Inhale slowly for 4 counts",
        "Hold your breath for 4 counts", 
        "Exhale slowly for 4 counts",
        "Hold empty for 4 counts",
        "Repeat the cycle"
      ]
    },
    {
      id: "body-scan",
      name: "Body Scan Meditation",
      duration: 10,
      type: "body-scan",
      description: "Release tension by systematically relaxing each part of your body",
      instructions: [
        "Lie down or sit comfortably",
        "Close your eyes and breathe naturally",
        "Start with the top of your head",
        "Slowly move attention down your body",
        "Notice any tension without judgment",
        "Consciously relax each area"
      ]
    },
    {
      id: "mindful-moment",
      name: "Mindful Moment",
      duration: 3,
      type: "mindfulness",
      description: "Quick mindfulness practice for busy moments",
      instructions: [
        "Pause whatever you're doing",
        "Take three deep breaths",
        "Notice 5 things you can see",
        "Notice 4 things you can hear",
        "Notice 3 things you can feel",
        "Return to the present moment"
      ]
    },
    {
      id: "stress-relief",
      name: "Stress Relief Visualization",
      duration: 15,
      type: "visualization",
      description: "Guided imagery to release stress and find inner peace",
      instructions: [
        "Find a quiet, comfortable space",
        "Close your eyes and breathe deeply",
        "Imagine a peaceful, safe place",
        "Engage all your senses in this place",
        "Feel stress melting away",
        "Stay here as long as you need"
      ]
    }
  ];

  useEffect(() => {
    const defaultData = {
      dailyStress: 5,
      completedSessions: 0,
      totalMinutes: 0,
      streak: 0
    };
    
    const stored = getUserData('stress', defaultData);
    setStressData(stored);
  }, []);

  useEffect(() => {
    saveUserData('stress', stressData);
  }, [stressData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      completeMeditation();
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const startMeditation = (session: MeditationSession) => {
    setSelectedSession(session);
    setTimeRemaining(session.duration * 60);
    setCurrentStep(0);
    setIsActive(true);
  };

  const toggleMeditation = () => {
    setIsActive(!isActive);
  };

  const resetMeditation = () => {
    if (selectedSession) {
      setTimeRemaining(selectedSession.duration * 60);
      setIsActive(false);
      setCurrentStep(0);
    }
  };

  const completeMeditation = () => {
    if (selectedSession) {
      setStressData(prev => ({
        ...prev,
        completedSessions: prev.completedSessions + 1,
        totalMinutes: prev.totalMinutes + selectedSession.duration,
        streak: prev.streak + 1
      }));
      
      setIsActive(false);
      setSelectedSession(null);
    }
  };

  const nextStep = () => {
    if (selectedSession && currentStep < selectedSession.instructions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      breathing: "bg-blue-100 text-blue-800",
      mindfulness: "bg-green-100 text-green-800",
      "body-scan": "bg-purple-100 text-purple-800",
      visualization: "bg-yellow-100 text-yellow-800"
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      breathing: <Wind className="h-4 w-4" />,
      mindfulness: <Brain className="h-4 w-4" />,
      "body-scan": <Heart className="h-4 w-4" />,
      visualization: <Target className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <Heart className="h-4 w-4" />;
  };

  const updateStressLevel = (level: number) => {
    setStressData(prev => ({ ...prev, dailyStress: level }));
  };

  if (selectedSession && isActive) {
    return (
      <div className="min-h-screen bg-gradient-wellness">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedSession(null)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sessions
            </Button>

            <Card className="bg-gradient-card shadow-gentle border-border/50">
              <CardHeader>
                <CardTitle className="text-center">
                  {selectedSession.name}
                </CardTitle>
                <div className="text-center">
                  <Badge className={getTypeColor(selectedSession.type)}>
                    {getTypeIcon(selectedSession.type)}
                    <span className="ml-1">{selectedSession.type}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Timer Display */}
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {formatTime(timeRemaining)}
                  </div>
                  <Progress 
                    value={(1 - timeRemaining / (selectedSession.duration * 60)) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Current Instruction */}
                <div className="bg-primary-soft/30 p-6 rounded-lg text-center">
                  <p className="text-lg font-medium mb-4">
                    Step {currentStep + 1} of {selectedSession.instructions.length}
                  </p>
                  <p className="text-base">
                    {selectedSession.instructions[currentStep]}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4">
                  <Button
                    variant={isActive ? "secondary" : "hero"}
                    size="lg"
                    onClick={toggleMeditation}
                  >
                    {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                    {isActive ? "Pause" : "Resume"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={resetMeditation}
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Reset
                  </Button>

                  {currentStep < selectedSession.instructions.length - 1 && (
                    <Button
                      variant="soft"
                      size="lg"
                      onClick={nextStep}
                    >
                      Next Step
                    </Button>
                  )}
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Find a quiet space and follow along with the guided instructions
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold">Stress & Wellness</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Check-in */}
            <Card className="bg-gradient-card shadow-gentle border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  How are you feeling today?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Rate your stress level (1 = very calm, 10 = very stressed)
                    </p>
                    <div className="flex justify-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                        <Button
                          key={level}
                          variant={stressData.dailyStress === level ? "soft" : "outline"}
                          size="sm"
                          onClick={() => updateStressLevel(level)}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                    <div className="text-lg font-semibold">
                      Current level: {stressData.dailyStress}/10
                    </div>
                  </div>

                  {stressData.dailyStress >= 7 && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Your stress level seems high today. Consider taking a few minutes for breathing or meditation.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Meditation Sessions */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Guided Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {meditationSessions.map(session => (
                    <div key={session.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{session.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(session.type)}>
                            {getTypeIcon(session.type)}
                            <span className="ml-1">{session.duration}min</span>
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {session.description}
                      </p>
                      <Button
                        variant="soft"
                        size="sm"
                        onClick={() => startMeditation(session)}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start Session
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Stats */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stressData.streak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold">{stressData.completedSessions}</div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{stressData.totalMinutes}</div>
                    <div className="text-xs text-muted-foreground">Minutes</div>
                  </div>
                </div>

                <Button variant="hero" size="sm" className="w-full">
                  View Detailed Stats
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  Quick Relief
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => startMeditation(meditationSessions[2])}
                >
                  3-Min Mindful Moment
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => startMeditation(meditationSessions[0])}
                >
                  5-Min Box Breathing
                </Button>
              </CardContent>
            </Card>

            {/* Wellness Tips */}
            <Card className="bg-gradient-hero text-white shadow-gentle">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Daily Wellness Tip</h3>
                <p className="text-sm opacity-90 mb-4">
                  Take 3 deep breaths before checking your phone in the morning. Start your day mindfully.
                </p>
                <Button variant="secondary" size="sm" className="w-full">
                  More Tips
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressManagement;