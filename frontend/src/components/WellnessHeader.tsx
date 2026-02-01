import { Heart, User, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, clearCurrentUser } from "@/lib/userStorage";
import { useNavigate } from "react-router-dom";

const WellnessHeader = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    clearCurrentUser();
    window.location.href = "/";
  };

  return (
    <header className="bg-gradient-card shadow-gentle border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-hero rounded-full">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">WellnessFlow</h1>
              <p className="text-sm text-muted-foreground">
                {currentUser ? `Welcome, ${currentUser.name}` : "Your Health Companion"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WellnessHeader;