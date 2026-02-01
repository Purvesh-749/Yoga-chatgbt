import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft,
  Plus,
  Minus,
  Droplets,
  Clock,
  Target,
  Apple,
  Coffee,
  Utensils,
  ChefHat,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { saveUserData, getUserData } from "@/lib/userDataStorage";
import { useToast } from "@/hooks/use-toast";
import MealPlanDialog from "@/components/MealPlanDialog";

interface NutritionData {
  waterIntake: number;
  waterGoal: number;
  meals: MealLog[];
  dailyTips: string[];
}

interface MealLog {
  id: string;
  name: string;
  calories: number;
  time: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
}

interface FoodItem {
  name: string;
  calories: number;
  benefits: string;
  category: "recommended" | "moderate" | "avoid";
}

const NutritionModule = () => {
  const { toast } = useToast();
  const [nutritionData, setNutritionData] = useState<NutritionData>({
    waterIntake: 4,
    waterGoal: 8,
    meals: [],
    dailyTips: []
  });

  const [selectedCategory, setSelectedCategory] = useState<"all" | "menstrual" | "energy" | "immunity">("all");
  const [ingredientsInput, setIngredientsInput] = useState<string>("");
  const [generatedRecipes, setGeneratedRecipes] = useState<any[]>([]);
  const [cyclePhase, setCyclePhase] = useState<string>("");
  const [showMealPlan, setShowMealPlan] = useState(false);
  const [selectedHealthProblem, setSelectedHealthProblem] = useState<string>("");

  useEffect(() => {
    const defaultData = {
      waterIntake: 0,
      waterGoal: 8,
      meals: [],
      dailyTips: [
        "Include iron-rich foods like spinach and lentils",
        "Stay hydrated with herbal teas",
        "Eat omega-3 rich foods for hormone balance"
      ]
    };
    
    const stored = getUserData('nutrition', defaultData);
    setNutritionData(stored);

    // Get cycle phase from cycle tracker
    const cycleData = getUserData('cycle', { lastPeriodStart: null, cycleLength: 28, periodLength: 5 });
    if (cycleData.lastPeriodStart) {
      const lastPeriod = new Date(cycleData.lastPeriodStart);
      const today = new Date();
      const daysSinceStart = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
      const dayInCycle = (daysSinceStart % cycleData.cycleLength) + 1;
      
      if (dayInCycle <= cycleData.periodLength) {
        setCyclePhase("menstrual");
      } else if (dayInCycle <= 13) {
        setCyclePhase("follicular");
      } else if (dayInCycle <= 15) {
        setCyclePhase("ovulation");
      } else {
        setCyclePhase("luteal");
      }
    }
  }, []);

  useEffect(() => {
    saveUserData('nutrition', nutritionData);
  }, [nutritionData]);

  const foodRecommendations: FoodItem[] = [
    {
      name: "Dark Leafy Greens",
      calories: 25,
      benefits: "High in iron and folate for menstrual health",
      category: "recommended"
    },
    {
      name: "Salmon",
      calories: 180,
      benefits: "Omega-3 fatty acids reduce inflammation",
      category: "recommended"
    },
    {
      name: "Greek Yogurt",
      calories: 130,
      benefits: "Probiotics support digestive health",
      category: "recommended"
    },
    {
      name: "Dark Chocolate",
      calories: 150,
      benefits: "Magnesium helps with cramps (in moderation)",
      category: "moderate"
    },
    {
      name: "Ginger Tea",
      calories: 5,
      benefits: "Reduces nausea and inflammation",
      category: "recommended"
    },
    {
      name: "Processed Foods",
      calories: 300,
      benefits: "May worsen bloating and inflammation",
      category: "avoid"
    }
  ];

  const updateWaterIntake = (change: number) => {
    setNutritionData(prev => ({
      ...prev,
      waterIntake: Math.max(0, Math.min(prev.waterGoal + 5, prev.waterIntake + change))
    }));
  };

  const addQuickMeal = (meal: Omit<MealLog, "id">) => {
    const newMeal = {
      ...meal,
      id: Date.now().toString()
    };
    
    setNutritionData(prev => ({
      ...prev,
      meals: [...prev.meals, newMeal]
    }));
  };

  const getTotalCalories = () => {
    return nutritionData.meals.reduce((total, meal) => total + meal.calories, 0);
  };

  const getWaterPercentage = () => {
    return (nutritionData.waterIntake / nutritionData.waterGoal) * 100;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "recommended": return "bg-green-100 text-green-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";  
      case "avoid": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const quickMeals = [
    { name: "Poha", calories: 250, type: "breakfast" as const },
    { name: "Idli Sambar", calories: 180, type: "breakfast" as const },
    { name: "Paneer Paratha", calories: 320, type: "breakfast" as const },
    { name: "Dal Chawal", calories: 350, type: "lunch" as const },
    { name: "Roti Sabzi", calories: 280, type: "lunch" as const },
    { name: "Chole Bhature", calories: 450, type: "lunch" as const },
    { name: "Khichdi", calories: 230, type: "dinner" as const },
    { name: "Masala Dosa", calories: 300, type: "dinner" as const },
    { name: "Fruit Chaat", calories: 120, type: "snack" as const },
    { name: "Masala Chai", calories: 60, type: "snack" as const }
  ];

  const recipeDatabase = [
    {
      name: "Simple Dal Tadka",
      ingredients: ["dal", "onion", "tomato", "turmeric", "cumin"],
      instructions: "Pressure cook dal with turmeric. Prepare tadka with cumin, onions, and tomatoes. Mix and serve hot with rice or roti.",
      calories: 180
    },
    {
      name: "Vegetable Pulao",
      ingredients: ["rice", "vegetables", "garam masala", "ghee"],
      instructions: "Sauté mixed vegetables in ghee with spices. Add rice and water. Cook until rice is fluffy and aromatic.",
      calories: 320
    },
    {
      name: "Paneer Bhurji",
      ingredients: ["paneer", "onion", "tomato", "green chili", "spices"],
      instructions: "Crumble paneer. Sauté onions, tomatoes, and chilies. Add paneer and spices. Cook for 5 minutes.",
      calories: 280
    },
    {
      name: "Aloo Gobi",
      ingredients: ["potato", "cauliflower", "turmeric", "cumin", "tomato"],
      instructions: "Cut vegetables. Sauté with cumin seeds, turmeric, and tomatoes. Cook covered until tender.",
      calories: 200
    },
    {
      name: "Masala Oats",
      ingredients: ["oats", "vegetables", "spices"],
      instructions: "Roast oats. Add sautéed vegetables and Indian spices. Cook with water until creamy.",
      calories: 220
    },
    {
      name: "Curd Rice",
      ingredients: ["rice", "curd", "cucumber", "curry leaves"],
      instructions: "Mix cooked rice with fresh curd. Add chopped cucumber and tempering of curry leaves and mustard seeds.",
      calories: 250
    }
  ];

  const getHealthProblemFoodRecommendations = (problem: string) => {
    const recommendations: { [key: string]: { foodsToEat: Array<{ name: string; reason: string }>, foodsToAvoid: Array<{ name: string; reason: string }> } } = {
      "menstrual-cramps": {
        foodsToEat: [
          { name: "Ginger Tea", reason: "Anti-inflammatory properties reduce cramping" },
          { name: "Dark Leafy Greens (Spinach, Kale)", reason: "High in magnesium to relax muscles" },
          { name: "Bananas", reason: "Potassium reduces bloating and cramps" },
          { name: "Salmon & Fish Oil", reason: "Omega-3 fatty acids reduce inflammation" },
          { name: "Dark Chocolate (70%+)", reason: "Magnesium relieves muscle tension" },
          { name: "Chamomile Tea", reason: "Natural muscle relaxant" },
          { name: "Turmeric Milk", reason: "Curcumin reduces period pain" },
          { name: "Fennel Seeds", reason: "Reduces cramping and bloating" }
        ],
        foodsToAvoid: [
          { name: "Caffeine (Coffee, Cola)", reason: "Increases tension and worsens cramps" },
          { name: "Fried & Processed Foods", reason: "Causes inflammation and bloating" },
          { name: "Refined Sugar", reason: "Spikes blood sugar causing mood swings" },
          { name: "Excess Salt", reason: "Leads to water retention and bloating" },
          { name: "Red Meat", reason: "Can increase prostaglandins causing pain" }
        ]
      },
      "fatigue-mood": {
        foodsToEat: [
          { name: "Whole Grains (Oats, Brown Rice)", reason: "Sustained energy release throughout the day" },
          { name: "Nuts & Seeds (Almonds, Walnuts)", reason: "Rich in B vitamins for energy production" },
          { name: "Leafy Greens", reason: "Iron prevents fatigue from anemia" },
          { name: "Eggs", reason: "Complete protein boosts energy levels" },
          { name: "Greek Yogurt", reason: "Probiotics improve gut health and mood" },
          { name: "Berries (Blueberries, Strawberries)", reason: "Antioxidants combat stress and fatigue" },
          { name: "Chickpeas & Lentils", reason: "Complex carbs stabilize blood sugar" },
          { name: "Dark Chocolate", reason: "Boosts serotonin for better mood" }
        ],
        foodsToAvoid: [
          { name: "Sugary Snacks", reason: "Causes energy crashes and mood swings" },
          { name: "White Bread & Pasta", reason: "Quick digestion leads to energy dips" },
          { name: "Alcohol", reason: "Disrupts sleep and worsens mood" },
          { name: "Excess Caffeine", reason: "Can lead to jitters and anxiety" },
          { name: "Processed Foods", reason: "Lack nutrients needed for energy" }
        ]
      },
      "pregnancy-nausea": {
        foodsToEat: [
          { name: "Ginger Tea or Ginger Candies", reason: "Natural remedy for morning sickness" },
          { name: "Plain Crackers or Toast", reason: "Bland carbs settle the stomach" },
          { name: "Lemon Water", reason: "Citrus aroma reduces nausea" },
          { name: "Cold Foods (Fruits, Yogurt)", reason: "Less odor reduces nausea triggers" },
          { name: "Small Frequent Meals", reason: "Prevents empty stomach nausea" },
          { name: "Bananas", reason: "Easy to digest, rich in B6" },
          { name: "Rice or Khichdi", reason: "Gentle on stomach, easy to digest" },
          { name: "Mint Tea", reason: "Soothes digestive system" }
        ],
        foodsToAvoid: [
          { name: "Greasy & Fried Foods", reason: "Difficult to digest, worsens nausea" },
          { name: "Spicy Foods", reason: "Can trigger acid reflux and nausea" },
          { name: "Strong Smelling Foods", reason: "Odors can trigger vomiting" },
          { name: "Caffeine", reason: "Can irritate stomach lining" },
          { name: "Large Meals", reason: "Overloading stomach increases nausea" }
        ]
      },
      "lower-back-pain": {
        foodsToEat: [
          { name: "Turmeric & Golden Milk", reason: "Anti-inflammatory reduces pain" },
          { name: "Fatty Fish (Salmon, Mackerel)", reason: "Omega-3s reduce inflammation" },
          { name: "Leafy Greens", reason: "Calcium strengthens bones" },
          { name: "Berries", reason: "Antioxidants fight inflammation" },
          { name: "Ginger", reason: "Natural pain reliever" },
          { name: "Walnuts", reason: "Omega-3s reduce back inflammation" },
          { name: "Green Tea", reason: "Polyphenols reduce pain" },
          { name: "Milk & Dairy", reason: "Calcium for bone health" }
        ],
        foodsToAvoid: [
          { name: "Processed Sugars", reason: "Increases inflammation" },
          { name: "Trans Fats", reason: "Promotes inflammation and pain" },
          { name: "Alcohol", reason: "Dehydrates and weakens muscles" },
          { name: "Excess Salt", reason: "Can cause inflammation" },
          { name: "Refined Carbohydrates", reason: "Spikes inflammation markers" }
        ]
      },
      "irregular-periods": {
        foodsToEat: [
          { name: "Flaxseeds & Chia Seeds", reason: "Omega-3s balance hormones" },
          { name: "Cinnamon", reason: "Regulates insulin and periods" },
          { name: "Turmeric", reason: "Anti-inflammatory, hormone balancing" },
          { name: "Leafy Greens", reason: "Iron and folate support menstrual health" },
          { name: "Whole Grains", reason: "Complex carbs regulate blood sugar" },
          { name: "Papaya", reason: "Helps regulate menstrual flow" },
          { name: "Sesame Seeds", reason: "Lignans help hormone regulation" },
          { name: "Ginger Tea", reason: "Stimulates menstrual flow" }
        ],
        foodsToAvoid: [
          { name: "Refined Sugar", reason: "Disrupts hormone balance" },
          { name: "Trans Fats", reason: "Increases inflammation affecting cycles" },
          { name: "Excessive Soy", reason: "May interfere with hormones" },
          { name: "Alcohol", reason: "Affects liver's hormone processing" },
          { name: "Processed Foods", reason: "Chemicals disrupt endocrine system" }
        ]
      }
    };
    
    return recommendations[problem] || { foodsToEat: [], foodsToAvoid: [] };
  };

  const getCycleFoodRecommendations = () => {
    if (cyclePhase === "menstrual") {
      return {
        foodsToEat: [
          { name: "Iron-rich Dal & Spinach", reason: "Replenish iron lost during periods" },
          { name: "Ginger Tea", reason: "Reduces menstrual cramps and nausea" },
          { name: "Dark Chocolate", reason: "Magnesium helps relax muscles" },
          { name: "Bananas", reason: "Potassium reduces bloating" },
          { name: "Warm Water", reason: "Improves blood circulation" }
        ],
        foodsToAvoid: [
          { name: "Fried & Oily Foods", reason: "Can increase bloating and inflammation" },
          { name: "Excess Salt", reason: "Causes water retention" },
          { name: "Caffeine", reason: "May worsen cramps" },
          { name: "Refined Sugar", reason: "Can cause mood swings" }
        ]
      };
    } else if (cyclePhase === "follicular") {
      return {
        foodsToEat: [
          { name: "Fresh Fruits", reason: "High energy for active phase" },
          { name: "Whole Grains", reason: "Sustained energy release" },
          { name: "Lean Proteins", reason: "Muscle building and repair" }
        ],
        foodsToAvoid: [
          { name: "Heavy Meals", reason: "Can cause sluggishness" }
        ]
      };
    } else if (cyclePhase === "ovulation") {
      return {
        foodsToEat: [
          { name: "Fiber-rich Foods", reason: "Helps hormone regulation" },
          { name: "Antioxidant Berries", reason: "Supports egg quality" }
        ],
        foodsToAvoid: [
          { name: "Processed Foods", reason: "May affect hormone balance" }
        ]
      };
    } else if (cyclePhase === "luteal") {
      return {
        foodsToEat: [
          { name: "Complex Carbs", reason: "Manages PMS symptoms" },
          { name: "Calcium-rich Foods", reason: "Reduces mood swings" },
          { name: "Vitamin B6 Foods", reason: "Helps reduce bloating" }
        ],
        foodsToAvoid: [
          { name: "Excess Sodium", reason: "Can worsen bloating" },
          { name: "Alcohol", reason: "Can intensify PMS symptoms" }
        ]
      };
    }
    return { foodsToEat: [], foodsToAvoid: [] };
  };

  const generateRecipes = () => {
    if (!ingredientsInput.trim()) {
      toast({
        title: "Please enter ingredients",
        description: "Add some ingredients you have to get recipe suggestions",
        variant: "destructive"
      });
      return;
    }

    const userIngredients = ingredientsInput.toLowerCase().split(",").map(i => i.trim());
    const matchedRecipes = recipeDatabase.filter(recipe => {
      return recipe.ingredients.some(ing => 
        userIngredients.some(userIng => ing.includes(userIng) || userIng.includes(ing))
      );
    });

    if (matchedRecipes.length > 0) {
      setGeneratedRecipes(matchedRecipes);
      toast({
        title: "Recipes Found!",
        description: `Found ${matchedRecipes.length} recipes based on your ingredients`
      });
    } else {
      toast({
        title: "No matching recipes",
        description: "Try adding common ingredients like dal, rice, vegetables, paneer, etc.",
        variant: "destructive"
      });
    }
  };

  const cycleFoodRecs = getCycleFoodRecommendations();
  const healthProblemRecs = selectedHealthProblem ? getHealthProblemFoodRecommendations(selectedHealthProblem) : { foodsToEat: [], foodsToAvoid: [] };

  return (
    <div className="min-h-screen bg-gradient-wellness">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Nutrition & Wellness</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Tracking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Water Intake */}
            <Card className="bg-gradient-card shadow-gentle border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  Daily Hydration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {nutritionData.waterIntake} / {nutritionData.waterGoal} glasses
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateWaterIntake(-1)}
                        disabled={nutritionData.waterIntake === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="soft"
                        size="sm"
                        onClick={() => updateWaterIntake(1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={getWaterPercentage()} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    {getWaterPercentage() >= 100 
                      ? "Great job! You've reached your hydration goal!" 
                      : `${nutritionData.waterGoal - nutritionData.waterIntake} glasses to go`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Meals Today */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-primary" />
                    Today's Meals
                  </span>
                  <Badge variant="outline">{getTotalCalories()} calories</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {nutritionData.meals.length > 0 ? (
                    nutritionData.meals.map(meal => (
                      <div key={meal.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <div className="font-medium">{meal.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {meal.time} • {meal.type}
                          </div>
                        </div>
                        <Badge variant="secondary">{meal.calories} cal</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No meals logged yet today
                    </p>
                  )}
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Quick Add:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {quickMeals.map(meal => (
                        <Button
                          key={meal.name}
                          variant="outline"
                          size="sm"
                          onClick={() => addQuickMeal({
                            name: meal.name,
                            calories: meal.calories,
                            type: meal.type,
                            time: new Date().toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: false 
                            })
                          })}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {meal.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Problem Food Suggestions */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Health Problem Food Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Select your health concern:
                    </label>
                    <select
                      value={selectedHealthProblem}
                      onChange={(e) => setSelectedHealthProblem(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-background"
                    >
                      <option value="">Choose a problem...</option>
                      <option value="menstrual-cramps">Menstrual Cramps</option>
                      <option value="fatigue-mood">Fatigue and Mood Swings</option>
                      <option value="pregnancy-nausea">Nausea During Pregnancy</option>
                      <option value="lower-back-pain">Lower Back Pain</option>
                      <option value="irregular-periods">Irregular Periods</option>
                    </select>
                  </div>

                  {selectedHealthProblem && (
                    <div className="space-y-4 mt-4">
                      {healthProblemRecs.foodsToEat.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                            <Apple className="h-4 w-4" />
                            Foods to Eat
                          </h4>
                          <div className="grid gap-2">
                            {healthProblemRecs.foodsToEat.map((food, index) => (
                              <div key={index} className="p-3 border border-green-200 bg-green-50 rounded-lg">
                                <h5 className="font-medium text-sm">{food.name}</h5>
                                <p className="text-xs text-muted-foreground mt-1">{food.reason}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {healthProblemRecs.foodsToAvoid.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Foods to Avoid
                          </h4>
                          <div className="grid gap-2">
                            {healthProblemRecs.foodsToAvoid.map((food, index) => (
                              <div key={index} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                                <h5 className="font-medium text-sm">{food.name}</h5>
                                <p className="text-xs text-muted-foreground mt-1">{food.reason}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recipe Generator */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-primary" />
                  Recipe Generator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Enter ingredients you have (comma-separated):
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., rice, dal, onion, tomato, paneer"
                        value={ingredientsInput}
                        onChange={(e) => setIngredientsInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && generateRecipes()}
                      />
                      <Button onClick={generateRecipes} variant="soft">
                        Generate
                      </Button>
                    </div>
                  </div>

                  {generatedRecipes.length > 0 && (
                    <div className="space-y-3 mt-4">
                      <h4 className="font-medium">Suggested Recipes:</h4>
                      {generatedRecipes.map((recipe, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-muted/30">
                          <h5 className="font-semibold text-primary mb-2">{recipe.name}</h5>
                          <p className="text-sm mb-2">{recipe.instructions}</p>
                          <Badge variant="secondary">{recipe.calories} cal</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cycle-Based Food Recommendations */}
            {cyclePhase && (
              <Card className="bg-gradient-card shadow-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Apple className="h-5 w-5 text-primary" />
                    Food Recommendations for {cyclePhase.charAt(0).toUpperCase() + cyclePhase.slice(1)} Phase
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cycleFoodRecs.foodsToEat.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Foods to Eat
                        </h4>
                        <div className="grid gap-2">
                          {cycleFoodRecs.foodsToEat.map((food, index) => (
                            <div key={index} className="p-3 border border-green-200 bg-green-50 rounded-lg">
                              <h5 className="font-medium text-sm">{food.name}</h5>
                              <p className="text-xs text-muted-foreground mt-1">{food.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {cycleFoodRecs.foodsToAvoid.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Foods to Avoid
                        </h4>
                        <div className="grid gap-2">
                          {cycleFoodRecs.foodsToAvoid.map((food, index) => (
                            <div key={index} className="p-3 border border-red-200 bg-red-50 rounded-lg">
                              <h5 className="font-medium text-sm">{food.name}</h5>
                              <p className="text-xs text-muted-foreground mt-1">{food.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Goals */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Today's Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Water Intake</span>
                    <span>{Math.round(getWaterPercentage())}%</span>
                  </div>
                  <Progress value={getWaterPercentage()} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Meals Logged</span>
                    <span>{nutritionData.meals.length}/3</span>
                  </div>
                  <Progress value={(nutritionData.meals.length / 3) * 100} className="h-2" />
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    variant="hero" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setShowMealPlan(true)}
                  >
                    View Detailed Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Daily Tips */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coffee className="h-5 w-5 text-primary" />
                  Daily Wellness Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {nutritionData.dailyTips.map((tip, index) => (
                    <div key={index} className="p-3 bg-primary-soft/20 rounded-lg">
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-hero text-white shadow-gentle">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Personalized Meal Plan</h3>
                <p className="text-sm opacity-90 mb-4">
                  Get a custom meal plan based on your health goals and cycle phase
                </p>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setShowMealPlan(true)}
                >
                  Create My Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Meal Plan Dialog */}
      <MealPlanDialog 
        open={showMealPlan} 
        onOpenChange={setShowMealPlan}
        cyclePhase={cyclePhase}
      />
    </div>
  );
};

export default NutritionModule;