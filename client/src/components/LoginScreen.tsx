import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, User, UserRound, Building2 } from 'lucide-react';
import { signIn, signUp, createUserProfile } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface LoginScreenProps {
  onLogin: (role: 'patient' | 'doctor' | 'clinic') => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'clinic'>('patient');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await signUp(email, password);
        await createUserProfile(userCredential.user.uid, {
          email,
          name,
          role: selectedRole,
        });
        toast({
          title: "Account created successfully",
          description: "Welcome to ClinicCare!",
        });
      } else {
        await signIn(email, password);
        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
      }
      onLogin(selectedRole);
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'patient' as const, label: 'Patient', icon: User },
    { id: 'doctor' as const, label: 'Doctor', icon: UserRound },
    { id: 'clinic' as const, label: 'Clinic', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent flex flex-col justify-center p-6">
      <div className="text-center mb-8" data-testid="app-header">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Heart className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">ClinicCare</h1>
        <p className="text-white/80">Modern Healthcare Management</p>
      </div>
      
      <Card className="bg-white rounded-2xl shadow-xl" data-testid="login-card">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          
          {/* Role Selection */}
          <div className="flex mb-6 bg-muted rounded-xl p-1" data-testid="role-selector">
            {roles.map((role) => {
              const IconComponent = role.icon;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    selectedRole === role.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid={`role-${role.id}`}
                >
                  <IconComponent className="w-4 h-4 mr-2 inline" />
                  {role.label}
                </button>
              );
            })}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <Input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-testid="input-name"
              />
            )}
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="input-email"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="input-password"
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
              data-testid="button-submit"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
          </form>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary text-sm hover:underline"
              data-testid="toggle-signup"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
