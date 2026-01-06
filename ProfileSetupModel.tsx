import { useState } from 'react';
import { useCreateOrUpdateProfile } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const createProfile = useCreateOrUpdateProfile();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedBio = bio.trim();

    // 1️⃣ Empty username check
    if (!trimmedUsername) {
      toast.error('Please enter a username');
      return;
    }

    // 2️⃣ Username format validation (PROPER & MATCHED)
    // Allowed: letters, numbers, ".", "_", "-"
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;

    if (!usernameRegex.test(trimmedUsername)) {
      toast.error(
        "Username can contain only letters, numbers, '.', '_' and '-'"
      );
      return;
    }

    // 3️⃣ Create / Update profile
    try {
      await createProfile.mutateAsync({
        username: trimmedUsername,
        bio: trimmedBio,
      });

      toast.success('Profile created successfully!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create profile');
      }
    }
  };

  return (
    <Dialog open>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Welcome to Siddhiworld!</DialogTitle>
          <DialogDescription>
            Let’s set up your profile to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              autoComplete="off"
              disabled={createProfile.isPending}
            />
            <p className="text-xs text-muted-foreground">
              Letters, numbers, <code>.</code>, <code>_</code>, and <code>-</code> only.
              Max 20 characters.
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio (optional)</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={150}
              disabled={createProfile.isPending}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={createProfile.isPending}
          >
            {createProfile.isPending
              ? 'Creating Profile…'
              : 'Create Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
