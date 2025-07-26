import { Stethoscope, Heart, Shield, Clock } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-medical">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">HealthHabit</h3>
                <p className="text-sm text-background/70">Your Health Assistant</p>
              </div>
            </div>
            <p className="text-background/70 text-sm">
              AI-powered healthcare assistant providing trusted medical information 
              and personalized health insights 24/7.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Services</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>Symptom Analysis</li>
              <li>Disease Information</li>
              <li>Medicine Details</li>
              <li>Find Hospitals</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Features</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>AI Health Chat</li>
              <li>Appointment Booking</li>
              <li>Health Records</li>
              <li>Emergency Services</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Why Choose Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-medical-blue" />
                <span className="text-sm text-background/70">Trusted Information</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-medical-green" />
                <span className="text-sm text-background/70">24/7 Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-medical-teal" />
                <span className="text-sm text-background/70">Personal Care</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-sm text-background/70">
            © 2024 HealthHabit. All rights reserved. | 
            <span className="text-background/50"> This is not a substitute for professional medical advice.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};