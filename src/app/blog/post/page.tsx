'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './post-blog.css';

const BLOG_CATEGORIES = [
    'Gaming', 'DeFi', 'NFTs', 'Enterprise', 'Infrastructure',
    'Development', 'Design', 'Community', 'Education', 'Ecosystem',
    'Builders', 'Lifestyle', 'Research', 'Events', 'Culture',
];
const BLOG_TYPES = [
    'Announcement', 'Update', 'Technical', 'Guide', 'Community',
    'Tutorial', 'Opinion', 'Review', 'Interview', 'Case Study',
    'Newsletter', 'Recap', 'Spotlight',
];

const STEP_LABELS = ['Details', 'Write', 'Publish'];

function CodeBlock({ code }: { code: string }) {
    const [copied, setCopied] = React.useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <pre className="article-code">
            <button className="article-code-copy" onClick={handleCopy} title="Copy code">
                {copied ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                )}
            </button>
            <code>{code}</code>
        </pre>
    );
}

function renderInline(text: string) {
    // Parse ==highlight==, **bold**, and *italic* inline
    const parts = text.split(/(==.+?==|\*\*.+?\*\*|\*.+?\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('==') && part.endsWith('==')) {
            return <mark key={i} className="article-highlight">{part.slice(2, -2)}</mark>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
    });
}

function renderMarkdownToJSX(content: string, imageMap: Record<string, string> = {}) {
    return content.split('\n\n').map((block, i) => {
        if (block.startsWith('## ')) return <h2 key={i} className="article-h2">{block.replace('## ', '')}</h2>;
        if (block.startsWith('### ')) return <h3 key={i} className="article-h3">{block.replace('### ', '')}</h3>;
        const imgMatch = block.match(/^!\[(.+?)\]\((.+?)\)$/);
        if (imgMatch) {
            const src = imgMatch[2].startsWith('image:') ? imageMap[imgMatch[2]] : imgMatch[2];
            const useImg = src?.startsWith('data:');
            if (!src) return null;
            return (
                <figure key={i} className="article-figure">
                    <div className="article-figure-image">
                        {useImg ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={src} alt={imgMatch[1]} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                        ) : (
                            <Image src={src} alt={imgMatch[1]} fill className="object-cover" />
                        )}
                    </div>
                    <figcaption className="article-figure-caption">{imgMatch[1]}</figcaption>
                </figure>
            );
        }
        if (block.trim() === '---') return <hr key={i} className="article-divider" />;
        if (block.startsWith('> ')) {
            const text = block.split('\n').map(l => l.replace(/^>\s?/, '')).join('\n');
            return <blockquote key={i} className="article-blockquote">{text}</blockquote>;
        }
        if (block.startsWith('```')) {
            const lines = block.split('\n');
            const code = lines.slice(1, -1).join('\n');
            return <CodeBlock key={i} code={code} />;
        }
        if (block.startsWith('- ')) {
            const items = block.split('\n').filter(l => l.startsWith('- '));
            return (
                <ul key={i} className="article-list">
                    {items.map((item, j) => {
                        const text = item.replace(/^- /, '');
                        const boldMatch = text.match(/^\*\*(.+?)\*\*:?\s*(.*)/);
                        if (boldMatch) return <li key={j}><strong>{boldMatch[1]}</strong>{boldMatch[2] ? `: ${boldMatch[2]}` : ''}</li>;
                        return <li key={j}>{text}</li>;
                    })}
                </ul>
            );
        }
        if (block.startsWith('1. ')) {
            const items = block.split('\n').filter(l => /^\d+\. /.test(l));
            return (
                <ol key={i} className="article-list article-list-ordered">
                    {items.map((item, j) => {
                        const text = item.replace(/^\d+\.\s/, '');
                        if (text.match(/`(.+?)`/g)) {
                            const parts = text.split(/`(.+?)`/);
                            return <li key={j}>{parts.map((part, k) => k % 2 === 1 ? <code key={k} className="article-inline-code">{part}</code> : <span key={k}>{part}</span>)}</li>;
                        }
                        return <li key={j}>{text}</li>;
                    })}
                </ol>
            );
        }
        if (!block.trim()) return null;
        return <p key={i} className="article-paragraph">{renderInline(block)}</p>;
    });
}

