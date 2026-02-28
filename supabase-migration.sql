-- ============================================================
-- Sui Academy Community Forum — Supabase Migration
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. TABLES
-- ----------------------------------------------------------

CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 200),
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 10000),
  category TEXT NOT NULL CHECK (category IN (
    'general','move','defi','nfts','walrus','seal','deepbook','gaming','help','showcase'
  )),
  author_address TEXT NOT NULL CHECK (char_length(author_address) > 0),
  vote_score INT NOT NULL DEFAULT 0,
  comment_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES forum_comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 5000),
  author_address TEXT NOT NULL CHECK (char_length(author_address) > 0),
  vote_score INT NOT NULL DEFAULT 0,
  depth INT NOT NULL DEFAULT 0 CHECK (depth BETWEEN 0 AND 4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE forum_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_address TEXT NOT NULL CHECK (char_length(voter_address) > 0),
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id UUID NOT NULL,
  value INT NOT NULL CHECK (value IN (-1, 1)),
  UNIQUE (voter_address, target_type, target_id)
);

-- 2. INDEXES
-- ----------------------------------------------------------

CREATE INDEX idx_posts_category ON forum_posts(category);
CREATE INDEX idx_posts_created ON forum_posts(created_at DESC);
CREATE INDEX idx_posts_score ON forum_posts(vote_score DESC);
CREATE INDEX idx_comments_post ON forum_comments(post_id);
CREATE INDEX idx_comments_parent ON forum_comments(parent_id);
CREATE INDEX idx_votes_target ON forum_votes(target_type, target_id);
CREATE INDEX idx_votes_voter ON forum_votes(voter_address);

-- 3. FUNCTIONS
-- ----------------------------------------------------------

-- Atomic vote handler: upsert vote + update cached score
CREATE OR REPLACE FUNCTION handle_vote(
  p_voter_address TEXT,
  p_target_type TEXT,
  p_target_id UUID,
  p_value INT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  old_value INT;
  score_delta INT;
BEGIN
  -- Try to get existing vote
  SELECT value INTO old_value
  FROM forum_votes
  WHERE voter_address = p_voter_address
    AND target_type = p_target_type
    AND target_id = p_target_id;

  IF old_value IS NOT NULL THEN
    IF old_value = p_value THEN
      -- Same vote again → remove it (toggle off)
      DELETE FROM forum_votes
      WHERE voter_address = p_voter_address
        AND target_type = p_target_type
        AND target_id = p_target_id;
      score_delta := -old_value;
    ELSE
      -- Different vote → update
      UPDATE forum_votes
      SET value = p_value
      WHERE voter_address = p_voter_address
        AND target_type = p_target_type
        AND target_id = p_target_id;
      score_delta := p_value - old_value;
    END IF;
  ELSE
    -- New vote
    INSERT INTO forum_votes (voter_address, target_type, target_id, value)
    VALUES (p_voter_address, p_target_type, p_target_id, p_value);
    score_delta := p_value;
  END IF;

  -- Update cached score
  IF p_target_type = 'post' THEN
    UPDATE forum_posts SET vote_score = vote_score + score_delta WHERE id = p_target_id;
  ELSIF p_target_type = 'comment' THEN
    UPDATE forum_comments SET vote_score = vote_score + score_delta WHERE id = p_target_id;
  END IF;
END;
$$;

-- Trigger function to increment comment count on post
CREATE OR REPLACE FUNCTION increment_comment_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE forum_posts
  SET comment_count = comment_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_increment_comment_count
AFTER INSERT ON forum_comments
FOR EACH ROW
EXECUTE FUNCTION increment_comment_count();

-- 4. ROW LEVEL SECURITY
-- ----------------------------------------------------------

ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_votes ENABLE ROW LEVEL SECURITY;

-- SELECT: open to all
CREATE POLICY "Anyone can read posts" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Anyone can read comments" ON forum_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can read votes" ON forum_votes FOR SELECT USING (true);

-- INSERT: anyone with a non-empty author address
CREATE POLICY "Anyone can create posts" ON forum_posts FOR INSERT WITH CHECK (char_length(author_address) > 0);
CREATE POLICY "Anyone can create comments" ON forum_comments FOR INSERT WITH CHECK (char_length(author_address) > 0);
CREATE POLICY "Anyone can create votes" ON forum_votes FOR INSERT WITH CHECK (char_length(voter_address) > 0);

-- UPDATE: allow updating own posts/comments, and allow score updates
CREATE POLICY "Allow post updates" ON forum_posts FOR UPDATE USING (true);
CREATE POLICY "Allow comment updates" ON forum_comments FOR UPDATE USING (true);

-- DELETE: allow vote deletion (for toggle-off)
CREATE POLICY "Allow vote deletion" ON forum_votes FOR DELETE USING (true);

-- 5. REALTIME
-- ----------------------------------------------------------

ALTER PUBLICATION supabase_realtime ADD TABLE forum_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE forum_comments;
