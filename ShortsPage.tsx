import { useState, useRef, useEffect } from 'react';
import { useGetShortVideos } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useLikePost, useCommentOnPost } from '../hooks/useQueries';
import { Heart, MessageCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ShortsPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: videos = [], isLoading } = useGetShortVideos();
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const likePost = useLikePost();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  if (!identity) return null;

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleLike = async () => {
    if (videos[currentIndex]) {
      try {
        await likePost.mutateAsync(videos[currentIndex].id);
      } catch (error) {
        toast.error('Failed to like video');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="container max-w-2xl py-8 text-center">
        <h2 className="text-xl font-semibold mb-2">No short videos yet</h2>
        <p className="text-muted-foreground">Be the first to upload a short video!</p>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];

  return (
    <div className="relative h-[calc(100vh-8rem)] bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={currentVideo.media.getDirectURL()}
        className="max-h-full max-w-full"
        loop
        playsInline
        controls={false}
        onClick={() => {
          if (videoRef.current) {
            if (videoRef.current.paused) {
              videoRef.current.play();
            } else {
              videoRef.current.pause();
            }
          }
        }}
      />

      {/* Video Info Overlay */}
      <div className="absolute bottom-20 left-4 right-20 text-white">
        <p className="text-sm font-semibold mb-1">
          @{currentVideo.author.toString().slice(0, 8)}...
        </p>
        {currentVideo.caption && (
          <p className="text-sm">{currentVideo.caption}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-20 right-4 flex flex-col gap-4">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full bg-black/50 text-white hover:bg-black/70 h-12 w-12"
          onClick={handleLike}
          disabled={likePost.isPending}
        >
          <div className="flex flex-col items-center">
            <Heart className="h-6 w-6" />
            <span className="text-xs">{Number(currentVideo.likeCount)}</span>
          </div>
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full bg-black/50 text-white hover:bg-black/70 h-12 w-12"
        >
          <div className="flex flex-col items-center">
            <MessageCircle className="h-6 w-6" />
            <span className="text-xs">{Number(currentVideo.commentCount)}</span>
          </div>
        </Button>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={handleNext}
          disabled={currentIndex === videos.length - 1}
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>

      {/* Video Counter */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {videos.length}
      </div>
    </div>
  );
}
