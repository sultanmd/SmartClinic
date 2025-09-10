import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, User, Calendar, Video, UserRound, Bot } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface PatientDashboardProps {
  onNavigate: (screen: string) => void;
}

export default function PatientDashboard({ onNavigate }: PatientDashboardProps) {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const quickActions = [
    { icon: Calendar, label: 'Book Appointment', color: 'bg-primary/10 text-primary', action: 'book-appointment' },
    { icon: Video, label: 'Telemedicine', color: 'bg-secondary/10 text-secondary', action: 'telemedicine' },
    { icon: UserRound, label: 'Find Doctors', color: 'bg-accent/10 text-accent', action: 'find-doctors' },
    { icon: Bot, label: 'AI Assistant', color: 'bg-primary/10 text-primary', action: 'ai-assistant' },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Emily Chen',
      specialty: 'Cardiologist',
      time: 'Today, 2:30 PM',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Roberts',
      specialty: 'General Physician',
      time: 'Tomorrow, 10:00 AM',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const newsItems = [
    {
      id: 1,
      title: 'Latest Breakthrough in Heart Disease Treatment',
      excerpt: 'Researchers have discovered a new minimally invasive procedure...',
      date: '2 hours ago',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'New Guidelines for Diabetes Management',
      excerpt: 'Updated recommendations from the American Diabetes Association...',
      date: '5 hours ago',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-secondary to-accent p-6 pb-8" data-testid="patient-header">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Good Morning</h1>
            <p className="text-white/80" data-testid="user-name">{userProfile?.name || 'Patient'}</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-white/20 rounded-full text-white hover:bg-white/30"
              data-testid="button-notifications"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-white/20 rounded-full text-white hover:bg-white/30"
              data-testid="button-profile"
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20" data-testid="stat-appointment">
            <CardContent className="p-4">
              <div className="text-white/80 text-sm">Next Appointment</div>
              <div className="text-white font-semibold">Today, 2:30 PM</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20" data-testid="stat-health">
            <CardContent className="p-4">
              <div className="text-white/80 text-sm">Health Score</div>
              <div className="text-white font-semibold">85/100</div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-6 space-y-6 pb-20">
        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.action}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-3 hover:shadow-md transition-shadow"
                  onClick={() => onNavigate(action.action)}
                  data-testid={`action-${action.action}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-medium">{action.label}</div>
                </Button>
              );
            })}
          </div>
        </section>
        
        {/* Upcoming Appointments */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
            <Button variant="ghost" size="sm" className="text-primary" data-testid="link-view-appointments">
              View all
            </Button>
          </div>
          
          {upcomingAppointments.map((appointment) => (
            <Card key={appointment.id} className="mb-3" data-testid={`appointment-${appointment.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={appointment.avatar}
                    alt={appointment.doctor}
                    className="w-12 h-12 rounded-full object-cover"
                    data-testid={`avatar-${appointment.id}`}
                  />
                  <div className="flex-1">
                    <div className="font-medium" data-testid={`doctor-name-${appointment.id}`}>
                      {appointment.doctor}
                    </div>
                    <div className="text-muted-foreground text-sm" data-testid={`specialty-${appointment.id}`}>
                      {appointment.specialty}
                    </div>
                    <div className="text-muted-foreground text-sm" data-testid={`time-${appointment.id}`}>
                      {appointment.time}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 bg-primary/10 rounded-full"
                      onClick={() => onNavigate('telemedicine')}
                      data-testid={`video-${appointment.id}`}
                    >
                      <Video className="w-4 h-4 text-primary" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 bg-secondary/10 rounded-full"
                      data-testid={`chat-${appointment.id}`}
                    >
                      <Bot className="w-4 h-4 text-secondary" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        
        {/* Medical News Feed */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Health & Medical News</h2>
          
          {newsItems.map((item) => (
            <Card key={item.id} className="mb-4" data-testid={`news-${item.id}`}>
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover"
                    data-testid={`news-image-${item.id}`}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1" data-testid={`news-title-${item.id}`}>
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-xs mb-2" data-testid={`news-excerpt-${item.id}`}>
                      {item.excerpt}
                    </p>
                    <div className="text-xs text-muted-foreground" data-testid={`news-date-${item.id}`}>
                      {item.date}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-border">
        <div className="flex justify-around py-2">
          {[
            { id: 'home', icon: 'fas fa-home', label: 'Home' },
            { id: 'appointments', icon: 'fas fa-calendar', label: 'Appointments' },
            { id: 'telemedicine', icon: 'fas fa-video', label: 'Telemedicine' },
            { id: 'profile', icon: 'fas fa-user', label: 'Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-4 ${
                activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
              }`}
              data-testid={`nav-${tab.id}`}
            >
              <i className={`${tab.icon} mb-1`} />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
