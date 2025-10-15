import { Shield, Award, Heart, Users } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-medical-green/5 to-medical-blue/5">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-blue/10 border border-medical-blue/20">
            <Users className="h-4 w-4 text-medical-blue" />
            <span className="text-sm font-medium text-medical-blue">About Us</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Who We <span className="bg-gradient-medical bg-clip-text text-transparent">Are</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            HealthWise is an AI-powered healthcare assistant dedicated to providing trusted medical information
            and personalized health insights to users worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
            <p className="text-muted-foreground">
              At HealthWise, we're on a mission to make reliable healthcare information accessible to everyone.
              We believe that by leveraging the power of artificial intelligence, we can provide personalized
              health guidance and support to individuals around the world, regardless of their location or circumstances.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-medical-blue" />
                  <h4 className="font-semibold">Trusted Information</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  All our health information is sourced from reliable medical databases and reviewed by healthcare professionals.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-medical-green" />
                  <h4 className="font-semibold">Quality Service</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  We're committed to providing high-quality, accurate, and helpful health guidance to our users.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-8 shadow-soft border border-border/50">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">Our Values</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-medical-blue/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 text-medical-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Compassion</h4>
                    <p className="text-sm text-muted-foreground">
                      We approach every user interaction with empathy and understanding, recognizing that health concerns can be sensitive and personal.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-medical-green/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-medical-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Integrity</h4>
                    <p className="text-sm text-muted-foreground">
                      We maintain the highest standards of honesty and ethical conduct in all our operations and communications.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-medical-teal/10 flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5 text-medical-teal" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Excellence</h4>
                    <p className="text-sm text-muted-foreground">
                      We strive for excellence in everything we do, continuously improving our AI technology and services.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground italic">
                  "Our goal is to empower individuals to make informed health decisions through accessible and reliable AI-powered guidance."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};