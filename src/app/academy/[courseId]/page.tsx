'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { useAcademyProgress } from '@/hooks/useAcademyProgress';
import type { Lesson, QuizQuestion } from '../data';
import { getAdjacentLessons, getCourseById, getCourseLessonIds } from '../data';
import './course.css';

function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks
    if (line.trimStart().startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      elements.push(
        <pre key={key++}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // Empty lines
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++}>{renderInline(line.slice(4))}</h3>);
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++}>{renderInline(line.slice(3))}</h2>);
      i++;
      continue;
    }

    // Bullet lists
    if (line.trimStart().startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith('- ')) {
        items.push(lines[i].trimStart().slice(2));
        i++;
      }
      elements.push(
        <ul key={key++}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Table
    if (line.includes('|') && line.trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].includes('|') &&
        lines[i].trim().startsWith('|')
      ) {
        tableLines.push(lines[i]);
        i++;
      }
      const parseRow = (row: string) =>
        row
          .split('|')
          .filter((c) => c.trim() !== '')
          .map((c) => c.trim());
      if (tableLines.length >= 2) {
        const headerCells = parseRow(tableLines[0]);
        const bodyRows = tableLines.slice(2).map(parseRow);
        elements.push(
          <table key={key++}>
            <thead>
              <tr>
                {headerCells.map((cell, ci) => (
                  <th key={ci}>{renderInline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      continue;
    }

    // Paragraph
    elements.push(<p key={key++}>{renderInline(line)}</p>);
    i++;
  }

  return elements;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let k = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const codeMatch = remaining.match(/`([^`]+)`/);

    const boldIdx = boldMatch?.index ?? Infinity;
    const codeIdx = codeMatch?.index ?? Infinity;

    if (boldIdx === Infinity && codeIdx === Infinity) {
      parts.push(remaining);
      break;
    }

    if (boldIdx <= codeIdx && boldMatch) {
      if (boldMatch.index! > 0) {
        parts.push(remaining.slice(0, boldMatch.index!));
      }
      parts.push(<strong key={k++}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index! + boldMatch[0].length);
    } else if (codeMatch) {
      if (codeMatch.index! > 0) {
        parts.push(remaining.slice(0, codeMatch.index!));
      }
      parts.push(<code key={k++}>{codeMatch[1]}</code>);
      remaining = remaining.slice(codeMatch.index! + codeMatch[0].length);
    }
  }

  return parts.length === 1 ? parts[0] : parts;
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const course = useMemo(() => getCourseById(courseId), [courseId]);
  const courseLessonIds = useMemo(() => getCourseLessonIds(courseId), [courseId]);

  const {
    isLoaded,
    isLessonComplete,
    getCourseProgress,
    getCompletedLessonsCount,
    saveQuizScore,
    setLastAccessed,
    getLessonQuizScore,
  } = useAcademyProgress();

  const allLessons = useMemo(
    () => course?.modules.flatMap((m) => m.lessons) ?? [],
    [course]
  );

  const [activeLessonId, setActiveLessonId] = useState<string>('');
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Initialize active lesson and expanded modules
  useEffect(() => {
    if (!course || allLessons.length === 0) return;
    if (!activeLessonId) {
      setActiveLessonId(allLessons[0].id);
      const initialExpanded: Record<string, boolean> = {};
      course.modules.forEach((m) => {
        initialExpanded[m.id] = true;
      });
      setExpandedModules(initialExpanded);
    }
  }, [course, allLessons, activeLessonId]);

  // Track last accessed
  useEffect(() => {
    if (courseId && activeLessonId && isLoaded) {
      setLastAccessed(courseId, activeLessonId);
    }
  }, [courseId, activeLessonId, isLoaded, setLastAccessed]);

  const activeLesson = useMemo(
    () => allLessons.find((l) => l.id === activeLessonId) ?? null,
    [allLessons, activeLessonId]
  );

  const adjacentLessons = useMemo(
    () =>
      courseId && activeLessonId
        ? getAdjacentLessons(courseId, activeLessonId)
        : { prev: null, next: null },
    [courseId, activeLessonId]
  );

  const progress = useMemo(
    () => getCourseProgress(courseLessonIds),
    [getCourseProgress, courseLessonIds]
  );
  const completedCount = useMemo(
    () => getCompletedLessonsCount(courseLessonIds),
    [getCompletedLessonsCount, courseLessonIds]
  );

  const handleLessonSelect = useCallback((lesson: Lesson) => {
    setActiveLessonId(lesson.id);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleModule = useCallback((moduleId: string) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  }, []);

  const handleOptionSelect = useCallback(
    (questionId: string, optionId: string) => {
      if (quizSubmitted) return;
      setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    },
    [quizSubmitted]
  );

  const handleQuizSubmit = useCallback(() => {
    if (!activeLesson) return;
    const quiz = activeLesson.quiz;
    const totalQ = quiz.length;
    const correct = quiz.filter(
      (q) => selectedAnswers[q.id] === q.correctId
    ).length;
    const score = Math.round((correct / totalQ) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    saveQuizScore(activeLesson.id, score);
  }, [activeLesson, selectedAnswers, saveQuizScore]);

  const handleQuizRetry = useCallback(() => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  }, []);

  const allQuestionsAnswered = useMemo(() => {
    if (!activeLesson) return false;
    return activeLesson.quiz.every((q) => selectedAnswers[q.id]);
  }, [activeLesson, selectedAnswers]);

  if (!course) {
    return (
      <>
        <Header />
        <div className="course-not-found">
          <div>
            <h1>Course Not Found</h1>
            <Link href="/academy">← Back to Academy</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="course-layout">
        {/* Mobile sidebar overlay */}
        <div
          className={`course-sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
          role="button"
          tabIndex={-1}
          aria-label="Close sidebar"
        />

        {/* Sidebar */}
        <aside className={`course-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="course-sidebar-header">
            <Link href="/academy" className="course-sidebar-back">
              ← Back to Academy
            </Link>
            <div className="course-sidebar-title">{course.title}</div>
            <div className="course-sidebar-progress">
              <div
                className="course-sidebar-progress-fill"
                style={{ width: `${isLoaded ? progress : 0}%` }}
              />
            </div>
            <div className="course-sidebar-progress-text">
              {isLoaded ? completedCount : 0} of {courseLessonIds.length} lessons
              completed
            </div>
          </div>

          <nav className="course-module-list">
            {course.modules.map((mod) => (
              <div key={mod.id} className="course-module">
                <button
                  type="button"
                  className="course-module-header"
                  onClick={() => toggleModule(mod.id)}
                >
                  <span>{mod.title}</span>
                  <svg
                    className={`course-module-chevron ${expandedModules[mod.id] ? 'expanded' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>

                {expandedModules[mod.id] && (
                  <div className="course-lesson-list">
                    {mod.lessons.map((lesson) => {
                      const isActive = lesson.id === activeLessonId;
                      const isDone = isLoaded && isLessonComplete(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          className={`course-lesson-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                          onClick={() => handleLessonSelect(lesson)}
                        >
                          <span
                            className={`course-lesson-check ${isDone ? 'done' : ''} ${isActive ? 'active-check' : ''}`}
                          >
                            {isDone ? '✓' : ''}
                          </span>
                          <span className="course-lesson-name">
                            {lesson.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile sidebar toggle */}
        <button
          type="button"
          className="course-sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        {/* Main Content */}
        <main className="course-main">
          {/* Course Hero Banner */}
          <div className="course-hero">
            <div className="course-hero-top">
              <span className="course-hero-icon">{course.icon}</span>
              <h1 className="course-hero-title">{course.title}</h1>
            </div>
            <div className="course-hero-meta">
              <span
                className={`academy-difficulty-badge ${course.difficulty.toLowerCase()}`}
              >
                {course.difficulty}
              </span>
              <div className="course-hero-progress">
                <div className="course-hero-progress-bar">
                  <div
                    className="course-hero-progress-fill"
                    style={{ width: `${isLoaded ? progress : 0}%` }}
                  />
                </div>
                <span className="course-hero-progress-text">
                  {isLoaded ? completedCount : 0} of {courseLessonIds.length}{' '}
                  lessons completed
                </span>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          {activeLesson && (
            <div className="course-lesson-content">
              <div className="course-lesson-header">
                <h2 className="course-lesson-title">{activeLesson.title}</h2>
                <div className="course-lesson-duration">
                  🕐 {activeLesson.duration}
                </div>
              </div>

              <div className="course-content-body">
                {renderMarkdown(activeLesson.content)}
              </div>

              {/* Quiz Section */}
              {activeLesson.quiz.length > 0 && (
                <QuizSection
                  quiz={activeLesson.quiz}
                  selectedAnswers={selectedAnswers}
                  quizSubmitted={quizSubmitted}
                  quizScore={quizScore}
                  allQuestionsAnswered={allQuestionsAnswered}
                  previousBestScore={
                    isLoaded
                      ? getLessonQuizScore(activeLesson.id)
                      : undefined
                  }
                  onOptionSelect={handleOptionSelect}
                  onSubmit={handleQuizSubmit}
                  onRetry={handleQuizRetry}
                />
              )}
            </div>
          )}

          {/* Lesson Navigation */}
          <div className="course-lesson-nav">
            {adjacentLessons.prev ? (
              <button
                type="button"
                className="course-lesson-nav-btn"
                onClick={() => handleLessonSelect(adjacentLessons.prev!)}
              >
                ← {adjacentLessons.prev.title}
              </button>
            ) : (
              <div />
            )}
            {adjacentLessons.next ? (
              <button
                type="button"
                className="course-lesson-nav-btn"
                onClick={() => handleLessonSelect(adjacentLessons.next!)}
              >
                {adjacentLessons.next.title} →
              </button>
            ) : (
              <div />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

/* Quiz Section Component */
interface QuizSectionProps {
  quiz: QuizQuestion[];
  selectedAnswers: Record<string, string>;
  quizSubmitted: boolean;
  quizScore: number | null;
  allQuestionsAnswered: boolean;
  previousBestScore: number | undefined;
  onOptionSelect: (questionId: string, optionId: string) => void;
  onSubmit: () => void;
  onRetry: () => void;
}

function QuizSection({
  quiz,
  selectedAnswers,
  quizSubmitted,
  quizScore,
  allQuestionsAnswered,
  previousBestScore,
  onOptionSelect,
  onSubmit,
  onRetry,
}: QuizSectionProps) {
  return (
    <div className="course-quiz-section">
      <h3 className="course-quiz-title">📝 Test Your Knowledge</h3>
      <p className="course-quiz-subtitle">
        Answer all questions and score at least 70% to complete this lesson.
        {previousBestScore !== undefined && (
          <>
            {' '}
            Your best score:{' '}
            <strong
              style={{
                color: previousBestScore >= 70 ? '#4ade80' : '#f87171',
              }}
            >
              {previousBestScore}%
            </strong>
          </>
        )}
      </p>

      {quiz.map((question, idx) => {
        const selectedId = selectedAnswers[question.id];
        return (
          <div key={question.id} className="course-quiz-question">
            <div className="course-quiz-question-text">
              <span className="course-quiz-question-number">
                Q{idx + 1}.{' '}
              </span>
              {question.question}
            </div>
            <div className="course-quiz-options">
              {question.options.map((option) => {
                let optionClass = '';
                if (quizSubmitted) {
                  if (option.id === question.correctId) {
                    optionClass = 'correct';
                  } else if (
                    option.id === selectedId &&
                    option.id !== question.correctId
                  ) {
                    optionClass = 'incorrect';
                  } else {
                    optionClass = 'disabled';
                  }
                  if (
                    option.id === question.correctId &&
                    selectedId !== question.correctId
                  ) {
                    optionClass = 'correct-answer';
                  }
                } else if (option.id === selectedId) {
                  optionClass = 'selected';
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`course-quiz-option ${optionClass} ${quizSubmitted ? 'disabled' : ''}`}
                    onClick={() =>
                      onOptionSelect(question.id, option.id)
                    }
                    disabled={quizSubmitted}
                  >
                    <span className="course-quiz-radio" />
                    <span>{option.text}</span>
                  </button>
                );
              })}
            </div>
            {quizSubmitted && (
              <div className="course-quiz-explanation">
                💡 {question.explanation}
              </div>
            )}
          </div>
        );
      })}

      {/* Score Display */}
      {quizScore !== null && (
        <div
          className={`course-quiz-score ${quizScore >= 70 ? 'passed' : 'failed'}`}
        >
          <div className="course-quiz-score-value">{quizScore}%</div>
          <div className="course-quiz-score-text">
            {quizScore >= 70
              ? 'Great job! Lesson marked as complete.'
              : 'You need at least 70% to pass. Try again!'}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="course-quiz-actions">
        {!quizSubmitted && (
          <button
            type="button"
            className="course-quiz-submit"
            onClick={onSubmit}
            disabled={!allQuestionsAnswered}
          >
            Submit Answers
          </button>
        )}
        {quizSubmitted && (
          <button
            type="button"
            className="course-quiz-retry"
            onClick={onRetry}
          >
            ↻ Retry Quiz
          </button>
        )}
      </div>
    </div>
  );
}
