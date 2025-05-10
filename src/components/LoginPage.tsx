
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { HeartPulse, User, Lock } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, you would validate credentials against a backend
      // For this MVP, we'll just simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onLogin(email, password);
      toast({
        title: "Success",
        description: "Login successful",
      });
      navigate('/map');
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="app-logo">
          <HeartPulse size={36} className="mr-2" />
          <span>FastMed</span>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">
          Emergency Medical Assistance
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
              <User className="h-4 w-4 text-gray-500 mr-2" />
              <Input 
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
              <Lock className="h-4 w-4 text-gray-500 mr-2" />
              <Input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Need urgent help? Login to send your location quickly to emergency services.
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
