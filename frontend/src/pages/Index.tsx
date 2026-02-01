import { useState, useEffect } from "react";
import WellnessHeader from "@/components/WellnessHeader";
import OnboardingFlow from "@/components/OnboardingFlow";
import HealthDashboard from "@/components/HealthDashboard";
import Login from "@/components/Login";
import { saveUser, hasUsers, getCurrentUser, getUsers, setCurrentUser } from "@/lib/userStorage";
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

const Index = () => {
  const [view, setView] = useState<'login' | 'onboarding' | 'dashboard'>('login');
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setView('dashboard');
    } else if (!hasUsers()) {
      // No users exist, go straight to onboarding
      setView('onboarding');
    } else {
      // Users exist, show login
      setView('login');
    }
  }, []);

  const handleOnboardingComplete = (data: OnboardingData) => {
    const saved = saveUser(data);
    if (saved) {
      // Automatically log in the newly created user
      const createdUser = getUsers().find(
        (u) => u.name.toLowerCase() === data.name.toLowerCase()
      );
      if (createdUser) {
        setCurrentUser(createdUser);
      }
      toast({
        title: "Profile created!",
        description: `Welcome to WellnessFlow, ${data.name}!`
      });
      setView('dashboard');
    } else {
      toast({
        title: "Error",
        description: "A profile with this name already exists",
        variant: "destructive"
      });
    }
  };

  if (view === 'login') {
    return (
      <Login 
        onLoginSuccess={() => setView('dashboard')}
        onNewUser={() => setView('onboarding')}
      />
    );
  }

  if (view === 'onboarding') {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
  <div className="min-h-screen bg-background">
    <WellnessHeader />

    {/* START YOGA BUTTON */}
    <div className="flex justify-center mt-6">
      <a
        href="/yoga-camera"
        className="px-6 py-3 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700"
      >
        Start Yoga Detection
      </a>
    </div>
    {/* END YOGA BUTTON */}

    <HealthDashboard />
  </div>
);
};

export default Index;
