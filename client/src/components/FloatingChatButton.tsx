import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick: () => void;
}

export default function FloatingChatButton({ onClick }: FloatingChatButtonProps) {
  return (
    <Button
      size="icon"
      className="fixed bottom-20 right-6 w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none z-50"
      onClick={onClick}
      data-testid="floating-chat-button"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
}