/* Get pixel coordinates for a position inside a textarea using a mirror div */
function getCaretCoords(ta: HTMLTextAreaElement, pos: number) {
    const div = document.createElement('div');
    const cs = getComputedStyle(ta);
    const props = [
        'font-family', 'font-size', 'font-weight', 'font-style', 'letter-spacing',
        'line-height', 'padding-top', 'padding-left', 'padding-right', 'padding-bottom',
        'border-top-width', 'border-left-width', 'border-right-width', 'border-bottom-width',
        'box-sizing', 'width', 'word-wrap', 'overflow-wrap',
    ];
    props.forEach(p => div.style.setProperty(p, cs.getPropertyValue(p)));
    div.style.position = 'absolute';
    div.style.left = '-9999px';
    div.style.top = '-9999px';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordWrap = 'break-word';

    const textNode = document.createTextNode(ta.value.substring(0, pos));
    const marker = document.createElement('span');
    marker.textContent = '\u200b';
    div.appendChild(textNode);
    div.appendChild(marker);
    document.body.appendChild(div);
    const top = marker.offsetTop;
    const left = marker.offsetLeft;
    document.body.removeChild(div);
    return { top, left };
}

export default function PostBlogPage() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    /* Step 1 state */
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState('');
    const [typeOpen, setTypeOpen] = useState(false);
    const [typeSearch, setTypeSearch] = useState('');
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    /* Step 2 state */
    const [content, setContent] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [floatBar, setFloatBar] = useState<{ show: boolean; x: number; y: number }>({ show: false, x: 0, y: 0 });
    const [plusBtn, setPlusBtn] = useState<{ show: boolean; top: number }>({ show: false, top: 0 });
    const [plusOpen, setPlusOpen] = useState(false);
    const [showTips, setShowTips] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({});
    const imageCountRef = useRef(0);

    /* Refs */
    const coverInputRef = useRef<HTMLInputElement>(null);
    const contentImageInputRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLDivElement>(null);
    const typeRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const plusRef = useRef<HTMLDivElement>(null);
    const tipsRef = useRef<HTMLDivElement>(null);
    const cursorPos = useRef({ start: 0, end: 0 });

    /* Close dropdowns on outside click */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryOpen(false);
            if (typeRef.current && !typeRef.current.contains(e.target as Node)) setTypeOpen(false);
            if (plusRef.current && !plusRef.current.contains(e.target as Node)) setPlusOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    /* Dedicated close handler for tips — only active when open */
    useEffect(() => {
        if (!showTips) return;
        const handler = (e: MouseEvent) => {
            if (tipsRef.current && !tipsRef.current.contains(e.target as Node)) {
                setShowTips(false);
            }
        };
        // Use setTimeout so the opening click doesn't immediately trigger close
        const timer = setTimeout(() => document.addEventListener('mousedown', handler), 0);
        return () => { clearTimeout(timer); document.removeEventListener('mousedown', handler); };
    }, [showTips]);

    /* Cover image */
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setCoverPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    /* ── Floating toolbar + "+" button logic ── */
    const updateEditorUI = useCallback(() => {
        const ta = editorRef.current;
        if (!ta) return;
        const { selectionStart, selectionEnd } = ta;
        cursorPos.current = { start: selectionStart, end: selectionEnd };

        if (selectionStart !== selectionEnd) {
            // Text is selected → show floating format bar
            const midpoint = Math.floor((selectionStart + selectionEnd) / 2);
            const coords = getCaretCoords(ta, midpoint);
            const taRect = ta.getBoundingClientRect();
            setFloatBar({
                show: true,
                x: taRect.left + coords.left,
                y: taRect.top + coords.top - ta.scrollTop,
            });
            setPlusBtn({ show: false, top: 0 });
            setPlusOpen(false);
        } else {
            // No selection → hide float bar
            setFloatBar({ show: false, x: 0, y: 0 });

            // Check if current line is empty → show "+" button
            const text = ta.value;
            const lineStart = text.lastIndexOf('\n', selectionStart - 1) + 1;
            const lineEnd = text.indexOf('\n', selectionStart);
            const currentLine = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);

            if (currentLine.trim() === '') {
                const coords = getCaretCoords(ta, selectionStart);
                const taRect = ta.getBoundingClientRect();
                setPlusBtn({
                    show: true,
                    top: taRect.top + coords.top - ta.scrollTop,
                });
            } else {
                setPlusBtn({ show: false, top: 0 });
                setPlusOpen(false);
            }
        }
    }, []);

    /* Hide floating bar on scroll (re-calculate would be better but hide is simpler) */
    useEffect(() => {
        const ta = editorRef.current;
        if (!ta || step !== 2) return;
        const onScroll = () => {
            setFloatBar(f => f.show ? { ...f, show: false } : f);
            setPlusBtn(p => p.show ? { ...p, show: false } : p);
            setPlusOpen(false);
        };
        ta.addEventListener('scroll', onScroll);
        return () => ta.removeEventListener('scroll', onScroll);
    }, [step]);

    /* Insert markdown at cursor */
    const insertAtCursor = useCallback((before: string, after = '') => {
        const ta = editorRef.current;
        if (!ta) return;
        const { start, end } = cursorPos.current;
        const selected = content.substring(start, end);
        const insertion = before + (selected || '') + after;
        const newContent = content.substring(0, start) + insertion + content.substring(end);
        setContent(newContent);
        setFloatBar({ show: false, x: 0, y: 0 });
        setPlusBtn({ show: false, top: 0 });
        setPlusOpen(false);
        requestAnimationFrame(() => {
            ta.focus();
            const pos = start + insertion.length;
            ta.setSelectionRange(pos, pos);
            cursorPos.current = { start: pos, end: pos };
        });
    }, [content]);

    /* Insert a block element from "+" menu */
    const insertBlock = useCallback((type: string) => {
        const blocks: Record<string, string> = {
            h2: '\n\n## Heading\n\n',
            image: '\n\n![Alt text](image-url)\n\n',
            code: '\n\n```\ncode here\n```\n\n',
            divider: '\n\n---\n\n',
            quote: '\n\n> Quote text\n\n',
            bullet: '\n\n- Item 1\n- Item 2\n- Item 3\n\n',
            numbered: '\n\n1. First item\n2. Second item\n3. Third item\n\n',
        };
        insertAtCursor(blocks[type] || '');
    }, [insertAtCursor]);

    /* Content image upload — stores data URL separately, inserts clean placeholder */
    const handleContentImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            imageCountRef.current += 1;
            const id = `image:${imageCountRef.current}`;
            const name = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9 ]/g, ' ').trim() || 'Image';
            setUploadedImages(prev => ({ ...prev, [id]: dataUrl }));
            insertAtCursor(`\n![${name}](${id})\n`);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }, [insertAtCursor]);

    /* Validation */
    const stepValid = step === 1
        ? !!(title && description && selectedCategory && selectedType)
        : step === 2 ? content.length >= 50 : true;

    const handlePublish = async () => {
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 2000));
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const resetAll = () => {
        setIsSubmitted(false);
        setStep(1);
        setTitle('');
        setDescription('');
        setSelectedCategory('');
        setSelectedType('');
        setCoverPreview(null);
        setContent('');
        setShowPreview(false);
        setUploadedImages({});
        imageCountRef.current = 0;
    };

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const chevronSvg = (
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
    const checkSvg = (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#008751" strokeWidth="2" style={{ flexShrink: 0 }}>
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
    const searchSvg = (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
    );

    /* ═══════ Success ═══════ */
    if (isSubmitted) {
        return (
            <div className="pb">
                <div className="pb-topbar">
                    <Link href="/blog" className="pb-back">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Blog
                    </Link>
                </div>
                <div className="pb-success">
                    <div className="pb-success-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <h1 className="pb-success-title">Published</h1>
                    <p className="pb-success-sub">&ldquo;{title || 'Untitled Article'}&rdquo; has been submitted and will be reviewed shortly.</p>
                    <div className="pb-success-actions">
                        <Link href="/blog" className="pb-action">Browse Blog</Link>
                        <button className="pb-action pb-action-secondary" onClick={resetAll}>Write Another</button>
                    </div>
                </div>
            </div>
        );
    }

    /* ═══════ Main Shell ═══════ */
    return (
        <div className="pb">
            {/* ── Top Bar ── */}
            <div className="pb-topbar">
                {step === 1 ? (
                    <Link href="/blog" className="pb-back">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Blog
                    </Link>
                ) : (
                    <button className="pb-back" onClick={() => { setStep(step - 1); setShowPreview(false); setFloatBar({ show: false, x: 0, y: 0 }); setPlusBtn({ show: false, top: 0 }); }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Back
                    </button>
                )}

                <div className="pb-topbar-sep" />

                <div className="pb-steps">
                    {[1, 2, 3].map(s => (
                        <button key={s} className={`pb-step-dot${s === step ? ' active' : ''}${s < step ? ' completed' : ''}`}
                            onClick={() => { if (s < step) { setStep(s); setShowPreview(false); } }} disabled={s > step} />
                    ))}
                    <span className="pb-step-label">{STEP_LABELS[step - 1]}</span>
                </div>

                <div className="pb-topbar-spacer" />

                {/* Step 2 topbar extras: word count, preview toggle, tips */}
                {step === 2 && (
                    <div className="pb-topbar-extras">
                        <span className="pb-stat">{wordCount} words</span>
                        <span className="pb-stat">{readTime} min read</span>
                        <div className="pb-topbar-sep" />
                        <button
                            className={`pb-preview-toggle${showPreview ? ' active' : ''}`}
                            onClick={() => setShowPreview(!showPreview)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                            {showPreview ? 'Edit' : 'Preview'}
                        </button>
                        <div className="pb-topbar-sep" />
                        <div className="pb-tips-wrap" ref={tipsRef}>
                            <button className={`pb-tips-trigger${showTips ? ' active' : ''}`} onClick={() => setShowTips(!showTips)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="17" r="0.5" fill="currentColor" /></svg>
                                Tips
                            </button>
                            {showTips && (
                                <div className="pb-tips-popover">
                                    <p className="pb-tips-heading">Writing Tips</p>
                                    <div className="pb-tips-item">
                                        <span className="pb-tips-icon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" /></svg>
                                        </span>
                                        <div>
                                            <strong>Select text to format</strong>
                                            <p>Highlight any text to see formatting options like bold, italic, headings, and links.</p>
                                        </div>
                                    </div>
                                    <div className="pb-tips-item">
                                        <span className="pb-tips-icon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                        </span>
                                        <div>
                                            <strong>Use + to add content</strong>
                                            <p>Click the + button on empty lines to insert images, code blocks, dividers, and lists.</p>
                                        </div>
                                    </div>
                                    <div className="pb-tips-item">
                                        <span className="pb-tips-icon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7" strokeLinecap="round" strokeLinejoin="round" /><line x1="9" y1="20" x2="15" y2="20" strokeLinecap="round" /><line x1="12" y1="4" x2="12" y2="20" strokeLinecap="round" /></svg>
                                        </span>
                                        <div>
                                            <strong>Markdown supported</strong>
                                            <p>Write using markdown syntax — ## for headings, **bold**, - for lists, and ``` for code blocks.</p>
                                        </div>
                                    </div>
                                    <div className="pb-tips-item">
                                        <span className="pb-tips-icon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                        </span>
                                        <div>
                                            <strong>Preview your article</strong>
                                            <p>Click Preview above to see how your article will look when published.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step < 3 ? (
                    <button className="pb-action" disabled={!stepValid} onClick={() => setStep(step + 1)}>
                        Continue
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                ) : (
                    <button className="pb-action" disabled={isSubmitting} onClick={handlePublish}>
                        {isSubmitting ? 'Publishing...' : 'Publish'}
                        {!isSubmitting && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </button>
                )}
            </div>

            {/* ═══════ Step 1: Details ═══════ */}
            {step === 1 && (
                <div className="pb-canvas" data-lenis-prevent>
                    <div className="pb-details">
                        <p className="pb-details-heading">Article Details</p>

                        <div className={`pb-cover${coverPreview ? ' has-image' : ''}`} onClick={() => coverInputRef.current?.click()}>
                            {coverPreview ? (
                                <Image src={coverPreview} alt="Cover" fill className="pb-cover-img" style={{ objectFit: 'cover', borderRadius: '10px' }} />
                            ) : (
                                <div className="pb-cover-placeholder">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                    <span>Add cover image</span>
                                </div>
                            )}
                        </div>
                        <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverChange} className="pb-cover-input" />

                        <div className="pb-field">
                            <label className="pb-label">Title *</label>
                            <input className="pb-input" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="What's your article about?" />
                        </div>

                        <div className="pb-field">
                            <label className="pb-label">Description *</label>
                            <textarea className="pb-input pb-textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="A short summary for the blog card..." rows={3} />
                        </div>

                        <div className="pb-row">
                            <div className="pb-field">
                                <label className="pb-label">Category *</label>
                                <div className="pb-dropdown" ref={categoryRef}>
                                    <button type="button" className={`pb-dropdown-trigger${categoryOpen ? ' open' : ''}`} onClick={() => { setCategoryOpen(!categoryOpen); setCategorySearch(''); }}>
                                        <span className={selectedCategory ? '' : 'placeholder'}>{selectedCategory || 'Select category'}</span>
                                        {chevronSvg}
                                    </button>
                                    {categoryOpen && (
                                        <div className="pb-dropdown-menu">
                                            <div className="pb-dropdown-search">{searchSvg}<input type="text" placeholder="Search..." value={categorySearch} onChange={e => setCategorySearch(e.target.value)} autoFocus /></div>
                                            <div className="pb-dropdown-list" data-lenis-prevent>
                                                {BLOG_CATEGORIES.filter(c => c.toLowerCase().includes(categorySearch.toLowerCase())).map(c => (
                                                    <button key={c} type="button" className={`pb-dropdown-item${selectedCategory === c ? ' selected' : ''}`} onClick={() => { setSelectedCategory(c); setCategoryOpen(false); }}>
                                                        {c}{selectedCategory === c && checkSvg}
                                                    </button>
                                                ))}
                                                {BLOG_CATEGORIES.filter(c => c.toLowerCase().includes(categorySearch.toLowerCase())).length === 0 && <span className="pb-dropdown-empty">No results</span>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="pb-field">
                                <label className="pb-label">Type *</label>
                                <div className="pb-dropdown" ref={typeRef}>
                                    <button type="button" className={`pb-dropdown-trigger${typeOpen ? ' open' : ''}`} onClick={() => { setTypeOpen(!typeOpen); setTypeSearch(''); }}>
                                        <span className={selectedType ? '' : 'placeholder'}>{selectedType || 'Select type'}</span>
                                        {chevronSvg}
                                    </button>
                                    {typeOpen && (
                                        <div className="pb-dropdown-menu">
                                            <div className="pb-dropdown-search">{searchSvg}<input type="text" placeholder="Search..." value={typeSearch} onChange={e => setTypeSearch(e.target.value)} autoFocus /></div>
                                            <div className="pb-dropdown-list" data-lenis-prevent>
                                                {BLOG_TYPES.filter(t => t.toLowerCase().includes(typeSearch.toLowerCase())).map(t => (
                                                    <button key={t} type="button" className={`pb-dropdown-item${selectedType === t ? ' selected' : ''}`} onClick={() => { setSelectedType(t); setTypeOpen(false); }}>
                                                        {t}{selectedType === t && checkSvg}
                                                    </button>
                                                ))}
                                                {BLOG_TYPES.filter(t => t.toLowerCase().includes(typeSearch.toLowerCase())).length === 0 && <span className="pb-dropdown-empty">No results</span>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden file input for content images */}
            <input ref={contentImageInputRef} type="file" accept="image/*" onChange={handleContentImageUpload} style={{ display: 'none' }} />

            {/* ═══════ Step 2: Write (Medium-style) ═══════ */}
            {step === 2 && (
                <div className="pb-write">
                    {/* Floating format bar — appears on text selection */}
                    {floatBar.show && !showPreview && (
                        <div className="pb-float-bar" style={{ top: floatBar.y - 10, left: floatBar.x }} role="toolbar">
                            <button className="pb-float-btn" onMouseDown={e => { e.preventDefault(); insertAtCursor('**', '**'); }} title="Bold">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" /></svg>
                            </button>
                            <button className="pb-float-btn" onMouseDown={e => { e.preventDefault(); insertAtCursor('*', '*'); }} title="Italic">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" /></svg>
                            </button>
                            <div className="pb-float-sep" />
                            <button className="pb-float-btn pb-float-text" onMouseDown={e => { e.preventDefault(); insertAtCursor('\n\n## ', '\n\n'); }} title="Heading">H</button>
                            <button className="pb-float-btn" onMouseDown={e => { e.preventDefault(); insertAtCursor('==', '=='); }} title="Highlight">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 14l3 3v5h6v-5l3-3V9H6v5zm2-3h8v3.17l-3 3V20h-2v-2.83l-3-3V11zm4-10c.56 0 1 .44 1 1v1h-2V2c0-.56.44-1 1-1zM3.5 5.88l1.41-1.41 1.06 1.06-1.41 1.41L3.5 5.88zM1 11h2v2H1v-2zm19-5.06l1.06 1.06-1.41 1.41-1.06-1.06 1.41-1.41zM21 11h2v2h-2v-2z" /></svg>
                            </button>
                            <div className="pb-float-sep" />
                            <button className="pb-float-btn" onMouseDown={e => { e.preventDefault(); insertAtCursor('\n> '); }} title="Quote">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" /></svg>
                            </button>
                            <button className="pb-float-btn" onMouseDown={e => { e.preventDefault(); insertAtCursor('[', '](url)'); }} title="Link">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                        </div>
                    )}

                    {/* Side "+" button — appears on empty lines */}
                    {plusBtn.show && !showPreview && (
                        <div className="pb-plus-wrap" style={{ top: plusBtn.top }} ref={plusRef}>
                            <button
                                className={`pb-plus-btn${plusOpen ? ' open' : ''}`}
                                onMouseDown={e => { e.preventDefault(); setPlusOpen(!plusOpen); }}
                                title="Add content"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                            </button>
                            {plusOpen && (
                                <div className="pb-plus-menu">
                                    <button className="pb-plus-item pb-plus-text" onMouseDown={e => { e.preventDefault(); insertBlock('h2'); }} title="Heading">H</button>
                                    <button className="pb-plus-item" onMouseDown={e => { e.preventDefault(); contentImageInputRef.current?.click(); setPlusOpen(false); }} title="Image">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                    </button>
                                    <button className="pb-plus-item" onMouseDown={e => { e.preventDefault(); insertBlock('code'); }} title="Code block">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6" strokeLinecap="round" strokeLinejoin="round" /><polyline points="8 6 2 12 8 18" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </button>
                                    <button className="pb-plus-item" onMouseDown={e => { e.preventDefault(); insertBlock('divider'); }} title="Divider">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" /></svg>
                                    </button>
                                    <button className="pb-plus-item" onMouseDown={e => { e.preventDefault(); insertBlock('bullet'); }} title="Bullet list">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" /></svg>
                                    </button>
                                    <button className="pb-plus-item" onMouseDown={e => { e.preventDefault(); insertBlock('numbered'); }} title="Numbered list">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" /></svg>
                                    </button>
                                    <button className="pb-plus-item" onMouseDown={e => { e.preventDefault(); insertBlock('quote'); }} title="Quote">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3z" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {showPreview ? (
                        <div className="pb-preview-pane" data-lenis-prevent>
                            <div className="article-content">
                                {content ? renderMarkdownToJSX(content, uploadedImages) : <p className="article-paragraph" style={{ color: '#333' }}>Nothing to preview yet.</p>}
                            </div>
                        </div>
                    ) : (
                        <textarea
                            ref={editorRef}
                            className="pb-editor"
                            data-lenis-prevent
                            value={content}
                            onChange={e => { setContent(e.target.value); setTimeout(updateEditorUI, 0); }}
                            onSelect={updateEditorUI}
                            onKeyUp={updateEditorUI}
                            onClick={updateEditorUI}
                            placeholder="Tell your story..."
                            autoFocus
                        />
                    )}
                </div>
            )}

            {/* ═══════ Step 3: Preview & Publish ═══════ */}
            {step === 3 && (
                <div className="pb-canvas" data-lenis-prevent>
                    <div className="pb-publish">
                        <p className="pb-publish-label">Article Preview</p>
                        <div className="pb-article-preview">
                            <div className="pb-article-hero">
                                {coverPreview && <div className="pb-article-hero-bg"><Image src={coverPreview} alt={title} fill className="object-cover" /></div>}
                                <div className="pb-article-hero-overlay" />
                                <div className="pb-article-hero-content">
                                    <div className="pb-article-tags">
                                        <span className="sui-tag-primary sui-tag-small">{selectedCategory}</span>
                                        <span className="sui-tag-secondary sui-tag-small">{selectedType}</span>
                                    </div>
                                    <h1 className="pb-article-hero-title">{title || 'Untitled Article'}</h1>
                                    <div className="pb-article-hero-meta">
                                        <span>Sui Nigeria</span>
                                        <span className="pb-article-meta-dot" />
                                        <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="pb-article-meta-dot" />
                                        <span>{readTime} Min Read</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pb-article-body">
                                <p className="pb-article-lead">{description}</p>
                                <div className="article-content">{renderMarkdownToJSX(content, uploadedImages)}</div>
                            </div>
                        </div>
                        <p className="pb-disclaimer">By publishing, you confirm this content is original and complies with community guidelines.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
