import { UserProgress } from '../types';

const STORAGE_KEY = 'sciniraula_user_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  bookmarkedIds: ['projectile-motion'],
  completedExperimentIds: [],
  recentExperimentIds: ['projectile-motion', 'atomic-structure'],
  experimentNotes: {},
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
    };
  } catch (e) {
    return DEFAULT_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to persist user progress:', e);
  }
}

export function toggleBookmarkStorage(id: string): UserProgress {
  const current = loadUserProgress();
  const exists = current.bookmarkedIds.includes(id);
  const updated = {
    ...current,
    bookmarkedIds: exists
      ? current.bookmarkedIds.filter(item => item !== id)
      : [...current.bookmarkedIds, id],
  };
  saveUserProgress(updated);
  return updated;
}

export function markCompletedStorage(id: string): UserProgress {
  const current = loadUserProgress();
  if (current.completedExperimentIds.includes(id)) return current;
  const updated = {
    ...current,
    completedExperimentIds: [...current.completedExperimentIds, id],
  };
  saveUserProgress(updated);
  return updated;
}

export function recordVisitedStorage(id: string): UserProgress {
  const current = loadUserProgress();
  const filtered = current.recentExperimentIds.filter(item => item !== id);
  const updated = {
    ...current,
    recentExperimentIds: [id, ...filtered].slice(0, 8),
    lastVisitedExperimentId: id,
  };
  saveUserProgress(updated);
  return updated;
}
