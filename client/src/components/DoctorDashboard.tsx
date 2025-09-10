import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Settings, Video, MessageCircle, Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface DoctorDashboardProps {
  onNavigate: (screen: string) => void;
}

export default function DoctorDashboard({ onNavigate }: DoctorDashboardProps) {
  const { userProfile } = useAuth();

  const todayAppointments = [
    {
      id: 1,
      patient: 'Jessica Martinez',
      type: 'Consultation',
      time: '2:30 PM',
      duration: 30,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      patient: 'Robert Chen',
      type: 'Follow-up',
      time: '3:00 PM',
      duration: 30,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const telemedicineRequests = [
    {
      id: 1,
      patient: 'Robert Chen',
      reason: 'Follow-up consultation',
      time: 'Requested 15 min ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      patient: 'Sarah Johnson',
      reason: 'General checkup',
      time: 'Requested 1 hour ago',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const medicalNews = [
    {
      id: 1,
      title: 'New Guidelines for Diabetes Management',
      summary: 'Updated recommendations from the American Diabetes Association...',
      date: '3 hours ago',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=200&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-secondary to-accent p-6 pb-8" data-testid="doctor-header">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Dr. Dashboard</h1>
            <p className="text-white/80" data-testid="doctor-name">{userProfile?.name || 'Dr. Smith'}</p>
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
              data-testid="button-settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Doctor Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white/10 backdrop-blur-md border-white/20" data-testid="stat-today">
            <CardContent className="p-3 text-center">
              <div className="text-white font-bold text-lg">8</div>
              <div className="text-white/80 text-xs">Today</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20" data-testid="stat-pending">
            <CardContent className="p-3 text-center">
              <div className="text-white font-bold text-lg">3</div>
              <div className="text-white/80 text-xs">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20" data-testid="stat-rating">
            <CardContent className="p-3 text-center">
              <div className="text-white font-bold text-lg">4.9</div>
              <div className="text-white/80 text-xs">Rating</div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="p-6 space-y-6 pb-20">
        {/* Today's Schedule */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Today's Schedule</h2>
            <Button variant="ghost" size="sm" className="text-primary" data-testid="button-manage-schedule">
              Manage
            </Button>
          </div>
          
          {todayAppointments.map((appointment) => (
            <Card key={appointment.id} className="mb-3" data-testid={`schedule-${appointment.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={appointment.avatar}
                      alt={appointment.patient}
                      className="w-10 h-10 rounded-full object-cover"
                      data-testid={`patient-avatar-${appointment.id}`}
                    />
                    <div>
                      <div className="font-medium text-sm" data-testid={`patient-name-${appointment.id}`}>
                        {appointment.patient}
                      </div>
                      <div className="text-muted-foreground text-xs" data-testid={`appointment-type-${appointment.id}`}>
                        {appointment.type}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium" data-testid={`appointment-time-${appointment.id}`}>
                      {appointment.time}
                    </div>
                    <div className="text-xs text-muted-foreground">{appointment.duration} min</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => onNavigate('telemedicine')}
                    data-testid={`start-call-${appointment.id}`}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Start Call
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    data-testid={`chat-${appointment.id}`}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        
        {/* Telemedicine Requests */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Telemedicine Requests</h2>
            <span className="bg-accent/20 text-accent px-2 py-1 rounded-full text-xs font-medium">
              3 New
            </span>
          </div>
          
          {telemedicineRequests.map((request) => (
            <Card key={request.id} className="mb-3" data-testid={`request-${request.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={request.avatar}
                      alt={request.patient}
                      className="w-10 h-10 rounded-full object-cover"
                      data-testid={`request-avatar-${request.id}`}
                    />
                    <div>
                      <div className="font-medium text-sm" data-testid={`request-patient-${request.id}`}>
                        {request.patient}
                      </div>
                      <div className="text-muted-foreground text-xs" data-testid={`request-reason-${request.id}`}>
                        {request.reason}
                      </div>
                      <div className="text-muted-foreground text-xs" data-testid={`request-time-${request.id}`}>
                        {request.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 bg-primary/10 rounded-full text-primary hover:bg-primary/20"
                      data-testid={`accept-${request.id}`}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 bg-muted rounded-full text-muted-foreground hover:bg-muted/80"
                      data-testid={`decline-${request.id}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        
        {/* Medical News */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Latest Medical Updates</h2>
          
          {medicalNews.map((article) => (
            <Card key={article.id} className="mb-4" data-testid={`news-${article.id}`}>
              <CardContent className="p-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                  data-testid={`news-image-${article.id}`}
                />
                <h3 className="font-medium mb-2" data-testid={`news-title-${article.id}`}>
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-2" data-testid={`news-summary-${article.id}`}>
                  {article.summary}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground" data-testid={`news-date-${article.id}`}>
                    {article.date}
                  </span>
                  <Button variant="ghost" size="sm" className="text-primary" data-testid={`news-read-${article.id}`}>
                    Read more
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
      
      {/* Doctor Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-border">
        <div className="flex justify-around py-2">
          {[
            { id: 'dashboard', icon: 'fas fa-home', label: 'Dashboard' },
            { id: 'schedule', icon: 'fas fa-calendar', label: 'Schedule' },
            { id: 'consultations', icon: 'fas fa-video', label: 'Consultations' },
            { id: 'analytics', icon: 'fas fa-chart-bar', label: 'Analytics' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex flex-col items-center py-2 px-4 ${
                tab.id === 'dashboard' ? 'text-primary' : 'text-muted-foreground'
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
