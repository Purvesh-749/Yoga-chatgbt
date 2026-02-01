import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Heart,
  ArrowLeft,
  User,
  Camera,
  ExternalLink
} from "lucide-react";
import yogaPose1 from "@/assets/yoga-pose-1.jpg";
import yogaTreePose from "@/assets/yoga-tree-pose.jpg";
import yogaChairPose from "@/assets/yoga-chair-pose.jpg";
import yogaCobraPose from "@/assets/yoga-cobra-pose.jpg";
import yogaWarriorPose from "@/assets/yoga-warrior-pose.jpg";
import yogaDownwardDog from "@/assets/yoga-downward-dog.jpg";
import yogaShoulderStand from "@/assets/yoga-shoulder-stand.jpg";
import yogaTrianglePose from "@/assets/yoga-triangle-pose.jpg";

interface YogaPose {
  id: string;
  name: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  benefits: string[];
  instructions: string[];
  image: string;
  healthConditions: string[];
}

const YogaModule = () => {
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);

  const yogaPoses: YogaPose[] = [
    {
      id: "tree-pose",
      name: "Tree Pose (Vrksasana)",
      duration: "30-60 seconds per side",
      difficulty: "Beginner",
      benefits: [
        "Improves balance and stability",
        "Strengthens legs and core",
        "Enhances focus and concentration",
        "Promotes mental calmness"
      ],
      instructions: [
        "Stand with feet together",
        "Shift weight onto one leg",
        "Place opposite foot on inner thigh or calf",
        "Bring hands to prayer position at chest",
        "Raise arms overhead if comfortable",
        "Hold and breathe, then switch sides"
      ],
      image: yogaTreePose,
      healthConditions: ["Anxiety", "Poor Balance", "Stress"]
    },
    {
      id: "chair-pose",
      name: "Chair Pose (Utkatasana)",
      duration: "30-60 seconds",
      difficulty: "Intermediate",
      benefits: [
        "Strengthens legs and glutes",
        "Tones core muscles",
        "Improves posture",
        "Boosts metabolism"
      ],
      instructions: [
        "Stand with feet hip-width apart",
        "Bend knees as if sitting in a chair",
        "Keep weight in heels",
        "Raise arms overhead",
        "Keep chest lifted and back straight",
        "Hold and breathe deeply"
      ],
      image: yogaChairPose,
      healthConditions: ["Weak Muscles", "Poor Posture", "Low Energy"]
    },
    {
      id: "cobra-pose",
      name: "Cobra Pose (Bhujangasana)",
      duration: "15-30 seconds",
      difficulty: "Beginner",
      benefits: [
        "Stretches chest and abdomen",
        "Strengthens spine",
        "Relieves menstrual discomfort",
        "Opens heart chakra"
      ],
      instructions: [
        "Lie face down on the mat",
        "Place hands under shoulders",
        "Press into hands, lifting chest",
        "Keep elbows slightly bent",
        "Draw shoulders back and down",
        "Breathe and hold, then release"
      ],
      image: yogaCobraPose,
      healthConditions: ["Menstrual Pain", "Back Stiffness", "Respiratory Issues"]
    },
    {
      id: "warrior-pose",
      name: "Warrior II Pose (Virabhadrasana II)",
      duration: "30-60 seconds per side",
      difficulty: "Intermediate",
      benefits: [
        "Builds strength and stamina",
        "Opens hips and chest",
        "Improves circulation",
        "Boosts confidence"
      ],
      instructions: [
        "Step feet wide apart",
        "Turn right foot out 90 degrees",
        "Bend right knee over ankle",
        "Extend arms parallel to floor",
        "Gaze over front fingertips",
        "Hold, then switch sides"
      ],
      image: yogaWarriorPose,
      healthConditions: ["Weak Legs", "Low Confidence", "Poor Circulation"]
    },
    {
      id: "downward-dog",
      name: "Downward Facing Dog (Adho Mukha Svanasana)",
      duration: "1-3 minutes",
      difficulty: "Beginner",
      benefits: [
        "Full body stretch",
        "Strengthens arms and legs",
        "Relieves back pain",
        "Energizes the body"
      ],
      instructions: [
        "Start on hands and knees",
        "Tuck toes and lift hips up",
        "Form inverted V shape",
        "Press hands firmly into mat",
        "Keep back straight",
        "Breathe deeply and hold"
      ],
      image: yogaDownwardDog,
      healthConditions: ["Fatigue", "Back Pain", "Tension"]
    },
    {
      id: "shoulder-stand",
      name: "Shoulder Stand (Sarvangasana)",
      duration: "30-60 seconds",
      difficulty: "Advanced",
      benefits: [
        "Improves circulation",
        "Balances thyroid function",
        "Calms nervous system",
        "Relieves fatigue"
      ],
      instructions: [
        "Lie on back with legs extended",
        "Lift legs up and over head",
        "Support lower back with hands",
        "Straighten legs upward",
        "Keep neck relaxed",
        "Hold and breathe, slowly release"
      ],
      image: yogaShoulderStand,
      healthConditions: ["Thyroid Issues", "Poor Circulation", "Insomnia"]
    },
    {
      id: "triangle-pose",
      name: "Triangle Pose (Trikonasana)",
      duration: "30-60 seconds per side",
      difficulty: "Intermediate",
      benefits: [
        "Stretches legs and hips",
        "Opens chest and shoulders",
        "Improves digestion",
        "Strengthens core"
      ],
      instructions: [
        "Stand with feet wide apart",
        "Turn right foot out 90 degrees",
        "Extend arms parallel to floor",
        "Reach right hand down to shin or floor",
        "Extend left arm up toward sky",
        "Hold, then switch sides"
      ],
      image: yogaTrianglePose,
      healthConditions: ["Digestive Issues", "Anxiety", "Back Pain"]
    }
  ];

  const handleStartTimer = () => {
    setIsTimerActive(true);
    // Timer logic would go here
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (selectedPose) {
    return (
      <div className="min-h-screen bg-gradient-wellness">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedPose(null)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Poses
          </Button>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pose Image and Video */}
            <Card className="bg-gradient-card shadow-gentle border-border/50">
              <CardContent className="p-6">
                <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={selectedPose.image} 
                    alt={selectedPose.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Pose Detection Feature */}
                <div className="bg-primary-soft/30 p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Camera className="h-5 w-5 text-primary" />
                    <span className="font-medium">AI Pose Detection</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use your camera to get real-time feedback on your pose
                  </p>
                  <Link to="/pose-detection">
                    <Button variant="soft" size="sm" className="w-full">
                      Start Pose Detection
                    </Button>
                  </Link>
                </div>

                {/* Timer */}
                <div className="bg-gradient-card p-4 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-medium">Practice Timer</span>
                    </div>
                    <span className="text-2xl font-bold">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={isTimerActive ? "secondary" : "hero"}
                      onClick={handleStartTimer}
                      className="flex-1"
                    >
                      {isTimerActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                      {isTimerActive ? "Pause" : "Start"}
                    </Button>
                    <Button variant="outline" size="icon">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pose Details */}
            <div className="space-y-6">
              <Card className="bg-gradient-card shadow-card border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{selectedPose.name}</CardTitle>
                    <Badge className={getDifficultyColor(selectedPose.difficulty)}>
                      {selectedPose.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedPose.duration}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Good for:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPose.healthConditions.map((condition) => (
                          <Badge key={condition} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedPose.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Heart className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Step-by-Step Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {selectedPose.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
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
          <h1 className="text-2xl font-bold">Yoga & Wellness</h1>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-muted-foreground">Personalized yoga practices for your health needs</p>
        </div>

        {/* Demo Website Button */}
        <div className="flex justify-center mb-8">
          <Button 
            variant="royal" 
            size="lg"
            onClick={() => window.open('https://your-demo-website.com', '_blank')}
            className="gap-2"
          >
            <ExternalLink className="h-5 w-5" />
            View Demo Website
          </Button>
        </div>

        {/* Quick Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {["All Poses", "Menstrual Health", "Stress Relief", "Back Pain", "Energy Boost"].map((filter) => (
            <Button key={filter} variant="soft" size="sm">
              {filter}
            </Button>
          ))}
        </div>

        {/* Yoga Poses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {yogaPoses.map((pose) => (
            <Card 
              key={pose.id}
              className="bg-gradient-card shadow-card border-border/50 hover:shadow-gentle transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedPose(pose)}
            >
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <img 
                  src={pose.image} 
                  alt={pose.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{pose.name}</CardTitle>
                  <Badge className={getDifficultyColor(pose.difficulty)}>
                    {pose.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {pose.duration}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {pose.healthConditions.slice(0, 2).map((condition) => (
                      <Badge key={condition} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="soft" size="sm" className="w-full">
                    Start Practice
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Features */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-hero text-white shadow-gentle">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Camera className="h-8 w-8" />
                <div>
                  <h3 className="text-lg font-semibold">AI Pose Detection</h3>
                  <p className="text-sm opacity-90">Get real-time feedback on your form</p>
                </div>
              </div>
              <Link to="/pose-detection">
                <Button variant="secondary" className="w-full">
                  Try Pose Detection
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-gentle border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Personal Yoga Coach</h3>
                  <p className="text-sm text-muted-foreground">Customized routines for your health goals</p>
                </div>
              </div>
              <Button variant="hero" className="w-full">
                Create My Routine
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default YogaModule;