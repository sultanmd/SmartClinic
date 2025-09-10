import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Video, Phone, MessageCircle, Settings, X } from 'lucide-react';
import { useWebSocket } from '@/hooks/use-websocket';

interface TelemedicineInterfaceProps {
  onEndCall: () => void;
}

export default function TelemedicineInterface({ onEndCall }: TelemedicineInterfaceProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [message, setMessage] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'Dr. Chen',
      message: 'Hello! How are you feeling today?',
      time: '2:30 PM',
      isDoctor: true
    },
    {
      id: 2,
      sender: 'You',
      message: "I've been having some chest discomfort lately.",
      time: '2:31 PM',
      isDoctor: false
    }
  ]);

  const { sendMessage: sendWebSocketMessage } = useWebSocket({
    onMessage: (data) => {
      if (data.type === 'chat_message') {
        setChatMessages(prev => [...prev, data.message]);
      }
    }
  });

  // Timer for call duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: 'You',
        message: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDoctor: false
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      sendWebSocketMessage({
        type: 'chat_message',
        message: newMessage
      });
      setMessage('');
    }
  };

  return (
    <div className="relative h-screen bg-gray-900" data-testid="telemedicine-interface">
      {/* Doctor's Video Feed */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop"
          alt="Doctor video call"
          className="w-full h-full object-cover"
          data-testid="doctor-video"
        />
      </div>
      
      {/* Patient's Video (Picture-in-Picture) */}
      <div className="absolute top-6 right-6 w-24 h-32 bg-gray-800 rounded-lg overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1494790108755-2616b612b977?w=100&h=100&fit=crop&crop=face"
          alt="Patient video"
          className="w-full h-full object-cover"
          data-testid="patient-video"
        />
      </div>
      
      {/* Call Info Header */}
      <div className="absolute top-6 left-6 right-32">
        <Card className="bg-black/50 backdrop-blur-sm border-white/20" data-testid="call-info">
          <CardContent className="p-3">
            <div className="text-white font-medium" data-testid="doctor-name">Dr. Emily Chen</div>
            <div className="text-white/80 text-sm" data-testid="consultation-type">Cardiology Consultation</div>
            <div className="text-white/60 text-xs" data-testid="call-duration">
              {formatDuration(callDuration)} elapsed
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Call Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2" data-testid="call-controls">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className={`w-12 h-12 backdrop-blur-sm rounded-full ${
              isMuted ? 'bg-red-500/80 text-white' : 'bg-white/20 text-white'
            }`}
            onClick={() => setIsMuted(!isMuted)}
            data-testid="button-mute"
          >
            <Mic className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`w-12 h-12 backdrop-blur-sm rounded-full ${
              isVideoOff ? 'bg-red-500/80 text-white' : 'bg-white/20 text-white'
            }`}
            onClick={() => setIsVideoOff(!isVideoOff)}
            data-testid="button-video"
          >
            <Video className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 bg-red-500 rounded-full text-white hover:bg-red-600"
            onClick={onEndCall}
            data-testid="button-end-call"
          >
            <Phone className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full text-white"
            onClick={() => setIsChatOpen(!isChatOpen)}
            data-testid="button-chat"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full text-white"
            data-testid="button-settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Chat Panel */}
      <div 
        className={`absolute right-0 top-0 h-full w-80 bg-white border-l border-border transform transition-transform duration-300 ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        data-testid="chat-panel"
      >
        <div className="p-4 border-b border-border">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Session Chat</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsChatOpen(false)}
              data-testid="button-close-chat"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 p-4 space-y-4 overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`${
                msg.isDoctor ? 'bg-muted' : 'bg-primary text-primary-foreground ml-8'
              } rounded-lg p-3`}
              data-testid={`chat-message-${msg.id}`}
            >
              <div className="text-sm">{msg.message}</div>
              <div className={`text-xs mt-1 ${msg.isDoctor ? 'text-muted-foreground' : 'opacity-80'}`}>
                {msg.sender} - {msg.time}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
              data-testid="input-chat-message"
            />
            <Button onClick={handleSendMessage} data-testid="button-send-message">
              <i className="fas fa-paper-plane" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
