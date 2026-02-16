'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  ForumPost,
  ForumComment,
  ForumVote,
  ForumCategory,
  SortMode,
} from '@/lib/forum-types';

// ── Post Listing ──────────────────────────────────────────

export function useForumPosts(
  category: ForumCategory | 'all',
  sort: SortMode,
  search: string
) {
  return useQuery<ForumPost[]>({
    queryKey: ['forum-posts', category, sort, search],
    queryFn: async () => {
      let query = supabase.from('forum_posts').select('*');

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      if (search.trim()) {
        const term = `%${search.trim()}%`;
        query = query.or(`title.ilike.${term},body.ilike.${term}`);
      }

      switch (sort) {
        case 'new':
          query = query.order('created_at', { ascending: false });
          break;
        case 'top':
          query = query.order('vote_score', { ascending: false });
          break;
        case 'hot':
          query = query
            .order('vote_score', { ascending: false })
            .order('created_at', { ascending: false });
          break;
      }

      query = query.limit(50);

      const { data, error } = await query;
      if (error) throw error;
      return data as ForumPost[];
    },
  });
}

// ── Single Post ───────────────────────────────────────────

export function useForumPost(postId: string) {
  return useQuery<ForumPost>({
    queryKey: ['forum-post', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('id', postId)
        .single();
      if (error) throw error;
      return data as ForumPost;
    },
    enabled: !!postId,
  });
}

// ── Comments ──────────────────────────────────────────────

export function useForumComments(postId: string) {
  return useQuery<ForumComment[]>({
    queryKey: ['forum-comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as ForumComment[];
    },
    enabled: !!postId,
  });
}

// ── User Votes ────────────────────────────────────────────

export function useUserVotes(wallet: string | undefined, targetIds: string[]) {
  return useQuery<ForumVote[]>({
    queryKey: ['forum-votes', wallet, targetIds],
    queryFn: async () => {
      if (!wallet || targetIds.length === 0) return [];
      const { data, error } = await supabase
        .from('forum_votes')
        .select('*')
        .eq('voter_address', wallet)
        .in('target_id', targetIds);
      if (error) throw error;
      return data as ForumVote[];
    },
    enabled: !!wallet && targetIds.length > 0,
  });
}

// ── Create Post ───────────────────────────────────────────

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: {
      title: string;
      body: string;
      category: ForumCategory;
      author_address: string;
    }) => {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert(post)
        .select()
        .single();
      if (error) throw error;
      return data as ForumPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    },
  });
}

// ── Create Comment ────────────────────────────────────────

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: {
      post_id: string;
      parent_id: string | null;
      body: string;
      author_address: string;
      depth: number;
    }) => {
      const { data, error } = await supabase
        .from('forum_comments')
        .insert(comment)
        .select()
        .single();
      if (error) throw error;
      return data as ForumComment;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['forum-comments', variables.post_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['forum-post', variables.post_id],
      });
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    },
  });
}

// ── Vote ──────────────────────────────────────────────────

export function useVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      voter_address: string;
      target_type: 'post' | 'comment';
      target_id: string;
      value: number;
    }) => {
      const { error } = await supabase.rpc('handle_vote', {
        p_voter_address: params.voter_address,
        p_target_type: params.target_type,
        p_target_id: params.target_id,
        p_value: params.value,
      });
      if (error) throw error;
    },
    onMutate: async (params) => {
      // Optimistic update for posts
      if (params.target_type === 'post') {
        await queryClient.cancelQueries({ queryKey: ['forum-posts'] });
        await queryClient.cancelQueries({
          queryKey: ['forum-post', params.target_id],
        });
      }
    },
    onSettled: (_data, _error, params) => {
      // Refetch everything relevant
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      queryClient.invalidateQueries({ queryKey: ['forum-votes'] });
      if (params.target_type === 'post') {
        queryClient.invalidateQueries({
          queryKey: ['forum-post', params.target_id],
        });
      }
      if (params.target_type === 'comment') {
        queryClient.invalidateQueries({ queryKey: ['forum-comments'] });
      }
    },
  });
}

// ── Real-time Subscriptions ───────────────────────────────

export function useForumRealtime(postId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('forum-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'forum_posts' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
          if (postId) {
            queryClient.invalidateQueries({
              queryKey: ['forum-post', postId],
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_comments',
          ...(postId ? { filter: `post_id=eq.${postId}` } : {}),
        },
        () => {
          if (postId) {
            queryClient.invalidateQueries({
              queryKey: ['forum-comments', postId],
            });
            queryClient.invalidateQueries({
              queryKey: ['forum-post', postId],
            });
          }
          queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, postId]);
}
