import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  MapPin, 
  Phone, 
  Globe, 
  Star, 
  Navigation,
  Search,
  Filter,
  Clock,
  Map,
  ExternalLink,
  ArrowLeft,
  Settings,
  Heart,
  Share2,
  Crosshair,
  ZoomIn,
  ZoomOut
} from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  website?: string;
  rating: number;
  distance: string;
  isOpen: boolean;
  specialties: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  emergency: boolean;
  insurance: string[];
}

const kolhapurHospitals: Hospital[] = [
  {
    id: "1",
    name: "Chhatrapati Pramila Raje (CPR) Hospital",
    address: "CPR Hospital, Bhausinghaji Road, Dasara Chowk,District. Kolhapur, 416002",
    phone: "+91 - 0231-2641583",
    website: "https://rcsmgmc.ac.in/",
    rating: 4.6,
    distance: "0.5 km",
    isOpen: true,
    specialties: ["Emergency", "Cardiology", "Neurology", "Orthopedics", "Pediatrics"],
    coordinates: { lat: 16.70169426246185, lng: 74.22619956665011 },
    emergency: true,
    insurance: ["CGHS", "ESIC", "Private Insurance"]
  },
  {
    id: "2",
    name: "Diamond Superspeciality Hospital",
    address: "Diamond Superspeciality Hospital, Bawada Road, Nagala Park, Kolhapur - 416003",
    phone: "+917947137161",
    website: "https://www.lybrate.com/kolhapur/clinic/diamond-hospital",
    rating: 4.8,
    distance: "1.2 km",
    isOpen: true,
    specialties: ["Medical Education", "Superspeciality", "Multi-Specialty", "Emergency"],
    coordinates: { lat: 16.711289046992466, lng: 74.23133341366088 },
    emergency: true,
    insurance: ["Future Generali India Insurance"]
  },
  {
    id: "3",
    name: "D. Y. Patil Hospital & Research Center",
    address: "D.Y. Patil Hospital and Research Center, Tararani Chowk, Kolhapur, Maharashtra 416001",
    phone: "+91 231-2655633",
    website: "https://hospital.dypatilmedicalkop.org/",
    rating: 4.4,
    distance: "0.8 km",
    isOpen: true,
    specialties: ["General Medicine", "Anaesthesiology", "Orthopaedic (Joint Replacement)", "IMAGING"],
    coordinates: { lat: 16.715335577756427, lng: 74.25685362345509 },
    emergency: true,
    insurance: ["Private Insurance", "Cash Payment"]
  },
  {
    id: "4",
    name: "Sachin Multispeciality Hospital",
    address: "2nd floor, M6VR+RWJ Sachin superspeciality clinic, The icon building, 6th Ln, near Sarada Medical, Poorvarang, Mahalaxminagar, Rajarampuri, Kolhapur, Maharashtra 416008",
    phone: "+919479472525",
    website: "https://www.sachinhospital.com/",
    rating: 4.2,
    distance: "1.5 km",
    isOpen: true,
    specialties: ["Cardiology", "Neurology", "Emergency & Trauma", "Renal Science"], 
    coordinates: { lat: 16.694838496890387, lng: 74.24284116578342 },
    emergency: true,
    insurance: ["Free Service", "Government Schemes"]
  },
  {
    id: "5",
    name: "Aster Aadhar Hospital, Kolhapur.",
    address: "Near, R. S. No. 628, 'B' Ward, near KMT Workshop, Shastri Nagar, Kolhapur, Maharashtra 416012",
    phone: "+91 9158909090",
    website: "https://www.asterhospitals.in/hospitals/aster-aadhar-kolhapur",
    rating: 4.3,
    distance: "1.8 km",
    isOpen: true,
    specialties: ["Gastro Science", "Cardiac Surgery", "Neuro Surgery"],
    coordinates: { lat: 16.685434203397403, lng: 74.23854280996143 },
    emergency: false,
    insurance: ["Private Insurance", "Cash Payment"]
  },
  {
    id: "6",
    name: "Apple Saraswati Multispeciality Hospital",
    address: "804/2, 805/2, E Ward, Circuit House To Kadamwadi Road, Bhosalewadi, Kolhapur, Maharashtra 416003",
    phone: "0231 268 8888",
    website: "https://applehospitals.com/contact/",
    rating: 4.5,
    distance: "2.1 km",
    isOpen: true,
    specialties: ["neonatal intensive care", "paediatric intensive care", "obstetric gynaecology"],
    coordinates: { lat: 16.722515531107593, lng: 74.2546968303641 },
    emergency: false,
    insurance: ["Private Insurance", "Cash Payment"]
  },
  {
    id: "7",
    name: "Kolhapur Cancer Hospital",
    address: "Kolhapur Cancer Centre, Kagal Road, Kolhapur, Maharashtra 416002",
    phone: "+91 888 802 4444",
    website: "https://www.kolhapurcancercentre.com/",
    rating: 4.7,
    distance: "2.5 km",
    isOpen: true,
    specialties: ["Oncology", "Radiation Therapy", "Chemotherapy"],
    coordinates: { lat: 16.65844594813217, lng: 74.27023449831725 },
    emergency: true,
    insurance: ["CGHS", "ESIC", "Private Insurance"]
  },
  {
    id: "8",
    name: "Masai Children's Hospital",
    address: "Lugadi Ol Rd, near Mahanagar Palika, Kavlapur, Kolhapur, Maharashtra 416002",
    phone: "+91 93252 56090",
    website: "https://masaihospital.com/",
    rating: 4.6,
    distance: "1.9 km",
    isOpen: true,
    specialties: ["VACCINATION", "NICU", "PICU"],
    coordinates: { lat: 16.698136205241283, lng: 74.22479947907046 },
    emergency: true,
    insurance: ["Private Insurance", "Cash Payment"]
  },
  {
    id: "9",
    name: "Sai Sparsh Children's Hospital",
    address: "Sai Sparsh Children's Hospital,Mangalwar Peth, Belbag, Kolhapur",
    phone: "+91 9028023366",
    website: "https://saisparshchildrenshospital.com/",
    rating: 4.4,
    distance: "1.3 km",
    isOpen: true,
    specialties: ["NICU", "PICU", "Neuro Development Care","Physiotherapy Care"],
    coordinates: { lat: 16.691334489541777, lng: 74.22938013324872 },
    emergency: false,
    insurance: ["Private Insurance", "Cash Payment"]
  },
  {
    id: "10",
    name: "Pristine Womens Hospital",
    address: "Pristine Womens Hospital,Square 9, 395/2, near Basant Bahar Talkies, opposite Shahupuri, E Ward, New Shahupuri, Kolhapur, Maharashtra 416001",
    phone: "0231 266 7047",
    rating: 4.3,
    distance: "2.8 km",
    isOpen: true,
    specialties: ["Psychiatry", "Psychology", "Mental Health"],
    coordinates: { lat: 16.705430541215485, lng: 74.2340559639342 },
    emergency: false,
    insurance: ["Private Insurance", "Government Schemes"]
  },
  {
    id: "11",
    name: " Athaayu Multispeciality Hospital",
    address: "Athaayu Hospital, Ujalaiwadi, Kolhapur, Maharashtra 416004",
    phone: "+91 9545933333",
    website: "https://athaayuhospital.in/",
    rating: 4.5,
    distance: "1.1 km",
    isOpen: true,
    specialties: ["Transplant", "Neuro sciences", "Nephrology", "Heamatology","Oncology"],
    coordinates: { lat: 16.673678982944274, lng: 74.27215043324837 },
    emergency: true,
    insurance: ["All Insurances", "Cash Payment"]
  },
  {
    id: "12",
    name: "Lokmanya Hospital ",
    address: "1214 E Ward, Takala Main Rd, near Hotel Ramkrishna, opp. Nigade Hospital, Mali Colony, Chowk, Kolhapur, Maharashtra 416008",
    phone: "+91 07219343223",
    rating: 4.8,
    distance: "1.6 km",
    isOpen: true,
    specialties: ["ORTHOPEDICS", "Joint — Knee, Hip & Shoulder Replacement", "DERMATOLOGY"],
    coordinates: { lat: 16.69830272192296, lng: 74.24680324378919 },
    emergency: true,
    insurance: ["Private Insurance", "Government Schemes"]
  }
];

