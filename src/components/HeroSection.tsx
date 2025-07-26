import { Button } from "@/components/ui/button";
import { MessageCircle, Shield, Clock, Heart } from "lucide-react";
import heroImage from "@/assets/health-hero.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] bg-gradient-health flex items-center overflow-hidden">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-up">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-blue/10 border border-medical-blue/20">
                <Heart className="h-4 w-4 text-medical-blue" />
                <span className="text-sm font-medium text-medical-blue">AI-Powered Healthcare</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Your Personal
                <span className="bg-gradient-medical bg-clip-text text-transparent"> Health</span>
                <br />
                Assistant
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-md">
                Get instant health insights, symptom analysis, and trusted medical information 
                powered by advanced AI technology.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="medical" size="xl" className="group">
                <MessageCircle className="h-5 w-5 group-hover:animate-pulse" />
                Start Health Chat
              </Button>
              <Button variant="outline" size="xl">
                Explore Services
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-medical-blue/10">
                  <Shield className="h-6 w-6 text-medical-blue" />
                </div>
                <p className="text-sm font-medium">Trusted Info</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-medical-green/10">
                  <Clock className="h-6 w-6 text-medical-green" />
                </div>
                <p className="text-sm font-medium">24/7 Available</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-medical-teal/10">
                  <Heart className="h-6 w-6 text-medical-teal" />
                </div>
                <p className="text-sm font-medium">Personal Care</p>
              </div>
            </div>
          </div>

          <div className="relative lg:block hidden">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="HealthHabit AI Assistant" 
                className="w-full h-auto rounded-2xl shadow-elevated"
              />
              <div className="absolute inset-0 bg-gradient-trust rounded-2xl"></div>
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 p-4 bg-card rounded-xl shadow-medical border animate-pulse-glow">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-medical-green rounded-full"></div>
                <span className="text-sm font-medium">AI Assistant Online</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 p-4 bg-card rounded-xl shadow-medical border">
              <div className="text-center">
                <p className="text-2xl font-bold text-medical-blue">24/7</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-32 h-32 bg-medical-blue/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-40 h-40 bg-medical-green/5 rounded-full blur-3xl"></div>
    </section>
  );
};