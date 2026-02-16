'use client';

import { useState, useRef, useCallback } from 'react';
import { FORUM_CATEGORIES, type ForumCategory, type ForumPost, type MediaAttachment } from '@/lib/forum-types';

interface CreatePostFormProps {
  authorAddress: string;
  onClose: () => void;
  onSubmit: (post: ForumPost) => void;
}

const ACCEPTED_IMAGES = 'image/jpeg,image/png,image/gif,image/webp';
const ACCEPTED_VIDEOS = 'video/mp4,video/webm,video/quicktime';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 6;

export function CreatePostForm({ authorAddress, onClose, onSubmit }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<ForumCategory>('general');
  const [media, setMedia] = useState<MediaAttachment[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit =
    title.trim().length >= 3 &&
    title.trim().length <= 200 &&
    body.trim().length >= 1 &&
    body.trim().length <= 10000;

  const processFiles = useCallback((files: FileList | File[]) => {
    setFileError('');
    const fileArr = Array.from(files);

    if (media.length + fileArr.length > MAX_FILES) {
      setFileError(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    const newMedia: MediaAttachment[] = [];

    for (const file of fileArr) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`"${file.name}" exceeds 50MB limit`);
        continue;
      }

      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        setFileError(`"${file.name}" is not a supported format`);
        continue;
      }

      const url = URL.createObjectURL(file);
      newMedia.push({
        id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: isImage ? 'image' : 'video',
        url,
        name: file.name,
      });
    }

    if (newMedia.length > 0) {
      setMedia((prev) => [...prev, ...newMedia]);
    }
  }, [media.length]);

  const removeMedia = (id: string) => {
    setMedia((prev) => {
      const item = prev.find((m) => m.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return prev.filter((m) => m.id !== id);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      body: body.trim(),
      category,
      author_address: authorAddress,
      vote_score: 1,
      comment_count: 0,
      created_at: new Date().toISOString(),
      media: media.length > 0 ? media : undefined,
    };

    onSubmit(newPost);
    setTitle('');
    setBody('');
    setCategory('general');
    setMedia([]);
    onClose();
  };

  return (
    <form className="forum-create-form" onSubmit={handleSubmit}>
      <h3 className="forum-create-form-title">Start a Discussion</h3>

      <div className="forum-form-row">
        <input
          type="text"
          className="forum-input"
          placeholder="Discussion title (3-200 characters)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
        />
      </div>

      <div className="forum-form-row">
        <select
          className="forum-select"
          value={category}
          onChange={(e) => setCategory(e.target.value as ForumCategory)}
        >
          {FORUM_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="forum-form-row">
        <textarea
          className="forum-textarea"
          placeholder="What do you want to discuss? (1-10,000 characters)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={10000}
        />
      </div>

      {/* Media upload area */}
      <div className="forum-form-row">
        <div
          className={`forum-upload-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={`${ACCEPTED_IMAGES},${ACCEPTED_VIDEOS}`}
            multiple
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
          <div className="forum-upload-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="forum-upload-text">
            Drag & drop images or videos, or <span className="forum-upload-browse">browse</span>
          </p>
          <p className="forum-upload-hint">
            JPG, PNG, GIF, WebP, MP4, WebM &middot; Max 50MB &middot; Up to {MAX_FILES} files
          </p>
        </div>

        {fileError && (
          <p className="forum-upload-error">{fileError}</p>
        )}
      </div>

      {/* Media previews */}
      {media.length > 0 && (
        <div className="forum-media-previews">
          {media.map((item) => (
            <div key={item.id} className="forum-media-preview">
              <button
                type="button"
                className="forum-media-remove"
                onClick={(e) => { e.stopPropagation(); removeMedia(item.id); }}
                aria-label="Remove"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              {item.type === 'image' ? (
                <img src={item.url} alt={item.name} className="forum-media-thumb" />
              ) : (
                <div className="forum-media-video-thumb">
                  <video src={item.url} className="forum-media-thumb" muted />
                  <div className="forum-media-play-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
              )}
              <span className="forum-media-name">{item.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="forum-form-actions">
        <button type="button" className="forum-cancel-btn" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="forum-submit-btn" disabled={!canSubmit}>
          Publish
        </button>
      </div>
    </form>
  );
}