export const HospitalFinder = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>(kolhapurHospitals);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapZoom, setMapZoom] = useState(12);
  const [mapCenter, setMapCenter] = useState({ lat: 16.7050, lng: 74.2433 }); // Kolhapur center
  const [filters, setFilters] = useState({
    emergency: false,
    openNow: false,
    rating: 0
  });
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get user's current location
    const getUserLocation = () => {
      setIsLoadingLocation(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(location);
            setMapCenter(location);
            setIsLoadingLocation(false);
          },
          (error) => {
            console.log("Error getting location:", error);
            // Default to Kolhapur center
            setUserLocation({ lat: 16.7050, lng: 74.2433 });
            setIsLoadingLocation(false);
          }
        );
      } else {
        setUserLocation({ lat: 16.7050, lng: 74.2433 });
        setIsLoadingLocation(false);
      }
    };

    getUserLocation();
  }, []);

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesEmergency = !filters.emergency || hospital.emergency;
    const matchesOpenNow = !filters.openNow || hospital.isOpen;
    const matchesRating = hospital.rating >= filters.rating;

    return matchesSearch && matchesEmergency && matchesOpenNow && matchesRating;
  });

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setMapCenter(hospital.coordinates);
    setMapZoom(15);
  };

  const getDirections = (hospital: Hospital) => {
    const address = encodeURIComponent(hospital.address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
  };

  const openInGoogleMaps = (hospital: Hospital) => {
    const { lat, lng } = hospital.coordinates;
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const callHospital = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const centerOnUserLocation = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setMapZoom(14);
    }
  };

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 8));
  };

  // Calculate marker positions based on zoom level
  const getMarkerPosition = (hospital: Hospital) => {
    const baseSize = 20;
    const zoomFactor = mapZoom / 12;
    const size = baseSize * zoomFactor;
    
    // Simple position calculation (in a real app, this would be more complex)
    const latOffset = (hospital.coordinates.lat - mapCenter.lat) * 1000 * zoomFactor;
    const lngOffset = (hospital.coordinates.lng - mapCenter.lng) * 1000 * zoomFactor;
    
    return {
      left: `${50 + lngOffset}%`,
      top: `${50 - latOffset}%`,
      width: `${size}px`,
      height: `${size}px`
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-medical-blue/10 to-medical-green/10">
          <div className="container">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Find
                  <span className="bg-gradient-medical bg-clip-text text-transparent"> Hospitals in Kolhapur</span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Locate hospitals, clinics, and healthcare facilities in Kolhapur, Maharashtra
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search and Filters */}
              <Card className="p-6 border-0 shadow-soft bg-card/50 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search hospitals in Kolhapur..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Filters</h3>
                    
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.emergency}
                          onChange={(e) => setFilters(prev => ({ ...prev, emergency: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm">Emergency Services</span>
                      </label>
                      
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.openNow}
                          onChange={(e) => setFilters(prev => ({ ...prev, openNow: e.target.checked }))}
                          className="rounded"
                        />
                        <span className="text-sm">Open Now</span>
                      </label>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Minimum Rating</label>
                      <select
                        value={filters.rating}
                        onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
                        className="w-full p-2 border rounded-md text-sm"
                      >
                        <option value={0}>Any Rating</option>
                        <option value={3}>3+ Stars</option>
                        <option value={4}>4+ Stars</option>
                        <option value={4.5}>4.5+ Stars</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    disabled={isLoadingLocation}
                    onClick={centerOnUserLocation}
                  >
                    <Crosshair className="h-4 w-4 mr-2" />
                    {isLoadingLocation ? "Loading..." : "My Location"}
                  </Button>
                </div>
              </Card>

              {/* Hospital List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Kolhapur Hospitals</h3>
                  <span className="text-sm text-muted-foreground">{filteredHospitals.length} found</span>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredHospitals.map((hospital) => (
                    <Card 
                      key={hospital.id}
                      className={`p-4 border-0 shadow-soft cursor-pointer transition-all duration-200 hover:shadow-elevated ${
                        selectedHospital?.id === hospital.id 
                          ? 'ring-2 ring-medical-blue bg-medical-blue/5' 
                          : 'bg-card/50 backdrop-blur-sm'
                      }`}
                      onClick={() => handleHospitalSelect(hospital)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{hospital.name}</h4>
                            <p className="text-sm text-muted-foreground">{hospital.address}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{hospital.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{hospital.distance}</span>
                          <div className="flex items-center gap-2">
                            {hospital.emergency && (
                              <Badge variant="destructive" className="text-xs">
                                Emergency
                              </Badge>
                            )}
                            <Badge 
                              variant={hospital.isOpen ? "default" : "secondary"}
                              className={hospital.isOpen ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                            >
                              {hospital.isOpen ? "Open" : "Closed"}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {hospital.specialties.slice(0, 2).map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {hospital.specialties.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{hospital.specialties.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Map and Details */}
            <div className="lg:col-span-3 space-y-6">
              {/* Map */}
              <Card className="p-6 border-0 shadow-soft bg-card/50 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Kolhapur Hospital Map</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => selectedHospital && openInGoogleMaps(selectedHospital)}
                        disabled={!selectedHospital}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in Maps
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    {/* Map Controls */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-8 h-8 p-0"
                        onClick={handleZoomIn}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-8 h-8 p-0"
                        onClick={handleZoomOut}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Map Widget */}
                    <div 
                      ref={mapRef}
                      className="w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-medical-blue/20 relative overflow-hidden"
                      style={{
                        backgroundImage: `
                          linear-gradient(90deg, #e0f2fe 1px, transparent 1px),
                          linear-gradient(0deg, #e0f2fe 1px, transparent 1px)
                        `,
                        backgroundSize: `${20 * (mapZoom / 12)}px ${20 * (mapZoom / 12)}px`
                      }}
                    >
                      {/* Map Background Pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-green-100/30"></div>
                      
                      {/* Roads */}
                      <div className="absolute inset-0">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300/50 transform -translate-y-1/2"></div>
                        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-300/50 transform -translate-x-1/2"></div>
                      </div>
                      
                      {/* Hospital Markers */}
                      {filteredHospitals.map((hospital) => {
                        const position = getMarkerPosition(hospital);
                        return (
                          <div
                            key={hospital.id}
                            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
                            style={{
                              left: position.left,
                              top: position.top,
                              width: position.width,
                              height: position.height
                            }}
                            onClick={() => handleHospitalSelect(hospital)}
                          >
                            <div className={`
                              w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs
                              ${hospital.emergency 
                                ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                                : 'bg-blue-500 shadow-lg shadow-blue-500/50'
                              }
                              ${selectedHospital?.id === hospital.id ? 'ring-4 ring-medical-blue ring-offset-2' : ''}
                            `}>
                              {hospital.emergency ? '🚨' : '🏥'}
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded text-xs font-medium shadow-lg whitespace-nowrap">
                              {hospital.name}
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* User Location Marker */}
                      {userLocation && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 bg-medical-blue rounded-full border-2 border-white shadow-lg"></div>
                          <div className="absolute inset-0 bg-medical-blue rounded-full animate-ping opacity-75"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Hospital Details */}
              {selectedHospital && (
                <Card className="p-6 border-0 shadow-soft bg-card/50 backdrop-blur-sm">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{selectedHospital.name}</h3>
                        <p className="text-muted-foreground">{selectedHospital.address}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{selectedHospital.rating}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground">Contact Information</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{selectedHospital.phone}</span>
                            </div>
                            {selectedHospital.website && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <a 
                                  href={selectedHospital.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-medical-blue hover:underline"
                                >
                                  Visit Website
                                </a>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {selectedHospital.isOpen ? "Open Now" : "Currently Closed"}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground">Services</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedHospital.specialties.map((specialty, index) => (
                              <Badge key={index} variant="secondary">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground">Features</h4>
                          <div className="space-y-2">
                            {selectedHospital.emergency && (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="text-sm">Emergency Services Available</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-sm">Professional Medical Staff</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="text-sm">Modern Medical Equipment</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground">Accepted Insurance</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedHospital.insurance.map((ins, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {ins}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4 border-t">
                      <Button 
                        variant="medical" 
                        className="flex-1"
                        onClick={() => getDirections(selectedHospital)}
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => callHospital(selectedHospital.phone)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}; 