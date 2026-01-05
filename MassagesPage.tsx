import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export default function MessagesPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  if (!identity) return null;

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>
      
      <div className="text-center py-12">
        <img
          src="/assets/generated/empty-messages.dim_400x300.png"
          alt="No messages"
          className="mx-auto mb-6 rounded-lg opacity-50"
        />
        <h2 className="text-xl font-semibold mb-2">No messages yet</h2>
        <p className="text-muted-foreground">
          Start a conversation with someone to see your messages here.
        </p>
      </div>
    </div>
  );
}
