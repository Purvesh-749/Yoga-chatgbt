import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Coffee, 
  Sun, 
  Sunset, 
  Moon,
  Apple,
  Droplets,
  Activity,
  CheckCircle2
} from "lucide-react";

interface MealPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cyclePhase?: string;
}

const MealPlanDialog = ({ open, onOpenChange, cyclePhase }: MealPlanDialogProps) => {
  const getMealPlan = () => {
    const basePlan = {
      earlyMorning: {
        time: "6:00 AM - 7:00 AM",
        icon: <Sun className="h-4 w-4" />,
        items: [
          "Warm water with lemon and honey",
          "5-7 soaked almonds",
          "2-3 soaked dates (if not diabetic)"
        ],
        benefits: "Kickstarts metabolism, provides natural energy"
      },
      breakfast: {
        time: "8:00 AM - 9:00 AM",
        icon: <Coffee className="h-4 w-4" />,
        calories: "350-400 kcal"
      },
      midMorning: {
        time: "11:00 AM",
        icon: <Apple className="h-4 w-4" />,
        items: [
          "Seasonal fruit (banana, apple, or papaya)",
          "Green tea or herbal tea",
          "Handful of mixed nuts"
        ],
        calories: "150-200 kcal"
      },
      lunch: {
        time: "1:00 PM - 2:00 PM",
        icon: <Sunset className="h-4 w-4" />,
        calories: "450-500 kcal"
      },
      evening: {
        time: "4:00 PM - 5:00 PM",
        icon: <Activity className="h-4 w-4" />,
        items: [
          "Masala chai with jaggery (avoid if PCOS)",
          "Roasted makhana or chana",
          "Vegetable cutlet or dhokla"
        ],
        calories: "150-200 kcal"
      },
      dinner: {
        time: "7:30 PM - 8:30 PM",
        icon: <Moon className="h-4 w-4" />,
        calories: "350-400 kcal"
      },
      bedtime: {
        time: "10:00 PM",
        icon: <Droplets className="h-4 w-4" />,
        items: [
          "Warm milk with turmeric and cardamom",
          "OR herbal tea (chamomile/lavender)"
        ],
        benefits: "Promotes better sleep, reduces inflammation"
      }
    };

    // Customize based on cycle phase
    let breakfastItems, lunchItems, dinnerItems, focus;

    if (cyclePhase === "menstrual") {
      focus = "Iron-rich foods and anti-inflammatory options";
      breakfastItems = [
        "Poha with vegetables and peanuts",
        "Spinach paratha with curd",
        "Moong dal chilla with mint chutney"
      ];
      lunchItems = [
        "2 chapatis with palak paneer",
        "Brown rice with rajma curry",
        "1 bowl of curd",
        "Side salad with beetroot"
      ];
      dinnerItems = [
        "Khichdi with vegetables and ghee",
        "Methi paratha with raita",
        "Vegetable soup with whole wheat bread"
      ];
    } else if (cyclePhase === "follicular") {
      focus = "Protein-rich foods for energy and growth";
      breakfastItems = [
        "Vegetable upma with coconut chutney",
        "Besan chilla with paneer filling",
        "Oats idli with sambar"
      ];
      lunchItems = [
        "2 chapatis with chickpea curry",
        "Quinoa pulao with mixed vegetables",
        "Dal with jeera rice",
        "Side salad with sprouts"
      ];
      dinnerItems = [
        "Stuffed capsicum with paneer",
        "Moong dal khichdi",
        "Vegetable stir-fry with millet roti"
      ];
    } else if (cyclePhase === "ovulation") {
      focus = "Antioxidant-rich foods and healthy fats";
      breakfastItems = [
        "Masala dosa with sambar",
        "Whole wheat bread with avocado and egg",
        "Ragi porridge with nuts and seeds"
      ];
      lunchItems = [
        "2 multigrain chapatis with mixed dal",
        "Vegetable biryani with raita",
        "Paneer bhurji with salad",
        "Cucumber and tomato salad"
      ];
      dinnerItems = [
        "Grilled fish or tofu with vegetables",
        "Quinoa khichdi with seasonal vegetables",
        "Mixed vegetable curry with jowar roti"
      ];
    } else {
      focus = "Complex carbs and magnesium-rich foods";
      breakfastItems = [
        "Vegetable poha with roasted peanuts",
        "Idli sambar with coconut chutney",
        "Whole wheat toast with peanut butter"
      ];
      lunchItems = [
        "2 chapatis with dal tadka",
        "Brown rice with chole curry",
        "Seasonal vegetables",
        "Curd with cucumber"
      ];
      dinnerItems = [
        "Vegetable khichdi with ghee",
        "Palak paneer with multigrain roti",
        "Lentil soup with vegetables"
      ];
    }

    return { ...basePlan, breakfastItems, lunchItems, dinnerItems, focus };
  };

  const plan = getMealPlan();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl">Your Personalized Meal Plan</DialogTitle>
          {cyclePhase && (
            <Badge variant="secondary" className="w-fit mt-2">
              Optimized for {cyclePhase} phase
            </Badge>
          )}
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-100px)]">
          <div className="p-6 space-y-6">
            {/* Focus Area */}
            {plan.focus && (
              <Card className="bg-gradient-hero text-white">
                <CardContent className="p-4">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Today's Focus: {plan.focus}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Daily Targets */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Daily Nutritional Targets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">1800-2000</p>
                    <p className="text-xs text-muted-foreground">Calories</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">8-10</p>
                    <p className="text-xs text-muted-foreground">Glasses Water</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">50-60g</p>
                    <p className="text-xs text-muted-foreground">Protein</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">25-30g</p>
                    <p className="text-xs text-muted-foreground">Fiber</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Early Morning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {plan.earlyMorning.icon}
                  Early Morning
                  <Badge variant="outline" className="ml-auto">{plan.earlyMorning.time}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.earlyMorning.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-3 italic">
                  💡 {plan.earlyMorning.benefits}
                </p>
              </CardContent>
            </Card>

            {/* Breakfast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {plan.breakfast.icon}
                  Breakfast
                  <Badge variant="outline" className="ml-auto">{plan.breakfast.time}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium mb-3">Choose one option:</p>
                <div className="space-y-3">
                  {plan.breakfastItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Option {idx + 1}</p>
                      <p className="text-sm">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Approx. {plan.breakfast.calories}
                </p>
              </CardContent>
            </Card>

            {/* Mid-Morning Snack */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {plan.midMorning.icon}
                  Mid-Morning Snack
                  <Badge variant="outline" className="ml-auto">{plan.midMorning.time}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.midMorning.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  Approx. {plan.midMorning.calories}
                </p>
              </CardContent>
            </Card>

            {/* Lunch */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {plan.lunch.icon}
                  Lunch
                  <Badge variant="outline" className="ml-auto">{plan.lunch.time}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium mb-3">Complete meal combinations:</p>
                <div className="space-y-3">
                  {plan.lunchItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Option {idx + 1}</p>
                      <p className="text-sm">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Approx. {plan.lunch.calories}
                </p>
              </CardContent>
            </Card>

            {/* Evening Snack */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {plan.evening.icon}
                  Evening Snack
                  <Badge variant="outline" className="ml-auto">{plan.evening.time}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.evening.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  Approx. {plan.evening.calories}
                </p>
              </CardContent>
            </Card>

            {/* Dinner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {plan.dinner.icon}
                  Dinner
                  <Badge variant="outline" className="ml-auto">{plan.dinner.time}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium mb-3">Light, easily digestible options:</p>
                <div className="space-y-3">
                  {plan.dinnerItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Option {idx + 1}</p>
                      <p className="text-sm">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Approx. {plan.dinner.calories}
                </p>
              </CardContent>
            </Card>

            {/* Bedtime */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {plan.bedtime.icon}
                  Before Bed
                  <Badge variant="outline" className="ml-auto">{plan.bedtime.time}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.bedtime.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-3 italic">
                  💡 {plan.bedtime.benefits}
                </p>
              </CardContent>
            </Card>

            <Separator />

            {/* Important Notes */}
            <Card className="bg-primary-soft/20">
              <CardHeader>
                <CardTitle className="text-base">Important Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Adjust portion sizes based on your activity level and body needs</p>
                <p>• Stay hydrated - drink water between meals, not during meals</p>
                <p>• Avoid processed foods, excess sugar, and trans fats</p>
                <p>• Listen to your body and adjust timings if needed</p>
                <p>• This is a general guide - consult a nutritionist for personalized plans</p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MealPlanDialog;
