import FirebaseTestComponent from '@/components/FirebaseTestComponent';

export const metadata = {
  title: 'Firebase Test | Zeta 2',
  description: 'Firebase integration test page',
};

export default function FirebaseTestPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="py-8">
        <FirebaseTestComponent />
      </div>
    </main>
  );
}
