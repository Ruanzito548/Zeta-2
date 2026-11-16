import { DashboardLayout } from '@/components/layout';

export default function GuildPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
          Guild Management
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Manage guild members and shared economic data.
        </p>
        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-500 dark:text-zinc-400">
            Guild module coming soon...
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
