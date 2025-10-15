import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Stethoscope, Menu, User } from "lucide-react";
import { AuthDialog } from "@/components/AuthDialog";
import { UserProfile } from "@/components/UserProfile";
import { useAuth } from "@/hooks/useAuth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Header = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAuth();
  const [initials, setInitials] = useState('');
  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      const nameParts = user.user_metadata.full_name.split(' ');
      const userInitials = nameParts.map((part) => part.charAt(0).toUpperCase()).join('');
      setInitials(userInitials);
    } else if (user?.email) {
      setInitials(user.email.charAt(0).toUpperCase());
    }
  }, [user]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-medical">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">HealthWise</h1>
              <p className="text-xs text-muted-foreground">Your Health Assistant</p>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Services
          </a>
          <a href="/chatbot" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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
          
          {user ? (
            <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="medical"
                  size="sm"
                  className="hidden md:flex items-center gap-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span>My Account</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <UserProfile onClose={() => setIsProfileOpen(false)} />
              </PopoverContent>
            </Popover>
          ) : (
            <Button 
              variant="medical" 
              size="sm" 
              className="hidden md:flex"
              onClick={() => setAuthDialogOpen(true)}
            >
              <User className="h-4 w-4" />
              Sign In
            </Button>
          )}
          
          {/* Auth Dialog */}
          <AuthDialog 
            isOpen={authDialogOpen} 
            onClose={() => setAuthDialogOpen(false)} 
          />
        </div>
      </div>
    </header>
  );
};