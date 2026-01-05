import { useGetAllPosts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import PostCard from '../components/PostCard';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function FeedPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: posts = [], isLoading } = useGetAllPosts();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  if (!identity) return null;

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Your Feed</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <img
            src="/assets/generated/empty-posts.dim_400x300.png"
            alt="No posts"
            className="mx-auto mb-6 rounded-lg opacity-50"
          />
          <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
          <p className="text-muted-foreground">Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={Number(post.id)} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
