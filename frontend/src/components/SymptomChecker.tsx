import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  MessageCircle, 
  ArrowLeft,
  Clock,
  Thermometer,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";

interface SymptomAnalysis {
  severity: "mild" | "moderate" | "severe";
  category: string;
  description: string;
  recommendations: string[];
  precautions: string[];
  homeRemedies: string[];
}

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeSymptoms = (symptomText: string): SymptomAnalysis => {
    const lowerSymptoms = symptomText.toLowerCase();
    
    // Menstrual/Period symptoms
    if (lowerSymptoms.includes("cramp") || lowerSymptoms.includes("period") || lowerSymptoms.includes("menstrual")) {
      const severe = lowerSymptoms.includes("severe") || lowerSymptoms.includes("unbearable") || lowerSymptoms.includes("extreme");
      return {
        severity: severe ? "severe" : "moderate",
        category: "Menstrual Health",
        description: severe 
          ? "You're experiencing severe menstrual symptoms. This level of pain is not normal and requires medical attention."
          : "Common menstrual symptoms detected. While uncomfortable, these are typically manageable with proper care.",
        recommendations: [
          "Apply heating pad to lower abdomen for 15-20 minutes",
          "Take ibuprofen or naproxen as directed on package",
          "Practice gentle stretching and yoga poses",
          "Stay well-hydrated throughout the day",
          severe ? "Schedule an appointment with a gynecologist within 48 hours" : "Track symptoms in a period diary"
        ],
        precautions: [
          severe ? "Seek immediate medical care if bleeding is excessive" : "Monitor pain levels and duration",
          "Avoid strenuous exercise during heavy flow",
          "Don't ignore persistent severe pain - it could indicate endometriosis or fibroids",
          "Keep emergency contacts readily available"
        ],
        homeRemedies: [
          "Ginger tea (anti-inflammatory properties)",
          "Warm compress with lavender oil",
          "Fennel seed water (1 tsp seeds in hot water)",
          "Light walking for 20-30 minutes",
          "Dark chocolate in moderation (magnesium boost)"
        ]
      };
    }
    
    // PCOS/PCOD symptoms
    if (lowerSymptoms.includes("pcos") || lowerSymptoms.includes("pcod") || 
        lowerSymptoms.includes("irregular period") || lowerSymptoms.includes("acne") && lowerSymptoms.includes("weight")) {
      return {
        severity: "moderate",
        category: "PCOS/PCOD",
        description: "Symptoms suggest possible PCOS. This hormonal condition affects ovaries and requires proper management through lifestyle and medical care.",
        recommendations: [
          "Consult an endocrinologist for hormonal testing",
          "Start a low-glycemic index diet",
          "Incorporate 30 minutes of daily exercise",
          "Consider supplements: Inositol, Vitamin D",
          "Track menstrual cycles and symptoms"
        ],
        precautions: [
          "Avoid high-sugar and processed foods",
          "Don't skip meals - eat balanced meals every 3-4 hours",
          "Monitor weight and BMI regularly",
          "Get insulin and hormone levels checked annually"
        ],
        homeRemedies: [
          "Cinnamon tea (helps regulate blood sugar)",
          "Flaxseed powder (1 tbsp daily with water)",
          "Spearmint tea twice daily",
          "Apple cider vinegar diluted in water before meals",
          "Fenugreek seeds soaked overnight"
        ]
      };
    }
    
    // Pregnancy symptoms
    if (lowerSymptoms.includes("nausea") || lowerSymptoms.includes("morning sickness") || 
        lowerSymptoms.includes("pregnant") || lowerSymptoms.includes("pregnancy")) {
      return {
        severity: "mild",
        category: "Pregnancy",
        description: "Common early pregnancy symptoms. These are typically normal but should be monitored regularly.",
        recommendations: [
          "Eat small, frequent meals throughout the day",
          "Take prenatal vitamins with food",
          "Stay hydrated with small sips of water",
          "Get adequate rest - nap when needed",
          "Schedule regular prenatal checkups"
        ],
        precautions: [
          "Avoid spicy, fatty, and strong-smelling foods",
          "Don't take any medication without doctor approval",
          "Contact doctor if unable to keep any food/water down for 24 hours",
          "Avoid hot tubs and saunas"
        ],
        homeRemedies: [
          "Ginger candies or ginger ale",
          "Crackers before getting out of bed",
          "Lemon water or peppermint tea",
          "Vitamin B6 rich foods (bananas, avocados)",
          "Acupressure wristbands"
        ]
      };
    }
    
    // Thyroid symptoms
    if (lowerSymptoms.includes("thyroid") || lowerSymptoms.includes("fatigue") && lowerSymptoms.includes("weight") ||
        lowerSymptoms.includes("tired") && lowerSymptoms.includes("cold")) {
      return {
        severity: "moderate",
        category: "Thyroid Disorder",
        description: "Symptoms indicate possible thyroid imbalance. Thyroid function significantly impacts metabolism, energy, and overall health.",
        recommendations: [
          "Get thyroid function tests (TSH, T3, T4) done",
          "Ensure adequate iodine intake through diet",
          "Prioritize 7-8 hours of quality sleep",
          "Practice stress management techniques",
          "Consider selenium-rich foods"
        ],
        precautions: [
          "Avoid soy products if you have hypothyroidism",
          "Don't self-medicate with thyroid supplements",
          "Monitor heart rate and palpitations",
          "Regular follow-up with endocrinologist is essential"
        ],
        homeRemedies: [
          "Brazil nuts (2-3 daily for selenium)",
          "Coconut oil in cooking",
          "Ashwagandha tea (consult doctor first)",
          "Seaweed or kelp in moderation",
          "Yoga poses: shoulder stand, fish pose"
        ]
      };
    }
    
    // Anemia symptoms
    if (lowerSymptoms.includes("anemia") || lowerSymptoms.includes("dizzy") || 
        lowerSymptoms.includes("pale") || lowerSymptoms.includes("weakness") && lowerSymptoms.includes("tired")) {
      return {
        severity: "moderate",
        category: "Anemia",
        description: "Symptoms suggest possible iron deficiency anemia. This is common in women and requires proper nutrition and supplementation.",
        recommendations: [
          "Get complete blood count (CBC) test done",
          "Start iron-rich diet immediately",
          "Take iron supplements as prescribed",
          "Pair iron-rich foods with vitamin C",
          "Avoid tea/coffee with meals (blocks iron absorption)"
        ],
        precautions: [
          "Don't ignore persistent fatigue and weakness",
          "Avoid calcium supplements within 2 hours of iron intake",
          "Monitor for signs of severe anemia (chest pain, shortness of breath)",
          "Get regular hemoglobin checks"
        ],
        homeRemedies: [
          "Dates and raisins soaked overnight",
          "Beetroot juice (fresh, 100ml daily)",
          "Spinach and pomegranate salad",
          "Iron-rich lentils and beans",
          "Blackstrap molasses (1 tbsp in warm water)"
        ]
      };
    }
    
    // Menopause symptoms
    if (lowerSymptoms.includes("menopause") || lowerSymptoms.includes("hot flash") || 
        lowerSymptoms.includes("night sweat") || lowerSymptoms.includes("mood swing") && lowerSymptoms.includes("age")) {
      return {
        severity: "mild",
        category: "Menopause",
        description: "Natural menopausal symptoms. While normal, there are many ways to manage and reduce discomfort.",
        recommendations: [
          "Dress in layers for easy temperature management",
          "Keep bedroom cool and well-ventilated",
          "Practice regular exercise (reduces symptoms by 50%)",
          "Consider hormone replacement therapy (consult doctor)",
          "Join menopause support groups"
        ],
        precautions: [
          "Avoid triggers: caffeine, alcohol, spicy foods, stress",
          "Don't smoke - worsens hot flashes",
          "Monitor bone density with regular DEXA scans",
          "Stay alert for mood changes and seek support"
        ],
        homeRemedies: [
          "Black cohosh supplement",
          "Flaxseed (2 tbsp ground daily)",
          "Soy products (natural phytoestrogens)",
          "Evening primrose oil",
          "Deep breathing and meditation"
        ]
      };
    }
    
    // General/Other symptoms
    return {
      severity: "mild",
      category: "General Health",
      description: "General health concerns detected. While symptoms may be mild, it's important to monitor them and maintain overall wellness.",
      recommendations: [
        "Keep a detailed symptom diary",
        "Maintain regular sleep schedule (7-8 hours)",
        "Stay hydrated (8-10 glasses of water daily)",
        "Eat balanced meals with all food groups",
        "Consult a healthcare provider if symptoms persist"
      ],
      precautions: [
        "Don't ignore symptoms that worsen or persist beyond a week",
        "Avoid self-diagnosis and self-medication",
        "Maintain good hygiene practices",
        "Get regular health checkups"
      ],
      homeRemedies: [
        "Warm water with lemon in the morning",
        "Adequate rest and stress management",
        "Light exercise like walking or yoga",
        "Herbal teas (chamomile, green tea)",
        "Maintain a balanced diet with fruits and vegetables"
      ]
    };
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeSymptoms(symptoms);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild": return "bg-green-100 text-green-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";
      case "severe": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "mild": return <CheckCircle className="h-4 w-4" />;
      case "moderate": return <Clock className="h-4 w-4" />;
      case "severe": return <AlertTriangle className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  if (analysis) {
    return (
      <div className="min-h-screen bg-gradient-wellness p-4">
        <div className="container mx-auto max-w-2xl">
          <Button 
            variant="ghost" 
            onClick={() => setAnalysis(null)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Symptom Checker
          </Button>

          <Card className="bg-gradient-card shadow-gentle border-border/50 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-hero rounded-full">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                Symptom Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className={`${getSeverityColor(analysis.severity)} flex items-center gap-1`}>
                    {getSeverityIcon(analysis.severity)}
                    {analysis.severity.charAt(0).toUpperCase() + analysis.severity.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{analysis.category}</span>
                </div>
                <p className="text-foreground">{analysis.description}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg text-accent-foreground">Home Remedies</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.homeRemedies.map((remedy, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Heart className="h-4 w-4 text-accent-foreground mt-1 flex-shrink-0" />
                      <span className="text-sm">{remedy}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg text-destructive">Precautions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.precautions.map((precaution, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-1 flex-shrink-0" />
                      <span className="text-sm">{precaution}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex gap-4">
            <Button variant="hero" className="flex-1">
              Book Consultation
            </Button>
            <Button variant="wellness" className="flex-1">
              Save to Health Log
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-wellness p-4">
      <div className="container mx-auto max-w-2xl">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        <Card className="bg-gradient-card shadow-gentle border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-hero rounded-full">
                <Thermometer className="h-5 w-5 text-white" />
              </div>
              AI Symptom Checker
            </CardTitle>
            <p className="text-muted-foreground">
              Describe your symptoms in detail and get personalized health guidance
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                What symptoms are you experiencing?
              </label>
              <Textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms, when they started, their intensity, and any related discomfort..."
                className="min-h-32"
                disabled={isAnalyzing}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Be as specific as possible for better analysis
              </p>
            </div>

            <div className="bg-primary-soft/30 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Quick Examples:</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Menstrual cramps",
                  "Fatigue and mood swings",
                  "Nausea during pregnancy",
                  "Lower back pain",
                  "Irregular periods"
                ].map((example) => (
                  <Button
                    key={example}
                    variant="soft"
                    size="sm"
                    onClick={() => setSymptoms(example)}
                    disabled={isAnalyzing}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleAnalyze}
              variant="hero"
              size="lg"
              className="w-full"
              disabled={!symptoms.trim() || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Analyzing Symptoms...
                </>
              ) : (
                <>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Analyze My Symptoms
                </>
              )}
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              This tool provides general guidance and is not a substitute for professional medical advice.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SymptomChecker;