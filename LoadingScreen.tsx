import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <img src="/assets/generated/logo.dim_200x200.png" alt="Logo" className="h-20 w-20 rounded-full animate-pulse" />
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading Siddhiworld...</p>
      </div>
    </div>
  );
}
