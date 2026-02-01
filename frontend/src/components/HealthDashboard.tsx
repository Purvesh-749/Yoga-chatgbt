import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Brain, 
  Utensils, 
  Activity, 
  Calendar, 
  MessageCircle, 
  Phone, 
  Droplets,
  Moon,
  Flower
} from "lucide-react";
import wellnessHero from "@/assets/wellness-hero.jpg";
import { getCurrentUser } from "@/lib/userStorage";
import AIChatAssistant from "@/components/AIChatAssistant";

interface HealthModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: string;
  route: string;
}

const HealthDashboard = () => {
  const [greeting, setGreeting] = useState("Good morning");
  const currentUser = getCurrentUser();
  const [showAIChat, setShowAIChat] = useState(false);

  const healthModules: HealthModule[] = [
    {
      id: "symptom-checker",
      title: "Symptom Checker",
      description: "Describe your symptoms and get personalized guidance",
      icon: <Heart className="h-6 w-6" />,
      color: "bg-gradient-hero",
      action: "Check Symptoms",
      route: "/symptom-checker"
    },
    {
      id: "yoga-practice",
      title: "Yoga & Exercise",
      description: "Personalized yoga routines and pose guidance",
      icon: <Activity className="h-6 w-6" />,
      color: "bg-gradient-wellness",
      action: "Start Practice",
      route: "/yoga"
    },
    {
      id: "nutrition",
      title: "Nutrition Guide",
      description: "Meal plans and dietary recommendations",
      icon: <Utensils className="h-6 w-6" />,
      color: "bg-secondary",
      action: "View Meals",
      route: "/nutrition"
    },
    {
      id: "cycle-tracking",
      title: "Cycle Tracker",
      description: "Monitor your menstrual health and patterns",
      icon: <Calendar className="h-6 w-6" />,
      color: "bg-accent",
      action: "Track Cycle",
      route: "/cycle-tracker"
    },
    {
      id: "stress-management",
      title: "Stress & Wellness",
      description: "Meditation and stress relief techniques",
      icon: <Brain className="h-6 w-6" />,
      color: "bg-primary-soft",
      action: "Relax Now",
      route: "/stress-management"
    },
    {
      id: "emergency",
      title: "Emergency Support",
      description: "Quick access to healthcare professionals",
      icon: <Phone className="h-6 w-6" />,
      color: "bg-destructive/20",
      action: "Get Help",
      route: "/emergency"
    }
  ];

  const todaysTips = [
    { icon: <Droplets className="h-4 w-4" />, text: "Drink 8 glasses of water today" },
    { icon: <Moon className="h-4 w-4" />, text: "Aim for 7-8 hours of sleep tonight" },
    { icon: <Flower className="h-4 w-4" />, text: "Take 5 deep breaths for instant calm" }
  ];

  return (
    <div className="min-h-screen bg-gradient-wellness">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${wellnessHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero/70" />
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-2">{greeting}, {currentUser?.name || "Guest"}!</h2>
              <p className="text-lg opacity-90">How are you feeling today?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Quick Health Tips */}
        <Card className="mb-6 bg-gradient-card shadow-gentle border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Today's Wellness Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysTips.map((tip, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="p-1 bg-primary-soft rounded-full">
                    {tip.icon}
                  </div>
                  <span>{tip.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Health Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthModules.map((module) => (
            <Card 
              key={module.id} 
              className="bg-gradient-card shadow-card border-border/50 hover:shadow-gentle transition-all duration-300 cursor-pointer group"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {module.icon}
                </div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  {module.description}
                </p>
                <Link to={module.route}>
                  <Button variant="soft" className="w-full">
                    {module.action}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button 
            variant="wellness" 
            size="lg" 
            className="flex-1"
            onClick={() => setShowAIChat(true)}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Chat with AI Assistant
          </Button>
          <Link to="/emergency" className="flex-1">
            <Button variant="hero" size="lg" className="w-full">
              <Phone className="mr-2 h-5 w-5" />
              Emergency Consultation
            </Button>
          </Link>
        </div>
      </div>

      {/* AI Chat Dialog */}
      <AIChatAssistant open={showAIChat} onOpenChange={setShowAIChat} />
    </div>
  );
};

export default HealthDashboard;