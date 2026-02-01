import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { validateUser, setCurrentUser } from "@/lib/userStorage";
import { useToast } from "@/hooks/use-toast";

interface LoginProps {
  onLoginSuccess: () => void;
  onNewUser: () => void;
}

const Login = ({ onLoginSuccess, onNewUser }: LoginProps) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleLogin = () => {
    if (!name || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both name and password",
        variant: "destructive"
      });
      return;
    }

    const user = validateUser(name, password);
    if (user) {
      setCurrentUser(user);
      toast({
        title: "Welcome back!",
        description: `Good to see you again, ${user.name}!`
      });
      onLoginSuccess();
    } else {
      toast({
        title: "Login failed",
        description: "Invalid name or password",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-wellness flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-card shadow-gentle border-border/50">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 p-3 bg-gradient-hero rounded-full w-fit">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl text-foreground">Welcome Back</CardTitle>
          <CardDescription>Log in to continue your wellness journey</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="mt-2"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-2"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          <Button 
            onClick={handleLogin}
            variant="hero"
            size="lg"
            className="w-full"
          >
            Log In
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">New to WellnessFlow?</p>
            <Button 
              onClick={onNewUser}
              variant="outline"
              className="w-full"
            >
              Create New Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
