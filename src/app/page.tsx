/**
 * Home/Dashboard Page
 * Initial landing page with system status and quick actions
 */

import { DashboardLayout } from '@/components/layout';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <section>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
            Welcome to Zeta 2
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            Economic Intelligence for World of Warcraft Forever
          </p>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Total Items
            </p>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
              —
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Awaiting data import
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Active Recipes
            </p>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
              —
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Awaiting data import
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Your Characters
            </p>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
              0
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Add characters in settings
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Guild Members
            </p>
            <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
              0
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              No guild configured
            </p>
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Getting Started
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg dark:bg-blue-900">
                1️⃣
              </div>
              <h3 className="mt-3 font-semibold text-zinc-900 dark:text-white">
                Configure Firebase
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Set up your Firebase credentials in environment variables to enable data persistence.
              </p>
            </div>

            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-lg dark:bg-green-900">
                2️⃣
              </div>
              <h3 className="mt-3 font-semibold text-zinc-900 dark:text-white">
                Import Item Database
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Import item data from WoW Forever sources to build your knowledge base.
              </p>
            </div>

            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-lg dark:bg-purple-900">
                3️⃣
              </div>
              <h3 className="mt-3 font-semibold text-zinc-900 dark:text-white">
                Analyze Markets
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Start tracking prices and finding profitable opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* System Status */}
        <section className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            System Status
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-700 dark:text-zinc-300">Firebase Auth</span>
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Not Configured
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-700 dark:text-zinc-300">Database</span>
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Not Configured
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-700 dark:text-zinc-300">Item Database</span>
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Awaiting Import
              </span>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
