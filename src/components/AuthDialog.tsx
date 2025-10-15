import { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthDialog = ({ isOpen, onClose }: AuthDialogProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  
  const { signIn, signUp, resetPassword, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  // Close dialog when user is authenticated
  useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Set loading state
      setIsLoading(true);
      
      if (isResetMode) {
        // Handle password reset
        const { error } = await resetPassword(formData.email);
        
        if (!error) {
          toast({
            title: "Success",
            description: "Password reset email sent. Please check your inbox.",
            variant: "default",
          });
        } else {
          toast({
            title: "Error",
            description: error.message || "Failed to send password reset email",
            variant: "destructive",
          });
        }
      } else if (isLogin) {
        // Handle login
        if (!formData.password) {
          toast({
            title: "Error",
            description: "Please enter your password",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        const { error } = await signIn(formData.email, formData.password);
        
        if (!error) {
          toast({
            title: "Success",
            description: "Login successful! Redirecting to your profile...",
            variant: "default",
          });
          
          // Redirect to profile page after a short delay
          setTimeout(() => {
            window.location.href = '/profile';
          }, 1500);
        } else {
          toast({
            title: "Error",
            description: error.message || "Failed to sign in",
            variant: "destructive",
          });
        }
      } else {
        // Handle registration
        if (!formData.name || !formData.password) {
          toast({
            title: "Error",
            description: "Please fill in all required fields",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        const { error } = await signUp(formData.email, formData.password, formData.name);
        
        if (!error) {
          toast({
            title: "Success",
            description: "Registration successful! Redirecting to your profile...",
            variant: "default",
          });
          
          // Redirect to profile page after a short delay
          setTimeout(() => {
            window.location.href = '/profile';
          }, 1500);
        } else {
          toast({
            title: "Error",
            description: error.message || "Failed to create account",
            variant: "destructive",
          });
        }
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setIsResetMode(false);
    setFormData({
      email: "",
      password: "",
      name: "",
    });
  };
  
  const toggleResetMode = () => {
    setIsResetMode(!isResetMode);
    setFormData({
      ...formData,
      password: "",
    });
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {isResetMode ? "Reset Password" : isLogin ? "Sign In" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isResetMode
              ? "Enter your email to receive a password reset link"
              : isLogin
              ? "Welcome back! Sign in to your account"
              : "Join HealthWise to access all features"}
          </DialogDescription>
        </DialogHeader>
        <>
          <form onSubmit={handleSubmit}>
              <Card className="border-0 shadow-none">
                <CardContent className="space-y-4 pt-4">
                  {!isLogin && !isResetMode && (
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          className="pl-10"
                          value={formData.name}
                          onChange={handleChange}
                          required={!isLogin && !isResetMode}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {!isResetMode && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label htmlFor="password" className="text-sm font-medium">
                          Password
                        </label>
                        {isLogin && (
                          <button
                            type="button"
                            className="text-xs text-primary hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleResetMode();
                            }}
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={formData.password}
                          onChange={handleChange}
                          required={!isResetMode}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="medical"
                    className="w-full mt-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isResetMode ? "Sending..." : isLogin ? "Signing in..." : "Signing up..."}
                      </>
                    ) : isResetMode ? (
                      "Send Reset Link"
                    ) : isLogin ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                    {!isLoading && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                </CardContent>
              </Card>
            </form>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <div className="text-center w-full">
                {isResetMode ? (
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-medical-blue mt-2"
                    onClick={() => {
                      setIsResetMode(false);
                      setIsLogin(true);
                    }}
                  >
                    Back to Sign In
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-medical-blue mt-2"
                    onClick={toggleAuthMode}
                  >
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                  </button>
                )}
              </div>
            </DialogFooter>
          </>
       </DialogContent>
     </DialogPrimitive.Root>
  );
};