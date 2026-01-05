import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { ArrowRight, Image, Video, MessageCircle, TrendingUp } from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();

  const isAuthenticated = !!identity;

  const handleGetStarted = async () => {
    if (isAuthenticated) {
      navigate({ to: '/feed' });
    } else {
      try {
        await login();
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  };

  const features = [
    { icon: Image, title: 'Share Photos', description: 'Upload and share your favorite moments' },
    { icon: Video, title: 'Short Videos', description: 'Create and watch engaging short clips' },
    { icon: MessageCircle, title: 'Connect', description: 'Chat with friends and followers' },
    { icon: TrendingUp, title: 'Discover', description: 'Explore trending content' },
  ];

  return (
    <div className="container max-w-6xl py-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-16">
        <div className="flex justify-center mb-6">
          <img
            src="/assets/generated/welcome-hero.dim_800x600.png"
            alt="Welcome"
            className="rounded-2xl shadow-2xl max-w-2xl w-full"
          />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Welcome To Siddhiworld
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Share your moments, discover amazing content, and connect with people around the world.
        </p>
        <Button
          size="lg"
          onClick={handleGetStarted}
          disabled={loginStatus === 'logging-in'}
          className="gap-2 text-lg px-8 py-6"
        >
          {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Go to Feed' : 'Get Started'}
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
          >
            <feature.icon className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
