export type ForumCategory =
  | 'general'
  | 'move'
  | 'defi'
  | 'nfts'
  | 'walrus'
  | 'seal'
  | 'deepbook'
  | 'gaming'
  | 'help'
  | 'showcase';

export type SortMode = 'new' | 'hot' | 'top';

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
}

export interface ForumPost {
  id: string;
  title: string;
  body: string;
  category: ForumCategory;
  author_address: string;
  vote_score: number;
  comment_count: number;
  created_at: string;
  media?: MediaAttachment[];
}

export interface ForumComment {
  id: string;
  post_id: string;
  parent_id: string | null;
  body: string;
  author_address: string;
  vote_score: number;
  depth: number;
  created_at: string;
}

export interface ForumVote {
  id: string;
  voter_address: string;
  target_type: 'post' | 'comment';
  target_id: string;
  value: number;
}

export interface CommentTreeNode extends ForumComment {
  children: CommentTreeNode[];
}

export const FORUM_CATEGORIES: { value: ForumCategory; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'move', label: 'Move' },
  { value: 'defi', label: 'DeFi' },
  { value: 'nfts', label: 'NFTs' },
  { value: 'walrus', label: 'Walrus' },
  { value: 'seal', label: 'Seal' },
  { value: 'deepbook', label: 'DeepBook' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'help', label: 'Help' },
  { value: 'showcase', label: 'Showcase' },
];

export const MAX_COMMENT_DEPTH = 4;
