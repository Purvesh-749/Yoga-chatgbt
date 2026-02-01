import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, Heart, Calendar, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OnboardingData {
  name: string;
  password: string;
  age: string;
  weight: string;
  lifestyle: string;
  cycleLength: string;
  healthGoals: string[];
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const [formData, setFormData] = useState<OnboardingData>({
    name: "",
    password: "",
    age: "",
    weight: "",
    lifestyle: "",
    cycleLength: "",
    healthGoals: []
  });

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          toast({
            title: "Name required",
            description: "Please enter your name to continue",
            variant: "destructive"
          });
          return false;
        }
        if (!formData.password.trim()) {
          toast({
            title: "Password required",
            description: "Please create a password to continue",
            variant: "destructive"
          });
          return false;
        }
        if (formData.password.length < 4) {
          toast({
            title: "Password too short",
            description: "Password must be at least 4 characters long",
            variant: "destructive"
          });
          return false;
        }
        if (!formData.age.trim()) {
          toast({
            title: "Age required",
            description: "Please enter your age to continue",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.weight.trim()) {
          toast({
            title: "Weight required",
            description: "Please enter your weight to continue",
            variant: "destructive"
          });
          return false;
        }
        if (!formData.lifestyle) {
          toast({
            title: "Lifestyle required",
            description: "Please select your lifestyle type to continue",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 3:
        if (!formData.cycleLength.trim()) {
          toast({
            title: "Cycle length required",
            description: "Please enter your menstrual cycle length to continue",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 4:
        if (formData.healthGoals.length === 0) {
          toast({
            title: "Health goals required",
            description: "Please select at least one health goal to continue",
            variant: "destructive"
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const updateFormData = (field: keyof OnboardingData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const stepIcons = [
    <Heart className="h-6 w-6" />,
    <Calendar className="h-6 w-6" />,
    <Activity className="h-6 w-6" />,
    <Heart className="h-6 w-6" />
  ];

  return (
    <div className="min-h-screen bg-gradient-wellness flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-gradient-card shadow-gentle border-border/50">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 p-3 bg-gradient-hero rounded-full w-fit">
            {stepIcons[step - 1]}
          </div>
          <CardTitle className="text-2xl text-foreground">
            {step === 1 && "Welcome to WellnessFlow"}
            {step === 2 && "About Your Health"}
            {step === 3 && "Lifestyle & Cycle"}
            {step === 4 && "Your Wellness Goals"}
          </CardTitle>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-primary" : "bg-primary-soft"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">What's your name?</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="Enter your name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="password">Create a Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  placeholder="Choose a password"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateFormData("age", e.target.value)}
                  placeholder="Your age"
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => updateFormData("weight", e.target.value)}
                  placeholder="Your weight in kg"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Lifestyle</Label>
                <RadioGroup
                  value={formData.lifestyle}
                  onValueChange={(value) => updateFormData("lifestyle", value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sedentary" id="sedentary" />
                    <Label htmlFor="sedentary">Sedentary (desk job)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="active" />
                    <Label htmlFor="active">Moderately Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-active" id="very-active" />
                    <Label htmlFor="very-active">Very Active</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cycle">Average Menstrual Cycle Length (days)</Label>
                <Input
                  id="cycle"
                  type="number"
                  value={formData.cycleLength}
                  onChange={(e) => updateFormData("cycleLength", e.target.value)}
                  placeholder="28"
                  className="mt-2"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                This helps us provide personalized health insights and reminders.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <Label>What are your main health goals? (Select all that apply)</Label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  "Manage menstrual symptoms",
                  "Improve fitness & yoga practice",
                  "Better nutrition guidance",
                  "Stress management",
                  "Pregnancy support",
                  "General wellness tracking"
                ].map((goal) => (
                  <label key={goal} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.healthGoals.includes(goal)}
                      onChange={(e) => {
                        const goals = e.target.checked
                          ? [...formData.healthGoals, goal]
                          : formData.healthGoals.filter(g => g !== goal);
                        updateFormData("healthGoals", goals);
                      }}
                      className="rounded border-border"
                    />
                    <span className="text-sm">{goal}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={handleNext}
            variant="hero"
            size="lg"
            className="w-full mt-8"
          >
            {step === 4 ? "Complete Setup" : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;