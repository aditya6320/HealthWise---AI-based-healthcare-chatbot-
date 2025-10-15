import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Stethoscope, 
  Pill, 
  MapPin, 
  Calendar, 
  FileText,
  ArrowRight,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    icon: Brain,
    title: "Symptom Analysis",
    description: "AI-powered analysis of your symptoms with personalized insights and recommendations.",
    color: "medical-blue",
    features: ["Smart symptom checker", "Risk assessment", "Treatment suggestions"]
  },
  {
    icon: MapPin,
    title: "Find Hospitals",
    description: "Locate nearby hospitals, clinics, and healthcare facilities in your area.",
    color: "trust-blue",
    features: ["Location-based search", "Reviews & ratings", "Contact information"]
  },
  // Static feature listings (non-interactive)
  {
    icon: FileText,
    title: "Disease Information",
    description: "Comprehensive information about diseases, conditions, and medical terminology.",
    color: "medical-green",
    features: ["Medical encyclopedia", "Condition explanations", "Prevention tips"],
    isStatic: true
  },
  {
    icon: Pill,
    title: "Medicine Details",
    description: "Complete medication information including dosage, side effects, and interactions.",
    color: "medical-teal",
    features: ["Drug database", "Interaction checker", "Dosage calculator"],
    isStatic: true
  },
  {
    icon: Calendar,
    title: "Appointment Booking",
    description: "Schedule appointments with healthcare providers seamlessly.",
    color: "medical-blue",
    features: ["Online booking", "Reminder system", "Provider matching"],
    isStatic: true
  },
  {
    icon: Shield,
    title: "Health Records",
    description: "Secure storage and management of your personal health information.",
    color: "medical-green",
    features: ["Secure storage", "Easy access", "Data insights"],
    isStatic: true
  }
];

export const ServicesSection = () => {
  const navigate = useNavigate();

  const handleServiceClick = (serviceTitle: string) => {
    if (serviceTitle === "Find Hospitals") {
      navigate('/hospital-finder');
    } else if (serviceTitle === "Symptom Analysis") {
      navigate('/symptom-analysis');
    }
  };

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-blue/10 border border-medical-blue/20">
            <Stethoscope className="h-4 w-4 text-medical-blue" />
            <span className="text-sm font-medium text-medical-blue">Healthcare Services</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Comprehensive Health
            <span className="bg-gradient-medical bg-clip-text text-transparent"> Solutions</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access a complete suite of AI-powered healthcare tools designed to support 
            your health journey with trusted information and personalized care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                className="group p-6 border-0 shadow-soft hover:shadow-elevated transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <div className={`inline-flex p-3 rounded-xl bg-${service.color}/10 group-hover:bg-${service.color}/20 transition-colors`}>
                    <Icon className={`h-6 w-6 text-${service.color}`} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {service.description}
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-medical-blue"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {!service.isStatic && (
                    <Button 
                      variant="ghost" 
                      className="group flex items-center gap-2 text-primary hover:text-primary/80"
                      onClick={() => handleServiceClick(service.title)}
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  )}
                  {service.isStatic && (
                    <div className="text-sm text-muted-foreground font-medium pt-2">
                      Feature Preview
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">Healthcare services overview</p>
        </div>
      </div>
    </section>
  );
};