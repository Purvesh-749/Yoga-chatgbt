import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft,
  Phone,
  MessageCircle,
  AlertTriangle,
  Heart,
  MapPin,
  Clock,
  Shield,
  Stethoscope,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: "emergency" | "health" | "mental-health" | "domestic-violence";
  description: string;
  available: string;
  country: string;
}

interface RedFlag {
  id: string;
  symptom: string;
  urgency: "immediate" | "urgent" | "concerning";
  action: string;
  description: string;
}

const EmergencySupport = () => {
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [showRedFlags, setShowRedFlags] = useState(true);

  const emergencyContacts: EmergencyContact[] = [
    // United States
    {
      id: "us-911",
      name: "Emergency Services",
      number: "911",
      type: "emergency",
      description: "Life-threatening emergencies",
      available: "24/7",
      country: "US"
    },
    {
      id: "us-suicide",
      name: "Suicide & Crisis Lifeline",
      number: "988",
      type: "mental-health",
      description: "Mental health crisis support",
      available: "24/7", 
      country: "US"
    },
    {
      id: "us-domestic-violence",
      name: "National Domestic Violence Hotline",
      number: "1-800-799-7233",
      type: "domestic-violence",
      description: "Domestic violence support and resources",
      available: "24/7",
      country: "US"
    },
    {
      id: "us-womens-health",
      name: "Women's Health Line",
      number: "1-800-994-9662",
      type: "health",
      description: "Women's health information and referrals",
      available: "Mon-Fri 9AM-6PM EST",
      country: "US"
    },
    // United Kingdom
    {
      id: "uk-999",
      name: "Emergency Services",
      number: "999",
      type: "emergency",
      description: "Life-threatening emergencies",
      available: "24/7",
      country: "UK"
    },
    {
      id: "uk-nhs",
      name: "NHS 111",
      number: "111",
      type: "health",
      description: "Non-emergency medical help and advice",
      available: "24/7",
      country: "UK"
    },
    {
      id: "uk-samaritans",
      name: "Samaritans",
      number: "116-123",
      type: "mental-health",
      description: "Emotional support for anyone in distress",
      available: "24/7",
      country: "UK"
    },
    // India
    {
      id: "india-112",
      name: "Emergency Services",
      number: "112",
      type: "emergency",
      description: "All emergency services",
      available: "24/7",
      country: "India"
    },
    {
      id: "india-women",
      name: "Women Helpline",
      number: "1091",
      type: "domestic-violence",
      description: "Women in distress, harassment support",
      available: "24/7",
      country: "India"
    },
    {
      id: "india-mental",
      name: "Mental Health Helpline",
      number: "08046110007",
      type: "mental-health",
      description: "NIMHANS mental health support",
      available: "24/7",
      country: "India"
    },
    // Canada
    {
      id: "canada-911",
      name: "Emergency Services",
      number: "911",
      type: "emergency",
      description: "Life-threatening emergencies",
      available: "24/7",
      country: "Canada"
    },
    {
      id: "canada-crisis",
      name: "Crisis Services Canada",
      number: "1-833-456-4566",
      type: "mental-health",
      description: "Mental health crisis support",
      available: "24/7",
      country: "Canada"
    },
    // Australia
    {
      id: "aus-000",
      name: "Emergency Services",
      number: "000",
      type: "emergency",
      description: "Police, fire, ambulance",
      available: "24/7",
      country: "Australia"
    },
    {
      id: "aus-lifeline",
      name: "Lifeline",
      number: "13-11-14",
      type: "mental-health",
      description: "Crisis support and suicide prevention",
      available: "24/7",
      country: "Australia"
    },
    {
      id: "aus-womens",
      name: "1800RESPECT",
      number: "1800-737-732",
      type: "domestic-violence",
      description: "National sexual assault, domestic violence counselling",
      available: "24/7",
      country: "Australia"
    }
  ];

  const redFlags: RedFlag[] = [
    {
      id: "severe-bleeding",
      symptom: "Heavy vaginal bleeding (soaking pad/tampon every hour)",
      urgency: "immediate",
      action: "Call 911 immediately",
      description: "This could indicate a serious medical emergency requiring immediate care."
    },
    {
      id: "pregnancy-pain",
      symptom: "Severe abdominal pain during pregnancy",
      urgency: "immediate", 
      action: "Call 911 or go to ER",
      description: "Could indicate complications like ectopic pregnancy or placental abruption."
    },
    {
      id: "chest-pain",
      symptom: "Chest pain or difficulty breathing",
      urgency: "immediate",
      action: "Call 911 immediately",
      description: "Heart problems can present differently in women. Don't ignore chest discomfort."
    },
    {
      id: "severe-headache",
      symptom: "Sudden severe headache with vision changes",
      urgency: "urgent",
      action: "Seek immediate medical care",
      description: "Could indicate stroke, especially if combined with other symptoms."
    },
    {
      id: "fainting",
      symptom: "Repeated fainting or dizziness with weakness",
      urgency: "urgent",
      action: "Contact healthcare provider same day",
      description: "May indicate blood loss, heart problems, or other serious conditions."
    },
    {
      id: "suicidal-thoughts",
      symptom: "Thoughts of self-harm or suicide",
      urgency: "immediate",
      action: "Call 988 or 911",
      description: "Mental health emergencies are medical emergencies. Help is available 24/7."
    }
  ];

  const makeCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "immediate": return "bg-red-100 text-red-800 border-red-200";
      case "urgent": return "bg-orange-100 text-orange-800 border-orange-200";
      case "concerning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "emergency": return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "health": return <Stethoscope className="h-5 w-5 text-blue-500" />;
      case "mental-health": return <Heart className="h-5 w-5 text-purple-500" />;
      case "domestic-violence": return <Shield className="h-5 w-5 text-green-500" />;
      default: return <Phone className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-wellness">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard  
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Emergency Support</h1>
          </div>
          
          {/* Country Selector */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background"
            >
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="India">India</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>

        {/* Important Notice */}
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800">
            <strong>Medical Emergency:</strong> If you are experiencing a life-threatening emergency, 
            call {selectedCountry === "US" || selectedCountry === "Canada" ? "911" : selectedCountry === "UK" ? "999" : selectedCountry === "Australia" ? "000" : "112"} immediately. Don't wait.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Emergency Contacts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Red Flag Symptoms */}
            {showRedFlags && (
              <Card className="bg-gradient-card shadow-gentle border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      When to Seek Immediate Help
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowRedFlags(false)}
                    >
                      Hide
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {redFlags.map(flag => (
                      <div key={flag.id} className={`p-4 border rounded-lg ${getUrgencyColor(flag.urgency)}`}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{flag.symptom}</h4>
                          <Badge variant="outline" className="text-xs">
                            {flag.urgency}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{flag.description}</p>
                        <div className="text-sm font-medium">
                          Action: {flag.action}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Emergency Contacts */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencyContacts.filter(c => c.country === selectedCountry).map(contact => (
                    <div key={contact.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(contact.type)}
                          <div>
                            <h4 className="font-medium">{contact.name}</h4>
                            <p className="text-sm text-muted-foreground">{contact.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {contact.available}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4" />
                          <span className="font-mono font-medium">{contact.number}</span>
                        </div>
                        <Button
                          variant="soft"
                          size="sm"
                          onClick={() => makeCall(contact.number)}
                        >
                          Call Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Text Support */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Text Support Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Crisis Text Line</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Free, confidential crisis support via text message
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Text HOME to 741741</span>
                      <Badge variant="outline" className="text-xs">24/7</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">SAMHSA Text Support</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Mental health and substance abuse information
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Text your zip code to 435748</span>
                      <Badge variant="outline" className="text-xs">24/7</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Emergency */}
            <Card className="bg-red-50 border-red-200 shadow-card">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 text-sm mb-4">
                  Life-threatening emergency or immediate danger
                </p>
                <Button 
                  variant="destructive" 
                  size="lg" 
                  className="w-full"
                  onClick={() => {
                    const emergencyNum = selectedCountry === "US" || selectedCountry === "Canada" ? "911" : 
                                        selectedCountry === "UK" ? "999" : 
                                        selectedCountry === "Australia" ? "000" : "112";
                    makeCall(emergencyNum);
                  }}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call {selectedCountry === "US" || selectedCountry === "Canada" ? "911" : 
                        selectedCountry === "UK" ? "999" : 
                        selectedCountry === "Australia" ? "000" : "112"} Now
                </Button>
              </CardContent>
            </Card>

            {/* Find Nearby */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Find Nearby Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  Nearest Hospital
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Urgent Care Centers
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Support Groups
                </Button>
              </CardContent>
            </Card>

            {/* Wellness Check */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Wellness Check
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Regular check-ins with healthcare providers can help prevent emergencies
                </p>
                <Button variant="hero" size="sm" className="w-full">
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>

            {/* Important Info */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Remember
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-primary rounded-full mt-2" />
                    Trust your instincts about your health
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-primary rounded-full mt-2" />
                    Don't hesitate to seek help when needed
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-primary rounded-full mt-2" />
                    Keep important medical info accessible
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-primary rounded-full mt-2" />
                    Know your medications and allergies
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencySupport;