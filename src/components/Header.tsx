import { Button } from "@/components/ui/button";
import { Stethoscope, Menu, User } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-medical">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">HealthHabit</h1>
              <p className="text-xs text-muted-foreground">Your Health Assistant</p>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Services
          </a>
          <a href="#chat" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            AI Chat
          </a>
          <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="medical" size="sm" className="hidden md:flex">
            <User className="h-4 w-4" />
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};