import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AIChatAssistant = ({ open, onOpenChange }: AIChatAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your wellness assistant. I can help you with health questions, nutrition advice, yoga recommendations, and general wellness guidance. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Menstrual health queries
    if (lowerMessage.includes("period") || lowerMessage.includes("menstrual") || lowerMessage.includes("cramp")) {
      return "For menstrual discomfort, I recommend:\n\n1. **Pain Relief**: Try acupressure points (check the Cycle Tracker for visual guides)\n2. **Nutrition**: Eat iron-rich foods like spinach, lentils, and dates. Avoid caffeine and excess salt.\n3. **Hydration**: Drink warm herbal teas like ginger or chamomile\n4. **Exercise**: Gentle yoga poses like Child's Pose and Cat-Cow can help\n5. **Rest**: Ensure 7-8 hours of sleep\n\nIf pain is severe or unusual, please consult a healthcare provider.";
    }
    
    // PCOS/PCOD queries
    if (lowerMessage.includes("pcos") || lowerMessage.includes("pcod")) {
      return "For PCOS/PCOD management:\n\n1. **Diet**: Focus on low-GI foods, whole grains, lean proteins, and plenty of vegetables\n2. **Exercise**: 30 minutes of moderate activity daily helps regulate hormones\n3. **Weight Management**: Even 5-10% weight loss can improve symptoms\n4. **Supplements**: Consider inositol, omega-3, and vitamin D (consult your doctor)\n5. **Stress**: Practice mindfulness and yoga regularly\n\nCheck the Nutrition Guide for PCOS-friendly meal ideas!";
    }
    
    // Yoga queries
    if (lowerMessage.includes("yoga") || lowerMessage.includes("exercise") || lowerMessage.includes("workout")) {
      return "Great question about yoga! Here are my recommendations:\n\n1. **For Beginners**: Start with gentle poses like Mountain Pose and Child's Pose\n2. **For Period Pain**: Try Cat-Cow, Reclining Bound Angle, and Legs-Up-the-Wall\n3. **For Stress**: Practice deep breathing with Warrior poses and Savasana\n4. **For PCOS**: Sun Salutations and Butterfly Pose can help\n\nVisit our Yoga Module for pose detection and personalized routines!";
    }
    
    // Nutrition queries
    if (lowerMessage.includes("food") || lowerMessage.includes("eat") || lowerMessage.includes("diet") || lowerMessage.includes("nutrition")) {
      return "Here's nutrition guidance:\n\n1. **Daily Essentials**: 8 glasses of water, 5 servings of fruits/vegetables\n2. **Iron-Rich Foods**: Spinach, lentils, chickpeas, dates, raisins\n3. **Calcium Sources**: Milk, yogurt, sesame seeds, almonds\n4. **Protein**: Dal, paneer, eggs, nuts, tofu\n5. **Healthy Fats**: Ghee, nuts, seeds, avocado\n\nCheck the Nutrition Guide for cycle-specific meal recommendations!";
    }
    
    // Stress/mental health queries
    if (lowerMessage.includes("stress") || lowerMessage.includes("anxiety") || lowerMessage.includes("sleep") || lowerMessage.includes("tired")) {
      return "For stress management and better wellness:\n\n1. **Breathing**: Practice 4-7-8 breathing (inhale 4s, hold 7s, exhale 8s)\n2. **Sleep Hygiene**: Maintain consistent sleep schedule, avoid screens 1 hour before bed\n3. **Meditation**: Try 10 minutes daily of guided meditation\n4. **Physical Activity**: Even a 15-minute walk can boost mood\n5. **Journaling**: Write down thoughts to process emotions\n\nVisit our Stress Management section for guided exercises!";
    }
    
    // Pregnancy queries
    if (lowerMessage.includes("pregnan") || lowerMessage.includes("expecting") || lowerMessage.includes("baby")) {
      return "For pregnancy wellness:\n\n1. **Nutrition**: Focus on folic acid, iron, calcium, and protein\n2. **Safe Exercises**: Prenatal yoga, walking, swimming (consult your doctor)\n3. **Hydration**: Drink 10-12 glasses of water daily\n4. **Rest**: Listen to your body and rest when needed\n5. **Regular Checkups**: Don't miss prenatal appointments\n\n**Important**: Always consult your healthcare provider for personalized pregnancy guidance.";
    }
    
    // Thyroid queries
    if (lowerMessage.includes("thyroid")) {
      return "For thyroid health:\n\n1. **Iodine**: Include iodized salt, sea vegetables (consult doctor first)\n2. **Selenium**: Brazil nuts, fish, eggs\n3. **Avoid**: Excessive raw cruciferous vegetables if hypothyroid\n4. **Regular Testing**: Monitor thyroid levels as prescribed\n5. **Medication**: Take thyroid medication consistently\n\nWork closely with your endocrinologist for optimal management.";
    }
    
    // Anemia queries
    if (lowerMessage.includes("anemia") || lowerMessage.includes("anemic") || lowerMessage.includes("iron deficien")) {
      return "For anemia management:\n\n1. **Iron-Rich Foods**: Spinach, lentils, chickpeas, dates, raisins, jaggery\n2. **Vitamin C**: Eat citrus fruits with iron-rich meals for better absorption\n3. **Avoid**: Tea/coffee with meals (reduces iron absorption)\n4. **Iron Supplements**: Take as prescribed by your doctor\n5. **Cooking**: Use iron cookware to increase iron in food\n\nGet regular blood tests to monitor hemoglobin levels.";
    }
    
    // General queries
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! I'm here to help with your health and wellness questions. You can ask me about:\n\n• Menstrual health and period pain\n• PCOS/PCOD management\n• Yoga and exercise recommendations\n• Nutrition and meal planning\n• Stress management\n• Pregnancy wellness\n• Thyroid and anemia care\n\nWhat would you like to know?";
    }
    
    // Default response
    return "I understand you're asking about your health. While I can provide general wellness guidance, I recommend:\n\n1. Use our **Symptom Checker** for specific health concerns\n2. Visit the **Cycle Tracker** for menstrual health\n3. Check the **Nutrition Guide** for meal recommendations\n4. Try our **Yoga Module** for exercise guidance\n\nFor medical concerns, please consult a healthcare provider. Is there a specific wellness topic I can help you with?";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(userMessage.content),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Wellness Assistant
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about menstrual health, nutrition, yoga, stress management..."
              className="min-h-[60px] resize-none"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIChatAssistant;
