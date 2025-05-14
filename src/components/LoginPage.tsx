
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { HeartPulse, User, Lock } from "lucide-react";
import { Route, useNavigate } from 'react-router-dom';
import TestMobilePage from './TestMobilePage';

interface LoginPageProps {
  onLogin: (phone: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {

  const [phone, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone) {
      toast({
        title: "Error",
        description: "Iltimos telefon raqamingizni kiriting",
        variant: "destructive",
      });
      return;
    }
    
    
    setIsLoading(true);
    
    try {
      // In a real app, you would validate credentials against a backend
      // For this MVP, we'll just simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onLogin(phone);
      toast({
        title: "Success",
        description: "Login successful",
      });
      // navigate('/leafmap');
      // <Route path="/test" element={<TestMobilePage />} />
      // window.location.href = '/test';
      window.location.href = '/leafmap';
      // window.location.href = '/map';
    } catch (error) {
      console.log(error);      
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
          Tezkor tibbiy yordamga ulanish
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">                    
          <div className="space-y-2">
            <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
              <Lock className="h-4 w-4 text-gray-500 mr-2" />
              <Input 
                type="phone" 
                placeholder="Telefon"
                value={phone}
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
        Tizimga kirish Shoshilinch yordam kerakmi? Joylashuvingizni tezda favqulodda xizmatlarga yuborish uchun tizimga kiring.
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
