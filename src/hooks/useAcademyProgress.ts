"use client"

import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY_BASE = "sui-academy-progress"

function getStorageKey(walletAddress: string | null): string {
	if (walletAddress) return `${STORAGE_KEY_BASE}-${walletAddress}`
	return STORAGE_KEY_BASE
}

export interface LessonProgress {
	completed: boolean
	completedAt?: string
	quizScore?: number
	quizAttempts?: number
	lastAttemptAt?: string
}

export interface AcademyProgress {
	lessons: Record<string, LessonProgress>
	lastAccessedCourse?: string
	lastAccessedLesson?: string
	updatedAt: string
}

const defaultProgress: AcademyProgress = {
	lessons: {},
	updatedAt: new Date().toISOString(),
}

function loadProgress(key: string): AcademyProgress {
	if (typeof window === "undefined") return defaultProgress
	try {
		const stored = localStorage.getItem(key)
		if (stored) {
			return JSON.parse(stored)
		}
	} catch {
		// corrupted data, reset
	}
	return { ...defaultProgress, updatedAt: new Date().toISOString() }
}

function persistProgress(key: string, progress: AcademyProgress) {
	if (typeof window === "undefined") return
	try {
		progress.updatedAt = new Date().toISOString()
		localStorage.setItem(key, JSON.stringify(progress))
	} catch {
		// storage full or unavailable
	}
}

export function useAcademyProgress(walletAddress: string | null = null) {
	const [progress, setProgress] = useState<AcademyProgress>(defaultProgress)
	const [isLoaded, setIsLoaded] = useState(false)
	const storageKey = getStorageKey(walletAddress)

	useEffect(() => {
		setProgress(loadProgress(storageKey))
		setIsLoaded(true)
	}, [storageKey])

	const markLessonComplete = useCallback((lessonId: string) => {
		setProgress((prev) => {
			const updated: AcademyProgress = {
				...prev,
				lessons: {
					...prev.lessons,
					[lessonId]: {
						...prev.lessons[lessonId],
						completed: true,
						completedAt: prev.lessons[lessonId]?.completedAt || new Date().toISOString(),
					},
				},
			}
			persistProgress(storageKey, updated)
			return updated
		})
	}, [storageKey])

	const saveQuizScore = useCallback((lessonId: string, score: number) => {
		setProgress((prev) => {
			const existing = prev.lessons[lessonId]
			const bestScore = Math.max(score, existing?.quizScore || 0)
			const shouldComplete = bestScore >= 70
			const updated: AcademyProgress = {
				...prev,
				lessons: {
					...prev.lessons,
					[lessonId]: {
						...existing,
						completed: shouldComplete || existing?.completed || false,
						completedAt: shouldComplete ? (existing?.completedAt || new Date().toISOString()) : existing?.completedAt,
						quizScore: bestScore,
						quizAttempts: (existing?.quizAttempts || 0) + 1,
						lastAttemptAt: new Date().toISOString(),
					},
				},
			}
			persistProgress(storageKey, updated)
			return updated
		})
	}, [storageKey])

	const setLastAccessed = useCallback((courseId: string, lessonId: string) => {
		setProgress((prev) => {
			const updated: AcademyProgress = {
				...prev,
				lastAccessedCourse: courseId,
				lastAccessedLesson: lessonId,
			}
			persistProgress(storageKey, updated)
			return updated
		})
	}, [storageKey])

	const getCourseProgress = useCallback(
		(lessonIds: string[]): number => {
			if (lessonIds.length === 0) return 0
			const completed = lessonIds.filter((id) => progress.lessons[id]?.completed).length
			return Math.round((completed / lessonIds.length) * 100)
		},
		[progress],
	)

	const getOverallProgress = useCallback(
		(allLessonIds: string[]): number => {
			if (allLessonIds.length === 0) return 0
			const completed = allLessonIds.filter((id) => progress.lessons[id]?.completed).length
			return Math.round((completed / allLessonIds.length) * 100)
		},
		[progress],
	)

	const getCompletedLessonsCount = useCallback(
		(lessonIds: string[]): number => {
			return lessonIds.filter((id) => progress.lessons[id]?.completed).length
		},
		[progress],
	)

	const isLessonComplete = useCallback(
		(lessonId: string): boolean => {
			return progress.lessons[lessonId]?.completed || false
		},
		[progress],
	)

	const getLessonQuizScore = useCallback(
		(lessonId: string): number | undefined => {
			return progress.lessons[lessonId]?.quizScore
		},
		[progress],
	)

	const getCompletedCoursesCount = useCallback(
		(courses: { lessonIds: string[] }[]): number => {
			return courses.filter((course) => {
				if (course.lessonIds.length === 0) return false
				return course.lessonIds.every((id) => progress.lessons[id]?.completed)
			}).length
		},
		[progress],
	)

	return {
		progress,
		isLoaded,
		markLessonComplete,
		saveQuizScore,
		setLastAccessed,
		getCourseProgress,
		getOverallProgress,
		getCompletedLessonsCount,
		getCompletedCoursesCount,
		isLessonComplete,
		getLessonQuizScore,
	}
}
