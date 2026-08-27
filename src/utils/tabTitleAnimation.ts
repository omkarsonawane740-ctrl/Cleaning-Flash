/**
 * Tab Title Animation Utility
 * Flashes the browser tab document.title with cleaning emojis during active operations.
 */

const DEFAULT_TITLE = 'My Google AI Studio App';
let originalTitle = typeof document !== 'undefined' ? (document.title || DEFAULT_TITLE) : DEFAULT_TITLE;
let cleaningTitleInterval: ReturnType<typeof setInterval> | null = null;
let activeOperationsCount = 0;

/**
 * Start flashing the browser tab title between '🧹 Cleaning...' and '✨ Cleaning...'
 */
export function startCleaningTabTitle(): void {
  if (typeof document === 'undefined') return;

  activeOperationsCount++;

  // Preserve the true original title (don't save the temporary flashing string as original)
  if (document.title && !document.title.includes('Cleaning...')) {
    originalTitle = document.title;
  } else if (!originalTitle) {
    originalTitle = DEFAULT_TITLE;
  }

  // If already flashing, don't start a duplicate interval
  if (cleaningTitleInterval !== null) {
    return;
  }

  let flash = false;
  document.title = '🧹 Cleaning...';

  cleaningTitleInterval = setInterval(() => {
    document.title = flash ? '✨ Cleaning...' : '🧹 Cleaning...';
    flash = !flash;
  }, 600);
}

/**
 * Stop flashing the browser tab title and restore the original document.title
 * @param force - If true, immediately resets count to 0 and restores title
 */
export function stopCleaningTabTitle(force = false): void {
  if (typeof document === 'undefined') return;

  if (force) {
    activeOperationsCount = 0;
  } else {
    activeOperationsCount = Math.max(0, activeOperationsCount - 1);
  }

  if (activeOperationsCount === 0) {
    if (cleaningTitleInterval !== null) {
      clearInterval(cleaningTitleInterval);
      cleaningTitleInterval = null;
    }
    document.title = originalTitle || DEFAULT_TITLE;
  }
}

/**
 * Execute an async cleaning or processing operation with automatic tab title flashing.
 * Automatically stops and restores the title on completion or error.
 */
export async function withCleaningTabTitle<T>(operation: () => Promise<T>): Promise<T> {
  startCleaningTabTitle();
  try {
    const result = await operation();
    return result;
  } catch (error) {
    stopCleaningTabTitle(true);
    throw error;
  } finally {
    stopCleaningTabTitle();
  }
}
