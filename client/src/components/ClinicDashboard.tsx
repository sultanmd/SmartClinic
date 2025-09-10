import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Settings, UserPlus, Calendar, TrendingUp, Cog, Edit, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface ClinicDashboardProps {
  onNavigate: (screen: string) => void;
}

export default function ClinicDashboard({ onNavigate }: ClinicDashboardProps) {
  const { userProfile } = useAuth();

  const quickActions = [
    { icon: UserPlus, label: 'Add Doctor', color: 'bg-primary/10 text-primary', action: 'add-doctor' },
    { icon: Calendar, label: 'Manage Schedule', color: 'bg-secondary/10 text-secondary', action: 'manage-schedule' },
    { icon: TrendingUp, label: 'Analytics', color: 'bg-accent/10 text-accent', action: 'analytics' },
    { icon: Cog, label: 'Settings', color: 'bg-primary/10 text-primary', action: 'settings' },
  ];

  const clinicDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Williams',
      specialty: 'Pediatrician',
      todayAppointments: 8,
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Dr. Michael Roberts',
      specialty: 'Cardiologist',
      todayAppointments: 12,
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Dr. Emily Chen',
      specialty: 'Dermatologist',
      todayAppointments: 6,
      rating: 4.7,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      description: 'New appointment booked with Dr. Chen',
      time: '5 minutes ago',
      icon: 'fas fa-calendar-check'
    },
    {
      id: 2,
      description: 'Dr. Williams completed a consultation',
      time: '15 minutes ago',
      icon: 'fas fa-check-circle'
    },
    {
      id: 3,
      description: 'Patient feedback received for Dr. Roberts',
      time: '1 hour ago',
      icon: 'fas fa-star'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-secondary to-accent p-6 pb-8" data-testid="clinic-header">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Clinic Management</h1>
            <p className="text-white/80" data-testid="clinic-name">{userProfile?.name || 'MedCenter Plus'}</p>
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
        
        {/* Clinic Analytics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20" data-testid="stat-appointments">
            <CardContent className="p-4">
              <div className="text-white/80 text-sm">Today's Appointments</div>
              <div className="text-white font-bold text-xl">127</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20" data-testid="stat-doctors">
            <CardContent className="p-4">
              <div className="text-white/80 text-sm">Active Doctors</div>
              <div className="text-white font-bold text-xl">15</div>
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
        
        {/* Doctor Management */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Our Doctors</h2>
            <Button variant="ghost" size="sm" className="text-primary" data-testid="button-view-all-doctors">
              View all
            </Button>
          </div>
          
          {clinicDoctors.map((doctor) => (
            <Card key={doctor.id} className="mb-3" data-testid={`doctor-${doctor.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full object-cover"
                    data-testid={`doctor-avatar-${doctor.id}`}
                  />
                  <div className="flex-1">
                    <div className="font-medium" data-testid={`doctor-name-${doctor.id}`}>
                      {doctor.name}
                    </div>
                    <div className="text-muted-foreground text-sm" data-testid={`doctor-specialty-${doctor.id}`}>
                      {doctor.specialty}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1 inline" />
                        <span data-testid={`doctor-appointments-${doctor.id}`}>{doctor.todayAppointments}</span> today
                      </span>
                      <span className="text-xs text-muted-foreground">
                        <i className="fas fa-star mr-1 text-accent" />
                        <span data-testid={`doctor-rating-${doctor.id}`}>{doctor.rating}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 bg-primary/10 rounded-full text-primary hover:bg-primary/20"
                      data-testid={`edit-doctor-${doctor.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 bg-secondary/10 rounded-full text-secondary hover:bg-secondary/20"
                      data-testid={`view-doctor-${doctor.id}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        
        {/* Recent Activity */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          
          {recentActivities.map((activity) => (
            <Card key={activity.id} className="mb-3" data-testid={`activity-${activity.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <i className={`${activity.icon} text-accent text-sm`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium" data-testid={`activity-description-${activity.id}`}>
                      {activity.description}
                    </div>
                    <div className="text-xs text-muted-foreground" data-testid={`activity-time-${activity.id}`}>
                      {activity.time}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
      
      {/* Clinic Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-border">
        <div className="flex justify-around py-2">
          {[
            { id: 'dashboard', icon: 'fas fa-home', label: 'Dashboard' },
            { id: 'doctors', icon: 'fas fa-users', label: 'Doctors' },
            { id: 'schedule', icon: 'fas fa-calendar', label: 'Schedule' },
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
