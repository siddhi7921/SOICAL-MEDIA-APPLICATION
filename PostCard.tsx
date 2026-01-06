import { useState } from 'react';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useLikePost,
  useCommentOnPost,
  useGetPostComments,
  useDeletePost,
} from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { Post } from '../backend';
import { toast } from 'sonner';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const { identity } = useInternetIdentity();

  const likePost = useLikePost();
  const commentOnPost = useCommentOnPost();
  const deletePost = useDeletePost();

  const { data: comments = [] } = useGetPostComments(
    showComments ? post.id : null
  );

  const isAuthor =
    identity?.getPrincipal().toString() === post.author.toString();

  const mediaUrl = post.media.getDirectURL();

  // ---------------- Handlers ----------------

  const handleLike = async () => {
    try {
      await likePost.mutateAsync(post.id);
    } catch {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await commentOnPost.mutateAsync({
        postId: post.id,
        content: commentText.trim(),
      });
      setCommentText('');
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post?'
    );
    if (!confirmed) return;

    try {
      await deletePost.mutateAsync(post.id);
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  const handleCloseComments = () => {
    setShowComments(false);
    setCommentText('');
  };

  // ---------------- UI ----------------

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {post.isVideo ? (
            <video
              src={mediaUrl}
              controls
              muted
              playsInline
              preload="metadata"
              className="w-full aspect-square object-cover"
            />
          ) : (
            <img
              src={mediaUrl}
              alt={post.caption || 'Post image'}
              className="w-full aspect-square object-cover"
            />
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 p-4">
          {/* Actions */}
          <div className="flex justify-between w-full">
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={likePost.isPending}
                className="gap-2"
              >
                <Heart className="h-5 w-5" />
                {Number(post.likeCount)}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(true)}
                className="gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                {Number(post.commentCount)}
              </Button>
            </div>

            {isAuthor && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deletePost.isPending}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>

          {/* Caption */}
          {post.caption && (
            <p className="text-sm">
              <span className="font-semibold">
                @{post.author.toString().slice(0, 8)}…
              </span>{' '}
              {post.caption}
            </p>
          )}
        </CardFooter>
      </Card>

      {/* ---------------- Comments Dialog ---------------- */}

      <Dialog open={showComments} onOpenChange={handleCloseComments}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[400px] pr-4">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">
                No comments yet. Be the first!
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={Number(comment.id)} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/assets/generated/default-avatar.dim_150x150.png" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="text-sm">
                        <span className="font-semibold">
                          @{comment.author.toString().slice(0, 8)}…
                        </span>{' '}
                        {comment.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(
                          Number(comment.timestamp) / 1_000_000
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleComment} className="flex gap-2 mt-4">
            <Input
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={commentOnPost.isPending}
            />
            <Button
              type="submit"
              disabled={commentOnPost.isPending || !commentText.trim()}
            >
              Post
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
