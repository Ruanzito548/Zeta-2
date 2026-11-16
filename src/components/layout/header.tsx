/**
 * Header Component
 * Top navigation bar with user menu and notifications
 */

'use client';

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Economic Intelligence Platform
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="User menu"
          >
            👤
          </button>
        </div>
      </div>
    </header>
  );
}
