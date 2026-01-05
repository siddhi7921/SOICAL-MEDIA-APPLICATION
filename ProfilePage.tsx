import { useGetCallerUserProfile, useGetUserPosts, useSaveCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Edit, Grid } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: posts = [], isLoading: postsLoading } = useGetUserPosts(identity?.getPrincipal() || null);
  const saveProfile = useSaveCallerUserProfile();

  const [editOpen, setEditOpen] = useState(false);
  const [bio, setBio] = useState('');
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  useEffect(() => {
    if (userProfile) {
      setBio(userProfile.bio);
    }
  }, [userProfile]);

  if (!identity) return null;

  const handleSaveProfile = async () => {
    if (!userProfile) return;

    try {
      let profilePicture = userProfile.profilePicture;

      if (profilePicFile) {
        const arrayBuffer = await profilePicFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        profilePicture = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      await saveProfile.mutateAsync({
        ...userProfile,
        bio: bio.trim(),
        profilePicture,
      });

      toast.success('Profile updated successfully!');
      setEditOpen(false);
      setProfilePicFile(null);
      setUploadProgress(0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container max-w-2xl py-8 text-center">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const profilePicUrl = userProfile.profilePicture
    ? userProfile.profilePicture.getDirectURL()
    : '/assets/generated/default-avatar.dim_150x150.png';

  return (
    <div className="container max-w-4xl py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <Avatar className="h-32 w-32">
          <AvatarImage src={profilePicUrl} />
          <AvatarFallback>{userProfile.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold">{userProfile.username}</h1>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profilePic">Profile Picture</Label>
                    <Input
                      id="profilePic"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfilePicFile(e.target.files?.[0] || null)}
                      disabled={saveProfile.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      disabled={saveProfile.isPending}
                    />
                  </div>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saveProfile.isPending}
                    className="w-full"
                  >
                    {saveProfile.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex justify-center md:justify-start gap-8 mb-4">
            <div className="text-center">
              <p className="font-bold text-lg">{posts.length}</p>
              <p className="text-sm text-muted-foreground">Posts</p>
            </div>
          </div>
          
          {userProfile.bio && (
            <p className="text-muted-foreground">{userProfile.bio}</p>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="border-t pt-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Grid className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Posts</h2>
        </div>
        
        {postsLoading ? (
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
            <p className="text-muted-foreground">No posts yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {posts.map((post) => (
              <div key={Number(post.id)} className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg">
                {post.isVideo ? (
                  <video
                    src={post.media.getDirectURL()}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={post.media.getDirectURL()}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                  <span className="flex items-center gap-1">
                    ❤️ {Number(post.likeCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    💬 {Number(post.commentCount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
