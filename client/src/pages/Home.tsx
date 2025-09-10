import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import LoginScreen from '@/components/LoginScreen';
import PatientDashboard from '@/components/PatientDashboard';
import DoctorDashboard from '@/components/DoctorDashboard';
import ClinicDashboard from '@/components/ClinicDashboard';
import TelemedicineInterface from '@/components/TelemedicineInterface';
import AIAssistant from '@/components/AIAssistant';
import FloatingChatButton from '@/components/FloatingChatButton';

export default function Home() {
  const { isAuthenticated, userProfile, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setCurrentScreen('dashboard')} />;
  }

  const handleNavigation = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    setCurrentScreen('dashboard');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'telemedicine':
        return <TelemedicineInterface onEndCall={handleBack} />;
      case 'ai-assistant':
        return <AIAssistant onBack={handleBack} />;
      default:
        // Render dashboard based on user role
        if (userProfile?.role === 'doctor') {
          return <DoctorDashboard onNavigate={handleNavigation} />;
        } else if (userProfile?.role === 'clinic') {
          return <ClinicDashboard onNavigate={handleNavigation} />;
        } else {
          return <PatientDashboard onNavigate={handleNavigation} />;
        }
    }
  };

  return (
    <div className="app-container">
      {renderCurrentScreen()}
      
      {/* Show floating chat button only on dashboard screens */}
      {currentScreen === 'dashboard' && (
        <FloatingChatButton onClick={() => handleNavigation('ai-assistant')} />
      )}
    </div>
  );
}
