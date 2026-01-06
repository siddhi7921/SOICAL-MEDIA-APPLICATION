import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  UserProfile,
  Post,
  Comment,
  Message,
  MediaUploadRequest,
} from '../backend';
import { Principal } from '@icp-sdk/core/principal';

/* ================= USER PROFILE ================= */

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}

export function useCreateOrUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      username,
      bio,
    }: {
      username: string;
      bio: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrUpdateProfile(username, bio);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

/* ================= POSTS ================= */

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['allPosts'],
    queryFn: async () => (actor ? actor.getAllPosts() : []),
    enabled: !!actor && !isFetching,
  });
}

export function useGetTrendingPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['trendingPosts'],
    queryFn: async () => (actor ? actor.getTrendingPosts() : []),
    enabled: !!actor && !isFetching,
  });
}

export function useGetShortVideos() {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['shortVideos'],
    queryFn: async () => (actor ? actor.getShortVideos() : []),
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserPosts(userPrincipal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['userPosts', userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !userPrincipal) return [];
      return actor.getUserPosts(userPrincipal);
    },
    enabled: !!actor && !isFetching && !!userPrincipal,
  });
}

/* ================= MUTATIONS ================= */

export function useUploadMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: MediaUploadRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadMedia(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['shortVideos'] });
      queryClient.invalidateQueries({ queryKey: ['trendingPosts'] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['shortVideos'] });
      queryClient.invalidateQueries({ queryKey: ['trendingPosts'] });
    },
  });
}

export function useLikePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['shortVideos'] });
      queryClient.invalidateQueries({ queryKey: ['trendingPosts'] });
    },
  });
}

/* ================= COMMENTS ================= */

export function useCommentOnPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: bigint;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.commentOnPost(postId, content);
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({
        queryKey: ['postComments', postId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
    },
  });
}

export function useGetPostComments(postId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Comment[]>({
    queryKey: ['postComments', postId?.toString()],
    queryFn: async () => {
      if (!actor || !postId) return [];
      return actor.getPostComments(postId);
    },
    enabled: !!actor && !isFetching && !!postId,
  });
}

/* ================= MESSAGES ================= */

export function useGetMessages(otherUser: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages', otherUser?.toString()],
    queryFn: async () => {
      if (!actor || !otherUser) return [];
      return actor.getMessages(otherUser);
    },
    enabled: !!actor && !isFetching && !!otherUser,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      receiver,
      content,
    }: {
      receiver: Principal;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(receiver, content);
    },
    onSuccess: (_, { receiver }) => {
      queryClient.invalidateQueries({
        queryKey: ['messages', receiver.toString()],
      });
    },
  });
}
