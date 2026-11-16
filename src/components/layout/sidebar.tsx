/**
 * Sidebar Navigation Component
 * Left sidebar with main navigation menu
 */

'use client';

import Link from 'next/link';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: '📊',
  },
  {
    name: 'Professions',
    href: '/professions',
    icon: '🔨',
  },
  {
    name: 'Market',
    href: '/market',
    icon: '💰',
  },
  {
    name: 'Crafting',
    href: '/crafting',
    icon: '🛠️',
  },
  {
    name: 'Guild',
    href: '/guild',
    icon: '🏰',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: '⚙️',
  },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex h-full flex-col">
        <div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Zeta 2
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            WoW Forever Economics
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-4 py-2 text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              Version 1.0.0
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Foundation Phase
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
