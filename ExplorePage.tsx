import { useGetTrendingPosts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import PostCard from '../components/PostCard';
import { Loader2, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

export default function ExplorePage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: posts = [], isLoading } = useGetTrendingPosts();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  if (!identity) return null;

  return (
    <div className="container max-w-2xl py-8">
      <div className="flex items-center gap-2 mb-8">
        <TrendingUp className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Explore Trending</h1>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <img
            src="/assets/generated/empty-posts.dim_400x300.png"
            alt="No trending posts"
            className="mx-auto mb-6 rounded-lg opacity-50"
          />
          <h2 className="text-xl font-semibold mb-2">No trending posts yet</h2>
          <p className="text-muted-foreground">Check back later for popular content!</p>
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
