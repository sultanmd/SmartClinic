import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantProps {
  onBack: () => void;
}

interface Message {
  id: number;
  content: string;
  isAI: boolean;
  timestamp: string;
}

export default function AIAssistant({ onBack }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hi! I'm your AI health assistant. I can help answer questions about symptoms, medications, and general health information. How can I help you today?",
      isAI: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content: inputMessage.trim(),
      isAI: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call AI API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
          history: messages.slice(-5) // Send last 5 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        content: data.message,
        isAI: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: 'Book Appointment', action: 'book-appointment' },
    { label: 'Find Doctor', action: 'find-doctor' },
    { label: 'Emergency Info', action: 'emergency' },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="ai-assistant">
      {/* Header */}
      <Card className="border-b border-border rounded-none" data-testid="ai-header">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-muted rounded-full"
              onClick={onBack}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-semibold">AI Health Assistant</h1>
              <p className="text-muted-foreground text-sm">Ask me anything about your health</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Chat Messages */}
      <div className="flex-1 p-4 space-y-4 pb-20" data-testid="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${message.isAI ? '' : 'justify-end'}`}
            data-testid={`message-${message.id}`}
          >
            {message.isAI && (
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            
            <div className={`rounded-lg p-3 max-w-xs ${
              message.isAI 
                ? 'bg-muted' 
                : 'bg-primary text-primary-foreground'
            }`}>
              <div className="text-sm whitespace-pre-wrap" data-testid={`message-content-${message.id}`}>
                {message.content}
              </div>
              <div className={`text-xs mt-2 ${
                message.isAI ? 'text-muted-foreground' : 'opacity-80'
              }`}>
                {message.isAI ? 'AI Assistant' : 'You'} - {message.timestamp}
              </div>
            </div>
            
            {!message.isAI && (
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-secondary" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3" data-testid="loading-indicator">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-lg p-3 max-w-xs">
              <div className="text-sm">AI is thinking...</div>
            </div>
          </div>
        )}
        
        {/* Quick Action Buttons */}
        {messages.length === 1 && (
          <div className="space-y-2" data-testid="quick-actions">
            <div className="text-sm text-muted-foreground">Quick actions:</div>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.action}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  data-testid={`quick-action-${action.action}`}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Input */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-border p-4">
        <div className="flex space-x-3">
          <Input
            type="text"
            placeholder="Ask me anything about your health..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            disabled={isLoading}
            data-testid="input-message"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            data-testid="button-send"
          >
            <i className="fas fa-paper-plane" />
          </Button>
        </div>
      </div>
    </div>
  );
}
